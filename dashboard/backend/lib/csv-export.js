/**
 * Build CSV export from interaction rows (JavaScript).
 */
export function interactionsToCsv(rows) {
  const headers = ['id', 'created_at', 'source', 'subject', 'email', 'sheets_status'];
  const lines = rows.map((row) =>
    headers.map((h) => JSON.stringify(row[h] ?? '')).join(','),
  );
  return [headers.join(','), ...lines].join('\n');
}
