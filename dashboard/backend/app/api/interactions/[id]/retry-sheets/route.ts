import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { requireInteractionAdmin } from '@/lib/interactions/admin-guard';
import { retryFormSubmissionSheetsSync } from '@/lib/interactions/service';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireInteractionAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await context.params;
  const result = await retryFormSubmissionSheetsSync(id);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({
    synced: result.synced,
    error: result.error,
    message: result.synced ? 'Row synced to Google Sheets.' : 'Sheets sync failed — see error.',
  });
}
