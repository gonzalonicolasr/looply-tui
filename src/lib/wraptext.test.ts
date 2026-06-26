import { describe, it, expect } from "vitest";
import { wrapText } from "./wraptext.ts";

describe("wrapText", () => {
  it("envuelve por palabras al ancho dado", () => {
    expect(wrapText("aaa bbb ccc", 7)).toEqual(["aaa bbb", "ccc"]);
  });
  it("respeta los saltos de línea (párrafos y líneas vacías)", () => {
    expect(wrapText("a\n\nb", 5)).toEqual(["a", "", "b"]);
  });
  it("corta palabras más largas que el ancho", () => {
    expect(wrapText("abcdefgh", 3)).toEqual(["abc", "def", "gh"]);
  });
  it("una descripción larga produce muchas líneas acotadas al ancho", () => {
    const lines = wrapText("lorem ipsum ".repeat(50), 20);
    expect(lines.length).toBeGreaterThan(5);
    expect(Math.max(...lines.map((l) => l.length))).toBeLessThanOrEqual(20);
  });
});
