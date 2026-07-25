/** Return true only when the App Router path (including query string) changed. */
export function shouldTrackRoutePageView(
  previousPath: string | null,
  nextPath: string,
): boolean {
  return previousPath !== nextPath;
}
