import { describe, it, expect } from "vitest";
import { lerpColor, gradientChars } from "./gradient.ts";

describe("gradient", () => {
  it("lerpColor en t=0 y t=1 da los extremos", () => {
    expect(lerpColor("#000000", "#ffffff", 0)).toBe("#000000");
    expect(lerpColor("#000000", "#ffffff", 1)).toBe("#ffffff");
  });
  it("lerpColor a mitad mezcla", () => {
    expect(lerpColor("#000000", "#ffffff", 0.5)).toBe("#808080");
  });
  it("gradientChars devuelve un color por carácter", () => {
    const out = gradientChars("abc", "#000000", "#ffffff");
    expect(out).toHaveLength(3);
    expect(out[0]).toEqual({ ch: "a", color: "#000000" });
    expect(out[2].color).toBe("#ffffff");
  });
});
