/**
 * Server-only Google Sheets env parsing (never import from client components).
 *
 * Credentials (first match wins):
 * 1. GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH — local file (e.g. .secrets/google-sheets-sa.json)
 * 2. GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64 — production (Railway/Vercel; no filesystem)
 *
 * Inline GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON is not supported (dotenv breaks PEM).
 */

import fs from 'fs';
import path from 'path';

const LOG_PREFIX = '[google-sheets:env]';

/** Log credential mode once per process (no secrets). */
let loggedCredentialMode: GoogleSheetsCredentialSource | null = null;

function logSheetsMode(source: GoogleSheetsCredentialSource, meta?: Record<string, unknown>): void {
  if (source === 'none' || loggedCredentialMode === source) return;
  loggedCredentialMode = source;
  const label = source === 'file' ? 'file' : 'base64';
  console.info(LOG_PREFIX, `Sheets mode: ${label}`, meta ?? {});
}

export type GoogleSheetsCredentialSource = 'file' | 'base64' | 'none';

export type GoogleSheetsEnvStatus = {
  configured: boolean;
  hasServiceAccountJson: boolean;
  credentialSource: GoogleSheetsCredentialSource;
  jsonParseOk: boolean;
  hasClientEmail: boolean;
  hasPrivateKey: boolean;
  privateKeyNormalized: boolean;
  spreadsheetId: string | null;
  range: string;
  serviceAccountEmail: string | null;
  parseError: string | null;
};

/** Safe subset for dashboard APIs (no secrets). */
export type ClientSheetsEnvMeta = {
  configured: boolean;
  credentialSource: GoogleSheetsCredentialSource;
  hasSpreadsheetId: boolean;
  serviceAccountEmail: string | null;
  range: string;
  parseError: string | null;
  hint: string | null;
};

function warnDeprecatedInlineJson(): void {
  if (process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON?.trim()) {
    console.warn(
      LOG_PREFIX,
      'GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON is ignored (deprecated). Use GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH (local) or GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64 (production).'
    );
  }
}

/** Decode base64 service-account JSON without logging payload. */
export function decodeServiceAccountBase64(encoded: string): string {
  const trimmed = encoded.trim();
  if (!trimmed) {
    throw new Error('GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64 is empty.');
  }
  let decoded: string;
  try {
    decoded = Buffer.from(trimmed, 'base64').toString('utf8').trim();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64 is not valid base64: ${msg}`);
  }
  if (!decoded.startsWith('{')) {
    throw new Error(
      'GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64 did not decode to JSON (expected object starting with "{").'
    );
  }
  return decoded;
}

function readFromFilePath(pathEnv: string): {
  raw: string | null;
  resolved: string;
  readError: string | null;
} {
  const resolved = path.isAbsolute(pathEnv) ? pathEnv : path.join(process.cwd(), pathEnv);
  try {
    const raw = fs.readFileSync(resolved, 'utf8').trim();
    if (!raw) {
      return {
        raw: null,
        resolved,
        readError: `GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH file is empty: ${resolved}`,
      };
    }
    return { raw, resolved, readError: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      raw: null,
      resolved,
      readError: `Could not read GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH (${resolved}): ${msg}`,
    };
  }
}

function readServiceAccountJsonRaw(): {
  raw: string | null;
  source: GoogleSheetsCredentialSource;
  readError: string | null;
} {
  warnDeprecatedInlineJson();

  const pathEnv = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH?.trim();
  const base64Env = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64?.trim();

  if (pathEnv) {
    const file = readFromFilePath(pathEnv);
    if (file.raw) {
      logSheetsMode('file', { path: file.resolved });
      return { raw: file.raw, source: 'file', readError: null };
    }
    if (base64Env) {
      console.warn(LOG_PREFIX, 'Sheets mode: file unavailable, falling back to base64', {
        path: file.resolved,
        reason: file.readError,
      });
    } else if (file.readError) {
      return { raw: null, source: 'file', readError: file.readError };
    }
  }

  if (base64Env) {
    try {
      const raw = decodeServiceAccountBase64(base64Env);
      logSheetsMode('base64');
      return { raw, source: 'base64', readError: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return { raw: null, source: 'base64', readError: msg };
    }
  }

  return { raw: null, source: 'none', readError: null };
}

export type ParsedServiceAccount = {
  client_email: string;
  private_key: string;
};

/** Turn literal `\n` sequences in PEM into real newlines (Railway one-line JSON). */
export function normalizePrivateKeyPem(key: string): string {
  return key.replace(/\\n/g, '\n').trim();
}

/**
 * Parse service account JSON — handles one-line JSON and double-encoded strings.
 */
export function parseServiceAccountJson(raw: string): ParsedServiceAccount {
  let text = raw.trim();
  if (!text) {
    throw new Error('Service account JSON is empty.');
  }

  if (text.startsWith('"') && text.endsWith('"')) {
    try {
      text = JSON.parse(text) as string;
    } catch {
      /* keep original */
    }
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Service account JSON is not valid JSON: ${msg}`);
  }

  if (typeof parsed === 'string') {
    try {
      parsed = JSON.parse(parsed);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      throw new Error(`Service account JSON appears double-encoded: ${msg}`);
    }
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Service account JSON must be a JSON object with client_email and private_key.');
  }

  const j = parsed as { client_email?: string; private_key?: string };
  const client_email = j.client_email?.trim();
  const private_key_raw = j.private_key;
  if (!client_email || !private_key_raw) {
    throw new Error('Service account JSON must include client_email and private_key.');
  }

  const private_key = normalizePrivateKeyPem(private_key_raw);
  if (!private_key.includes('BEGIN PRIVATE KEY')) {
    throw new Error('private_key does not look like a PEM block after normalization.');
  }

  return { client_email, private_key };
}

