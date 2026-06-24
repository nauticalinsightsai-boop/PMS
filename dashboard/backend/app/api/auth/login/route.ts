import { after } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';
import { ensureMonorepoEnv } from '@/lib/ensure-monorepo-env';
import { assertSameOrigin } from '@/lib/auth/csrf-origin';
import { isKnownAdminEmail } from '@/lib/auth/known-users';
import {
  getLoginSecuritySettings,
  getUserCredentials,
  isTrustedFingerprint,
  createOtpChallenge,
  verifyUserPasswordRow,
} from '@/lib/auth/auth-db';
import { writeAuthAuditLog } from '@/lib/auth/audit-log';
import { buildLoginSuccessResponse, isLegacyLoginEnabled } from '@/lib/auth/login-session';
import { getLoginFingerprint, maskEmail, phoneLast4 } from '@/lib/auth/login-fingerprint';
import { generateOtpCode, hashOtpCode } from '@/lib/auth/password-crypto';
import { sendAuthEmail, sendLoginOtpEmail, isEmailConfigured, logLoginOtpForDev } from '@/lib/auth/send-email';
import { isTwilioConfigured, sendLoginOtpSms } from '@/lib/auth/twilio-sms';
import { getSessionSecret } from '@/lib/auth/session-token';
import { isSupabaseAdminConfigured } from '@/lib/auth/supabase-admin';

type LoginBody = { email?: string; password?: string };

export async function POST(request: NextRequest) {
  ensureMonorepoEnv();

  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  if (!getSessionSecret()) {
    return NextResponse.json(
      { error: 'AUTH_SESSION_SECRET is not configured' },
      { status: 503 },
    );
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is not configured' },
      { status: 503 },
    );
  }

  let body: LoginBody;
  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase() ?? '';
  const password = body.password ?? '';
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  if (!isKnownAdminEmail(email)) {
    const fp0 = getLoginFingerprint(request);
    void writeAuthAuditLog({
      email,
      eventType: 'login_failed',
      ipAddress: fp0.ip,
      userAgent: fp0.userAgent,
      metadata: { reason: 'not_allowlisted' },
    });
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const [settings, creds] = await Promise.all([
    getLoginSecuritySettings(),
    getUserCredentials(email),
  ]);
  if (!settings.password_login_enabled) {
    return NextResponse.json({ error: 'Password login is disabled' }, { status: 403 });
  }

  let passwordOk = false;
  if (creds?.password_hash) {
    passwordOk = await verifyUserPasswordRow(password, creds);
  } else if (isLegacyLoginEnabled()) {
    passwordOk = true;
  }

  if (!passwordOk) {
    const fpFail = getLoginFingerprint(request);
    void writeAuthAuditLog({
      email,
      eventType: 'login_failed',
      ipAddress: fpFail.ip,
      userAgent: fpFail.userAgent,
      metadata: { reason: 'bad_password' },
    });
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  if (creds?.must_reset_password || settings.force_password_reset) {
    return NextResponse.json(
      { error: 'Password reset required', code: 'PASSWORD_RESET_REQUIRED' },
      { status: 403 },
    );
  }

  const fp = getLoginFingerprint(request);
  const trusted = await isTrustedFingerprint(email, fp.hash);
  const smsOn = settings.sms_new_device_login_enabled;
  const emailOn = settings.email_new_device_login_enabled;
  const otpEnabled = smsOn || emailOn;

  if (trusted || !otpEnabled) {
    void writeAuthAuditLog({
      email,
      eventType: 'login_success',
      ipAddress: fp.ip,
      userAgent: fp.userAgent,
      metadata: { trusted },
    });
    if (settings.login_alerts_enabled && isEmailConfigured()) {
      const alertTo = email;
      const alertIp = fp.ip;
      after(async () => {
        try {
          await sendAuthEmail({
            to: alertTo,
            subject: 'New login to PM Structure dashboard',
            text: `Signed in from ${alertIp} at ${new Date().toISOString()}.`,
          });
        } catch (err) {
          console.error('[login-alert]', err);
        }
      });
    }
    return buildLoginSuccessResponse(email, {});
  }

  const canSms = Boolean(smsOn && creds?.phone_e164 && isTwilioConfigured());
  const canEmail = emailOn && isEmailConfigured();
  const devEmailOtp = emailOn && process.env.NODE_ENV === 'development';

  if (!canSms && !canEmail && !devEmailOtp) {
    return NextResponse.json(
      {
        error: 'OTP delivery is not configured',
        hint: 'Set SMTP_HOST/SMTP_USER/SMTP_PASS or RESEND_API_KEY, enable email OTP in Security settings, or configure Twilio for SMS.',
      },
      { status: 503 },
    );
  }

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const challengeId = await createOtpChallenge({
    email,
    codeHash: hashOtpCode(code),
    fingerprintHash: fp.hash,
    ip: fp.ip,
    userAgent: fp.userAgent,
    expiresAt,
  });

  const otpChannels = { sms: false, email: false };
  const errors: string[] = [];
  const smsTo = creds?.phone_e164;
  const otpEmail = email;

  if (canSms && smsTo) {
    try {
      await sendLoginOtpSms(smsTo, code);
      otpChannels.sms = true;
    } catch (err) {
      errors.push(`SMS: ${err instanceof Error ? err.message : 'failed'}`);
      console.error('[login-otp-sms]', err);
    }
  }

  if (canEmail) {
    try {
      await sendLoginOtpEmail(otpEmail, code);
      otpChannels.email = true;
    } catch (err) {
      errors.push(`Email: ${err instanceof Error ? err.message : 'failed'}`);
      console.error('[login-otp-email]', err);
      logLoginOtpForDev(otpEmail, code);
    }
  } else if (devEmailOtp) {
    logLoginOtpForDev(otpEmail, code);
    otpChannels.email = true;
  }

  if (!otpChannels.sms && !otpChannels.email) {
    return NextResponse.json(
      {
        error: 'Could not deliver login code',
        details: errors,
        hint:
          'Check SMTP_HOST/SMTP_USER/SMTP_PASS on Railway (Gmail: port 465, SMTP_SECURE=true). On Railway use an App Password, not your normal Gmail password.',
      },
      { status: 503 },
    );
  }

  void writeAuthAuditLog({
    email,
    eventType: 'login_otp_sent',
    ipAddress: fp.ip,
    userAgent: fp.userAgent,
    metadata: { challengeId, otpChannels },
  });

  return NextResponse.json({
    success: true,
    requiresOtp: true,
    challengeId,
    phoneLast4: phoneLast4(creds?.phone_e164),
    emailHint: maskEmail(email),
    otpChannels,
  });
}
