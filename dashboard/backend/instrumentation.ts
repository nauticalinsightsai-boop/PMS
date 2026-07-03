export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  try {
    const { logGoogleSheetsEnvStatus } = await import('@/lib/google/sheets-append');
    logGoogleSheetsEnvStatus();
  } catch (error) {
    console.warn('[instrumentation] Google Sheets env check skipped', error);
  }
}
