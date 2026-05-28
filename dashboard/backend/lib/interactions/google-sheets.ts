/**
 * Interaction inbox Google Sheets bridge — implementation in @/lib/google/sheets-append.
 * Server-only; never import from client components.
 */
export {
  appendRowToGoogleSheet,
  getGoogleSheetsRange,
  getGoogleSpreadsheetEditorUrl,
  getGoogleSpreadsheetId,
  isGoogleSheetsConfigured,
  readGoogleSheetValues,
} from '@/lib/google/sheets-append';
export { getClientSheetsEnvMeta, type ClientSheetsEnvMeta } from '@/lib/google/sheets-env';
