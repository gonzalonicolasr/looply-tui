function hex(n: number): string {
  return n.toString(16).padStart(2, "0");
}

export function lerpColor(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const p = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${hex(p[0])}${hex(p[1])}${hex(p[2])}`;
}

export function gradientChars(text: string, from: string, to: string): { ch: string; color: string }[] {
  const chars = [...text];
  const n = chars.length;
  return chars.map((ch, i) => ({
    ch,
    color: lerpColor(from, to, n <= 1 ? 0 : i / (n - 1)),
  }));
}
