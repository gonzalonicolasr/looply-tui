import { describe, it, expect } from "vitest";
import { groupByLane, deriveStats, appendLog, activityBuckets } from "./store.ts";
import type { Goal } from "./types.ts";

const g = (over: Partial<Goal>): Goal => ({
  id: "g", name: "g", description: "", runtime: "pi", mode: "sdd", status: "draft",
  dependsOn: [], retries: 0, maxRetries: 2, lastVerdict: null, costUsd: 0,
  assignedRunner: null, recurringCron: null, createdAt: 0, updatedAt: 0, ...over,
});

describe("store", () => {
  it("groupByLane agrupa por lane en orden", () => {
    const lanes = groupByLane([g({ status: "active" }), g({ status: "draft" }), g({ status: "done" })]);
    expect(lanes["In-flight"]).toHaveLength(1);
    expect(lanes["Backlog"]).toHaveLength(1);
    expect(lanes["Done"]).toHaveLength(1);
    expect(lanes["Failed"]).toHaveLength(0);
  });
  it("deriveStats cuenta in-flight, success rate y cost", () => {
    const s = deriveStats([
      g({ status: "active" }), g({ status: "done", costUsd: 0.5 }),
      g({ status: "done", costUsd: 0.5 }), g({ status: "failed" }),
    ]);
    expect(s.inFlight).toBe(1);
    expect(s.successRate).toBeCloseTo(2 / 3); // 2 done / (2 done + 1 failed)
    expect(s.cost).toBeCloseTo(1.0);
    expect(s.done).toBe(2);
    expect(s.failed).toBe(1);
  });
  it("appendLog respeta el tope del buffer", () => {
    const prev = Array.from({ length: 500 }, (_, i) => ({ phase: "build", line: `l${i}`, ts: 0 }));
    const next = appendLog(prev, { phase: "build", line: "nueva", ts: 0 }, 500);
    expect(next).toHaveLength(500);
    expect(next[next.length - 1].line).toBe("nueva");
  });
  it("activityBuckets cuenta goals done por hora en 24 buckets", () => {
    const now = 24 * 3600;
    const buckets = activityBuckets(
      [g({ status: "done", updatedAt: now - 30 }), g({ status: "done", updatedAt: now - 3600 })],
      now,
    );
    expect(buckets).toHaveLength(24);
    expect(buckets[23]).toBe(1); // última hora
    expect(buckets[22]).toBe(1); // hora previa
  });
});
