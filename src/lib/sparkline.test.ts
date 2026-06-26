import { describe, it, expect } from "vitest";
import { sparkline } from "./sparkline.ts";

describe("sparkline", () => {
  it("vacío → cadena vacía", () => {
    expect(sparkline([])).toBe("");
  });
  it("todos iguales → barras bajas", () => {
    expect(sparkline([5, 5, 5])).toBe("▁▁▁");
  });
  it("mapea min→▁ y max→█", () => {
    const s = sparkline([0, 10]);
    expect(s[0]).toBe("▁");
    expect(s[1]).toBe("█");
  });
  it("respeta el largo de la entrada", () => {
    expect([...sparkline([1, 2, 3, 4])].length).toBe(4);
  });
});
