import { JWT } from 'google-auth-library';

import {
  getGoogleSheetsEnvStatus,
  getGoogleSheetsRangeFromEnv,
  getParsedServiceAccountOrThrow,
  getSheetTabNameFromRange,
  logGoogleSheetsEnvStatus,
  type GoogleSheetsEnvStatus,
  type ParsedServiceAccount,
} from '@/lib/google/sheets-env';

const LOG_PREFIX = '[google-sheets]';
const SHEETS_SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

type SheetsApiErrorBody = {
  error?: { code?: number; message?: string; status?: string };
};

let cachedToken: { token: string; expiresAt: number; email: string } | null = null;

function log(level: 'info' | 'warn' | 'error', message: string, detail?: Record<string, unknown>) {
  const payload = detail ? { ...detail } : undefined;
  if (level === 'info') console.info(LOG_PREFIX, message, payload ?? '');
  else if (level === 'warn') console.warn(LOG_PREFIX, message, payload ?? '');
  else console.error(LOG_PREFIX, message, payload ?? '');
}

function parseSheetsApiError(status: number, text: string): string {
  try {
    const j = JSON.parse(text) as SheetsApiErrorBody;
    const msg = j.error?.message;
    if (msg) return `Sheets API HTTP ${status}: ${msg}`;
  } catch {
    /* ignore */
  }
  return `Sheets API HTTP ${status}: ${text.slice(0, 800)}`;
}

function permissionHint(email: string, spreadsheetId: string): string {
  return (
    `Share spreadsheet ${spreadsheetId} with service account "${email}" as Editor ` +
    `(Google Sheets → Share). Auth succeeded but the API returned permission denied.`
  );
}

async function getAccessToken(creds: ParsedServiceAccount): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.email === creds.client_email && cachedToken.expiresAt > now + 30_000) {
    log('info', 'auth: using cached access token', { clientEmail: creds.client_email });
    return cachedToken.token;
  }

  log('info', 'auth: requesting access token', { clientEmail: creds.client_email });
  const client = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: [SHEETS_SCOPE],
  });

  let tokens;
  try {
    tokens = await client.authorize();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    log('error', 'auth: authorize() failed', { message: msg });
    throw new Error(`Google Sheets authentication failed: ${msg}`);
  }

  const accessToken = tokens.access_token;
  if (!accessToken) {
    log('error', 'auth: no access_token in response');
    throw new Error('Google Sheets authorize() returned no access_token.');
  }

  const ttlMs =
    typeof tokens.expiry_date === 'number' ? tokens.expiry_date - now : 45 * 60_000;
  cachedToken = {
    token: accessToken,
    expiresAt: now + Math.max(60_000, ttlMs),
    email: creds.client_email,
  };
  log('info', 'auth: success', { clientEmail: creds.client_email, expiresInSec: Math.round(ttlMs / 1000) });
  return accessToken;
}

export function isGoogleSheetsConfigured(): boolean {
  return getGoogleSheetsEnvStatus().configured;
}

export function getGoogleSpreadsheetId(): string | null {
  return process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim() || null;
}

