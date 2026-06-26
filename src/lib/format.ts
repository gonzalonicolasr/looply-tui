export function humanDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${s % 60}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function cost(usd: number): string {
  return `$${(usd ?? 0).toFixed(2)}`;
}

export function relativeTime(tsSeconds: number, nowSeconds: number): string {
  const d = Math.max(0, nowSeconds - tsSeconds);
  if (d < 60) return `hace ${d}s`;
  if (d < 3600) return `hace ${Math.floor(d / 60)}m`;
  if (d < 86400) return `hace ${Math.floor(d / 3600)}h`;
  return `hace ${Math.floor(d / 86400)}d`;
}
