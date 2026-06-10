/** Feature flag — defaults to enabled when unset. */
export function isLeadRecoveryEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_LEAD_RECOVERY_ENABLED;
  if (raw === undefined || raw === '') return true;
  return raw === '1' || raw.toLowerCase() === 'true';
}