export function getGoogleSheetsRangeFromEnv(): string {
  return process.env.GOOGLE_SHEETS_RANGE?.trim() || 'Sheet1!A:G';
}

/** Sheet tab name from A1 range, e.g. `Sheet1!A:G` → `Sheet1`. */
export function getSheetTabNameFromRange(range: string): string {
  const bang = range.indexOf('!');
  if (bang === -1) return range.trim();
  return range.slice(0, bang).trim();
}

export function getGoogleSheetsEnvStatus(): GoogleSheetsEnvStatus {
  const { raw, source, readError } = readServiceAccountJsonRaw();
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim() || null;
  const range = getGoogleSheetsRangeFromEnv();

  const base: GoogleSheetsEnvStatus = {
    configured: false,
    hasServiceAccountJson: !!raw,
    credentialSource: source,
    jsonParseOk: false,
    hasClientEmail: false,
    hasPrivateKey: false,
    privateKeyNormalized: false,
    spreadsheetId,
    range,
    serviceAccountEmail: null,
    parseError: readError,
  };

  if (!raw) {
    return base;
  }

  try {
    const creds = parseServiceAccountJson(raw);
    base.jsonParseOk = true;
    base.hasClientEmail = true;
    base.hasPrivateKey = true;
    base.privateKeyNormalized = creds.private_key.includes('\n');
    base.serviceAccountEmail = creds.client_email;
    base.parseError = null;
    base.configured = !!(spreadsheetId && creds.client_email && creds.private_key);
    return base;
  } catch (e) {
    base.parseError = e instanceof Error ? e.message : String(e);
    return base;
  }
}

export function getClientSheetsEnvMeta(): ClientSheetsEnvMeta {
  const s = getGoogleSheetsEnvStatus();
  let hint: string | null = null;

  if (s.credentialSource === 'none' || !s.hasServiceAccountJson) {
    hint =
      'Local: GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH=.secrets/google-sheets-sa.json. Production (Railway): GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64 + GOOGLE_SHEETS_SPREADSHEET_ID. See docs/guides/GOOGLE_SHEETS_SETUP.md.';
  } else if (s.parseError) {
    hint = s.parseError;
  } else if (!s.spreadsheetId) {
    hint = 'Set GOOGLE_SHEETS_SPREADSHEET_ID and restart the server.';
  } else if (s.configured) {
    hint = null;
  }

  return {
    configured: s.configured,
    credentialSource: s.credentialSource,
    hasSpreadsheetId: Boolean(s.spreadsheetId),
    serviceAccountEmail: s.serviceAccountEmail,
    range: s.range,
    parseError: s.parseError,
    hint,
  };
}

export function logGoogleSheetsEnvStatus(): GoogleSheetsEnvStatus {
  const status = getGoogleSheetsEnvStatus();
  if (status.credentialSource === 'file' || status.credentialSource === 'base64') {
    logSheetsMode(status.credentialSource);
  }
  console.info(LOG_PREFIX, 'status', {
    configured: status.configured,
    hasServiceAccountJson: status.hasServiceAccountJson,
    jsonParseOk: status.jsonParseOk,
    hasClientEmail: status.hasClientEmail,
    hasPrivateKey: status.hasPrivateKey,
    privateKeyNormalized: status.privateKeyNormalized,
    spreadsheetId: status.spreadsheetId ? `${status.spreadsheetId.slice(0, 6)}…` : null,
    range: status.range,
    tab: getSheetTabNameFromRange(status.range),
    serviceAccountEmail: status.serviceAccountEmail,
    parseError: status.parseError,
  });
  return status;
}

export function getParsedServiceAccountOrThrow(): ParsedServiceAccount {
  const { raw, readError } = readServiceAccountJsonRaw();
  if (!raw) {
    throw new Error(
      readError ||
        'Google Sheets service account not set. Use GOOGLE_SHEETS_SERVICE_ACCOUNT_PATH (local) or GOOGLE_SHEETS_SERVICE_ACCOUNT_JSON_BASE64 (production).'
    );
  }
  return parseServiceAccountJson(raw);
}
