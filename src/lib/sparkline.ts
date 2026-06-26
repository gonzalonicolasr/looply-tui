const BARS = "▁▂▃▄▅▆▇█";

export function sparkline(values: number[]): string {
  if (values.length === 0) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  return values
    .map((v) => {
      if (span === 0) return BARS[0];
      const idx = Math.round(((v - min) / span) * (BARS.length - 1));
      return BARS[idx];
    })
    .join("");
}
