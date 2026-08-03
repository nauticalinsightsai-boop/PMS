export function buildEnrollmentSuccessRedirect(
  enrollSuccessPath: string,
  offeringId: string,
  sessionId: string | null,
): string {
  const params = new URLSearchParams({ offering: offeringId });
  if (sessionId) params.set('session_id', sessionId);
  return `${enrollSuccessPath}?${params.toString()}`;
}
