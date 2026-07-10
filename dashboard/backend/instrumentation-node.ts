/** Node-only startup hooks (imported only when NEXT_RUNTIME === 'nodejs'). */

export async function registerNodeInstrumentation(): Promise<void> {
  try {
    const { logGoogleSheetsEnvStatus } = await import('@/lib/google/sheets-append');
    logGoogleSheetsEnvStatus();
  } catch (error) {
    console.warn('[instrumentation] Google Sheets env check skipped', error);
  }
}
