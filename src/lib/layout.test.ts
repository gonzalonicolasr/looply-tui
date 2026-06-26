import { describe, it, expect } from "vitest";
import { computeLayout } from "./layout.ts";

// chrome fuera del body: header(4) + gap(1) + footer(1) = 6
const CHROME = 6;

describe("computeLayout", () => {
  it("el body + chrome nunca excede las filas del terminal", () => {
    for (const rows of [10, 16, 20, 24, 40, 50, 80]) {
      const { bodyHeight } = computeLayout(rows);
      expect(bodyHeight + CHROME).toBeLessThanOrEqual(rows);
    }
  });
  it("en una terminal normal (24+) deja mínimos usables", () => {
    for (const rows of [24, 40]) {
      const { bodyHeight, logHeight } = computeLayout(rows);
      expect(bodyHeight).toBeGreaterThanOrEqual(6);
      expect(logHeight).toBeGreaterThanOrEqual(4);
    }
  });
  it("logHeight crece con terminales más altas pero deja lugar al chrome del detalle", () => {
    const big = computeLayout(50);
    expect(big.logHeight).toBeGreaterThan(10);
    expect(big.logHeight).toBeLessThan(big.bodyHeight);
  });
});
