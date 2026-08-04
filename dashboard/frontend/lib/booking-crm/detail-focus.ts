export function resolveDetailFinalFocus(target: HTMLButtonElement | null): HTMLElement | null {
  return target?.isConnected ? target : null;
}