export function getGoogleSpreadsheetEditorUrl(): string | null {
  const fromEnv = process.env.GOOGLE_SHEETS_EDITOR_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  const id = getGoogleSpreadsheetId();
  if (!id) return null;
  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(id)}/edit`;
}

export function getGoogleSheetsRange(): string {
  return getGoogleSheetsRangeFromEnv();
}

export type GoogleSheetsConnectionResult =
  | {
      ok: true;
      spreadsheetTitle: string;
      sheetTabs: string[];
      configuredRange: string;
      configuredTab: string;
      tabExists: boolean;
      serviceAccountEmail: string;
    }
  | {
      ok: false;
      step: 'env' | 'auth' | 'spreadsheet';
      error: string;
      serviceAccountEmail?: string;
      sheetTabs?: string[];
    };

/** Validates env, auth, spreadsheet access, and that the configured tab exists. */
export async function verifyGoogleSheetsConnection(): Promise<GoogleSheetsConnectionResult> {
  const env = logGoogleSheetsEnvStatus();
  if (!env.configured) {
    return {
      ok: false,
      step: 'env',
      error: env.parseError || 'Google Sheets env is incomplete (JSON + GOOGLE_SHEETS_SPREADSHEET_ID).',
    };
  }

  const spreadsheetId = env.spreadsheetId!;
  const configuredRange = env.range;
  const configuredTab = getSheetTabNameFromRange(configuredRange);

  let creds: ParsedServiceAccount;
  try {
    creds = getParsedServiceAccountOrThrow();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, step: 'env', error: msg };
  }

  let token: string;
  try {
    token = await getAccessToken(creds);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, step: 'auth', error: msg, serviceAccountEmail: creds.client_email };
  }

  log('info', 'connection: fetching spreadsheet metadata', { spreadsheetId, configuredTab });
  const metaUrl = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId
  )}?fields=properties.title,sheets.properties.title`;

  const metaRes = await fetch(metaUrl, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!metaRes.ok) {
    const text = await metaRes.text();
    let error = parseSheetsApiError(metaRes.status, text);
    if (metaRes.status === 403) {
      error = `${error} ${permissionHint(creds.client_email, spreadsheetId)}`;
    } else if (metaRes.status === 404) {
      error = `${error} Check GOOGLE_SHEETS_SPREADSHEET_ID (spreadsheet not found or no access).`;
    }
    log('error', 'connection: metadata failed', { status: metaRes.status, error });
    return {
      ok: false,
      step: 'spreadsheet',
      error,
      serviceAccountEmail: creds.client_email,
    };
  }

  const meta = (await metaRes.json()) as {
    properties?: { title?: string };
    sheets?: { properties?: { title?: string } }[];
  };
  const spreadsheetTitle = meta.properties?.title ?? '(unknown)';
  const sheetTabs =
    meta.sheets?.map((s) => s.properties?.title).filter((t): t is string => !!t) ?? [];
  const tabExists = sheetTabs.some((t) => t === configuredTab);

  log('info', 'connection: metadata ok', {
    spreadsheetTitle,
    sheetTabs,
    configuredTab,
    tabExists,
  });

  if (!tabExists) {
    return {
      ok: false,
      step: 'spreadsheet',
      error:
        `Sheet tab "${configuredTab}" not found. Existing tabs: ${sheetTabs.join(', ') || '(none)'}. ` +
        `Update GOOGLE_SHEETS_RANGE (currently "${configuredRange}").`,
      serviceAccountEmail: creds.client_email,
      sheetTabs,
    };
  }

  return {
    ok: true,
    spreadsheetTitle,
    sheetTabs,
    configuredRange,
    configuredTab,
    tabExists,
    serviceAccountEmail: creds.client_email,
  };
}

/**
 * Appends one or more rows to the configured range (e.g. `Submissions!A:G`).
 */
export async function appendRowsToGoogleSheet(rows: string[][]): Promise<void> {
  if (!rows.length) {
    throw new Error('appendRowsToGoogleSheet: rows array is empty.');
  }

  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const range = getGoogleSheetsRangeFromEnv();
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is not set.');
  }

  const creds = getParsedServiceAccountOrThrow();
  const token = await getAccessToken(creds);

  const path = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId
  )}/values/${encodeURIComponent(range)}:append`;
  const url = new URL(path);
  url.searchParams.set('valueInputOption', 'USER_ENTERED');
  url.searchParams.set('insertDataOption', 'INSERT_ROWS');

  log('info', 'append: request', {
    spreadsheetId: `${spreadsheetId.slice(0, 6)}…`,
    range,
    rowCount: rows.length,
    columnCount: rows[0]?.length ?? 0,
  });

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ values: rows }),
  });

  if (!res.ok) {
    const text = await res.text();
    let error = parseSheetsApiError(res.status, text);
    if (res.status === 403) {
      error = `${error} ${permissionHint(creds.client_email, spreadsheetId)}`;
    }
    log('error', 'append: failed', { status: res.status, error });
    throw new Error(error);
  }

  const json = (await res.json()) as {
    updates?: { updatedRows?: number; updatedRange?: string };
  };
  log('info', 'append: success', {
    updatedRows: json.updates?.updatedRows,
    updatedRange: json.updates?.updatedRange,
  });
}

export async function appendRowToGoogleSheet(values: string[]): Promise<void> {
  await appendRowsToGoogleSheet([values]);
}

export async function readGoogleSheetValues(): Promise<string[][]> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const range = getGoogleSheetsRangeFromEnv();
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is not set.');
  }

  const creds = getParsedServiceAccountOrThrow();
  const token = await getAccessToken(creds);

  log('info', 'read: request', { range });
  const path = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId
  )}/values/${encodeURIComponent(range)}`;
  const res = await fetch(path, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    let error = parseSheetsApiError(res.status, text);
    if (res.status === 403) {
      error = `${error} ${permissionHint(creds.client_email, spreadsheetId)}`;
    }
    log('error', 'read: failed', { status: res.status, error });
    throw new Error(error);
  }

  const json = (await res.json()) as { values?: string[][] };
  const values = json.values ?? [];
  log('info', 'read: success', { rowCount: values.length });
  return values;
}

export { getGoogleSheetsEnvStatus, logGoogleSheetsEnvStatus, type GoogleSheetsEnvStatus };
