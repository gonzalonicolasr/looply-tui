import { describe, it, expect } from "bun:test";
import { frameOf } from "./__testutil.ts";
import { Splash } from "./Splash.tsx";

describe("Splash", () => {
  it("renderiza el logo LOOPLY y el horizonte", async () => {
    const f = await frameOf(<Splash />, 60, 16);
    expect(f).toContain("╦");  // logo
    expect(f).toContain("─");  // línea de horizonte
  });
});
