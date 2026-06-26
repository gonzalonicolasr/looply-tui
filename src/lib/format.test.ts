import { describe, it, expect } from "vitest";
import { humanDuration, cost, relativeTime } from "./format.ts";

describe("format", () => {
  it("humanDuration: segundos→'Xs', minutos→'Xm Ys'", () => {
    expect(humanDuration(0)).toBe("0s");
    expect(humanDuration(45)).toBe("45s");
    expect(humanDuration(90)).toBe("1m 30s");
    expect(humanDuration(3661)).toBe("1h 1m");
  });
  it("cost: formatea USD", () => {
    expect(cost(0)).toBe("$0.00");
    expect(cost(1.5)).toBe("$1.50");
    expect(cost(0.426)).toBe("$0.43");
  });
  it("relativeTime: 'hace Xs/m/h' desde un epoch en segundos", () => {
    const now = 1_000_000;
    expect(relativeTime(now - 30, now)).toBe("hace 30s");
    expect(relativeTime(now - 120, now)).toBe("hace 2m");
    expect(relativeTime(now - 7200, now)).toBe("hace 2h");
  });
});
