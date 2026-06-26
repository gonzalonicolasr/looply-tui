import { describe, it, expect } from "vitest";
import { clampOffset, windowFromTop, windowFromBottom, offsetForSelection } from "./scroll.ts";

describe("scroll", () => {
  it("clampOffset acota a [0, total-height]", () => {
    expect(clampOffset(-5, 10, 3)).toBe(0);
    expect(clampOffset(99, 10, 3)).toBe(7);
    expect(clampOffset(4, 10, 3)).toBe(4);
    expect(clampOffset(2, 2, 5)).toBe(0); // total < height
  });
  it("windowFromTop devuelve la franja desde offset", () => {
    const xs = [0, 1, 2, 3, 4, 5];
    expect(windowFromTop(xs, 2, 3)).toEqual([2, 3, 4]);
    expect(windowFromTop(xs, 99, 3)).toEqual([3, 4, 5]); // clamp al final
  });
  it("windowFromBottom: 0 = últimas height, subir desplaza arriba", () => {
    const xs = [0, 1, 2, 3, 4, 5];
    expect(windowFromBottom(xs, 0, 3)).toEqual([3, 4, 5]);
    expect(windowFromBottom(xs, 2, 3)).toEqual([1, 2, 3]);
  });
  it("offsetForSelection mantiene visible el índice", () => {
    expect(offsetForSelection(0, 20, 5)).toBe(0);
    expect(offsetForSelection(4, 20, 5)).toBe(0);
    expect(offsetForSelection(5, 20, 5)).toBe(1);
    expect(offsetForSelection(19, 20, 5)).toBe(15);
  });
});
