import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireInteractionAdmin } from '@/lib/interactions/admin-guard';
import { verifyGoogleSheetsConnection } from '@/lib/google/sheets-append';
import { getClientSheetsEnvMeta } from '@/lib/google/sheets-env';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Admin: test Google Sheets credentials, spreadsheet access, and configured tab. */
export async function GET(request: NextRequest) {
  const auth = await requireInteractionAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const sheetsEnv = getClientSheetsEnvMeta();
  const connection = await verifyGoogleSheetsConnection();

  return NextResponse.json({
    sheetsEnv,
    connection,
  });
}
