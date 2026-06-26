export function gauge(ratio: number, width: number): string {
  const r = Math.max(0, Math.min(1, ratio));
  const filled = Math.round(r * width);
  return "▇".repeat(filled) + "░".repeat(width - filled);
}
