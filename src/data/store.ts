import type { Goal, GoalLogLine } from "./types.ts";
import { laneOf, LANES, type Lane } from "../theme.ts";

export function groupByLane(goals: Goal[]): Record<Lane, Goal[]> {
  const out = { "Backlog": [], "In-flight": [], "Done": [], "Failed": [] } as Record<Lane, Goal[]>;
  for (const goal of goals) out[laneOf(goal.status)].push(goal);
  return out;
}

export interface Stats {
  inFlight: number; done: number; failed: number;
  successRate: number; cost: number; total: number;
}

export function deriveStats(goals: Goal[]): Stats {
  const inFlight = goals.filter((g) => laneOf(g.status) === "In-flight").length;
  const done = goals.filter((g) => g.status === "done").length;
  const failed = goals.filter((g) => g.status === "failed").length;
  const cost = goals.reduce((a, g) => a + (g.costUsd ?? 0), 0);
  const successRate = done + failed === 0 ? 0 : done / (done + failed);
  return { inFlight, done, failed, successRate, cost, total: goals.length };
}

export function appendLog(prev: GoalLogLine[], line: GoalLogLine, max: number): GoalLogLine[] {
  const next = [...prev, line];
  return next.length > max ? next.slice(next.length - max) : next;
}

// 24 buckets de 1h; cuenta goals 'done' por hora según updatedAt (terminal ≈ fin).
// idx 23 = última hora, idx 0 = hace 23-24h. Indexa por antigüedad desde el final.
export function activityBuckets(goals: Goal[], nowSeconds: number): number[] {
  const buckets = new Array(24).fill(0);
  for (const g of goals) {
    if (g.status !== "done") continue;
    const age = nowSeconds - g.updatedAt;
    if (age < 0 || age >= 24 * 3600) continue;
    const idx = 23 - Math.floor(age / 3600);
    if (idx >= 0 && idx < 24) buckets[idx]++;
  }
  return buckets;
}

export { LANES };
