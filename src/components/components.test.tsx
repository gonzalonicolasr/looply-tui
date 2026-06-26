import { describe, it, expect } from "bun:test";
import { frameOf } from "./__testutil.ts";
import { Banner } from "./Banner.tsx";
import { StatBar } from "./StatBar.tsx";
import { GoalRow } from "./GoalRow.tsx";
import type { Goal } from "../data/types.ts";

const goal: Goal = {
  id: "fix-login", name: "fix-login", description: "arreglar login", runtime: "claude",
  mode: "sdd", status: "active", dependsOn: [], retries: 1, maxRetries: 2,
  lastVerdict: null, costUsd: 0.42, assignedRunner: "omarchy", recurringCron: null,
  createdAt: 0, updatedAt: 0,
};

describe("componentes", () => {
  it("Banner muestra LOOPLY", async () => {
    expect(await frameOf(<Banner />, 40, 5)).toContain("╦"); // box-drawing del banner
  });
  it("StatBar muestra el % de success y el contador in-flight", async () => {
    const f = await frameOf(
      <StatBar stats={{ inFlight: 2, done: 9, failed: 1, successRate: 0.9, cost: 1.84, total: 12 }}
               activity={[1, 2, 3]} connected runnerOnline />,
      100, 3,
    );
    expect(f).toContain("90%");
    expect(f).toContain("2");
    expect(f).toContain("$1.84");
  });
  it("GoalRow muestra nombre, glyph runtime y status", async () => {
    const f = await frameOf(<GoalRow goal={goal} selected={false} />, 60, 3);
    expect(f).toContain("fix-login");
    expect(f).toContain("◆");      // runtime claude
    expect(f).toContain("active");
  });
});
