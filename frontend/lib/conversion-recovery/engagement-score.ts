let score = 0;
let hasIntent = false;

export function getEngagementScore(): number {
  return score;
}

export function hasShownIntent(): boolean {
  return hasIntent;
}

export function markIntent(): void {
  hasIntent = true;
  score += 3;
}

export function addEngagementPoints(points: number): void {
  score += points;
}

export function resetEngagementForNavigation(): void {
  /* keep session score across pages */
}

export function initEngagementTracking(): () => void {
  if (typeof window === 'undefined') return () => {};

  const onScroll = () => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const ratio = window.scrollY / scrollable;
    if (ratio > 0.5) addEngagementPoints(1);
    if (ratio > 0.7) addEngagementPoints(1);
  };

  const timer = window.setTimeout(() => addEngagementPoints(1), 30_000);
  const timer2 = window.setTimeout(() => addEngagementPoints(1), 45_000);

  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    window.clearTimeout(timer);
    window.clearTimeout(timer2);
    window.removeEventListener('scroll', onScroll);
  };
}

export function canShowPassiveCenterDialog(): boolean {
  return hasIntent && score >= 3;
}

export function canAccelerateBottomBarMicroForm(): boolean {
  return score >= 5;
}
