// Espejo de dashboard/src/components/status.ts (paleta re-tonada dark terminal).
export type Lane = "Backlog" | "In-flight" | "Done" | "Failed";
export const LANES: Lane[] = ["Backlog", "In-flight", "Done", "Failed"];

const LANE_OF: Record<string, Lane> = {
  draft: "Backlog", ready: "Backlog", pending: "Backlog",
  assigned: "In-flight", active: "In-flight", verifying: "In-flight", retrying: "In-flight",
  done: "Done", skipped: "Done",
  failed: "Failed", cancelled: "Failed",
};

const STATUS_COLOR: Record<string, string> = {
  draft: "#a1a1aa", ready: "#38bdf8", pending: "#fbbf24",
  assigned: "#818cf8", active: "#60a5fa", verifying: "#c084fc", retrying: "#fb923c",
  done: "#34d399", skipped: "#52525b",
  failed: "#f87171", cancelled: "#9ca3af",
};

// glyph por status (○ backlog, ◉ in-flight, ✓ done, ✗ failed)
const STATUS_GLYPH: Record<string, string> = {
  draft: "○", ready: "○", pending: "○",
  assigned: "◉", active: "◉", verifying: "◉", retrying: "◉",
  done: "✓", skipped: "–",
  failed: "✗", cancelled: "✗",
};

export function laneOf(status: string): Lane {
  return LANE_OF[status] ?? "Backlog";
}
export function statusColor(status: string): string {
  return STATUS_COLOR[status] ?? "#a1a1aa";
}
export function statusGlyph(status: string): string {
  return STATUS_GLYPH[status] ?? "•";
}
export function runtime(rt: string): { color: string; glyph: string } {
  if (rt === "claude") return { color: "#d97757", glyph: "◆" };
  if (rt === "pi") return { color: "#10b981", glyph: "▲" };
  if (rt === "opencode") return { color: "#38bdf8", glyph: "◇" };
  if (rt === "codex") return { color: "#a78bfa", glyph: "✦" };
  return { color: "#a1a1aa", glyph: "•" };
}

// colores de fase para el LogStream
export const PHASE_COLOR: Record<string, string> = {
  explore: "#38bdf8", plan: "#c084fc", build: "#fbbf24",
  veredicto: "#34d399", forge: "#a1a1aa", resumen: "#818cf8",
};

export const ACCENT = "#d97757";   // clay
export const ACCENT2 = "#6366f1";  // indigo (gradiente del banner)
export const DIM = "#71717a";
export const TEXT = "#ededf0";
