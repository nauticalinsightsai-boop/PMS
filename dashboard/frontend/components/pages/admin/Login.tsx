'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ShieldCheck, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { CTAButton } from '@/components/ui/CTAButton';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { siteUrl } from '@/lib/site-config';
import { isSupabaseAuthConfigured } from '@/lib/supabase';
import Link from 'next/link';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, requestPasswordReset } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);
    setFormError('');

    try {
      await login(email, password);
      const redirect = sessionStorage.getItem('redirect_after_login') || '/dashboard';
      sessionStorage.removeItem('redirect_after_login');
      router.replace(redirect);
    } catch (error) {
      console.error('Login failed:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setResetSent(false);

    if (!isSupabaseAuthConfigured) {
      setFormError('Password reset requires Supabase Auth. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      setResetSent(true);
    } catch (error) {
      console.error('Password reset failed:', error);
      setFormError('Could not send reset email. Check the address and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-shell-gradient p-4 relative overflow-hidden">
      <div className="absolute top-0 -left-20 w-96 h-96 bg-brand-orange/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard variant="raised" className="p-8 md:p-10">
          <div className="flex flex-col items-center mb-8">
            <BrandLogo size="lg" />
            <h1 className="text-hero text-3xl sm:text-4xl mt-6">
              {forgotMode ? 'Reset password' : 'Admin Access'}
            </h1>
            <p className="text-muted-foreground text-sm mt-2 text-center">
              {forgotMode
                ? 'We will email you a link to choose a new password'
                : 'Sign in to manage your certification platform'}
            </p>
          </div>

          {forgotMode ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Mail size={14} /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="admin@pms.os"
                  required
                />
              </div>

              {resetSent ? (
                <p className="text-emerald-500 text-xs font-medium text-center">
                  Reset link sent. Check your inbox for <strong>{email.trim()}</strong>.
                </p>
              ) : null}

              {formError ? (
                <p className="text-red-500 text-xs font-medium text-center">{formError}</p>
              ) : null}

              <CTAButton type="submit" className="w-full" disabled={isLoading || resetSent}>
                {isLoading ? 'Sending…' : 'Send reset link'}
              </CTAButton>

              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setFormError('');
                  setResetSent(false);
                }}
                className="w-full text-xs font-semibold text-muted-foreground hover:text-brand-orange transition-colors"
              >
                ← Back to sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Mail size={14} /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="admin@pms.os"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Lock size={14} /> Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotMode(true);
                      setIsError(false);
                      setFormError('');
                    }}
                    className="text-xs font-semibold text-brand-orange hover:underline shrink-0"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brand-orange transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isError && (
                <p className="text-red-500 text-xs font-medium text-center">
                  Invalid credentials. Local dev: <strong>admin@pms.os</strong> / <strong>admin</strong>.
                  Or use a user from Supabase → Authentication → Users.
                </p>
              )}

              <CTAButton type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : (
                  <>
                    Sign In <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </CTAButton>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-3 text-muted-foreground text-xs">
            <p className="flex items-center gap-2">
              <ShieldCheck size={14} /> Secured by Supabase Auth
            </p>
            <Link href={siteUrl} className="hover:text-brand-orange font-semibold transition-colors">
              ← Back to main website
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
