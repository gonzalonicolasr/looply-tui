import { describe, it, expect } from "vitest";
import { gauge } from "./gauge.ts";

describe("gauge", () => {
  it("0 → todo vacío", () => {
    expect(gauge(0, 10)).toBe("░░░░░░░░░░");
  });
  it("1 → todo lleno", () => {
    expect(gauge(1, 10)).toBe("▇▇▇▇▇▇▇▇▇▇");
  });
  it("0.5 → mitad", () => {
    expect(gauge(0.5, 10)).toBe("▇▇▇▇▇░░░░░");
  });
  it("clamp fuera de [0,1]", () => {
    expect(gauge(2, 4)).toBe("▇▇▇▇");
    expect(gauge(-1, 4)).toBe("░░░░");
  });
});
