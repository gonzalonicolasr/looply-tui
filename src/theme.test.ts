import { describe, it, expect } from "vitest";
import { laneOf, statusColor, runtime, LANES } from "./theme.ts";

describe("theme", () => {
  it("mapea cada status a su lane", () => {
    expect(laneOf("draft")).toBe("Backlog");
    expect(laneOf("active")).toBe("In-flight");
    expect(laneOf("retrying")).toBe("In-flight");
    expect(laneOf("done")).toBe("Done");
    expect(laneOf("skipped")).toBe("Done");
    expect(laneOf("failed")).toBe("Failed");
    expect(laneOf("cancelled")).toBe("Failed");
  });
  it("da un color hex por status", () => {
    expect(statusColor("active")).toMatch(/^#[0-9a-f]{6}$/i);
    expect(statusColor("done")).toMatch(/^#[0-9a-f]{6}$/i);
  });
  it("da color y glyph por runtime con fallback", () => {
    expect(runtime("claude")).toEqual({ color: "#d97757", glyph: "◆" });
    expect(runtime("pi")).toEqual({ color: "#10b981", glyph: "▲" });
    expect(runtime("otro")).toEqual({ color: "#a1a1aa", glyph: "•" });
  });
  it("LANES tiene las 4 lanes en orden", () => {
    expect(LANES).toEqual(["Backlog", "In-flight", "Done", "Failed"]);
  });
});
