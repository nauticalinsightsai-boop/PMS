/** Heuristic paid Calendly event detection (shared client + proxy). */
export function isPaidCalendlyEventUrl(url: string): boolean {
  return /executive|design-review|talk-to-advisor|webinar-paid|services/i.test(url);
}
