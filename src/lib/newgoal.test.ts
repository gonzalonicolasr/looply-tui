import { describe, it, expect } from "vitest";
import { buildGoalPayload } from "./newgoal.ts";

describe("buildGoalPayload", () => {
  it("falla sin descripción", () => {
    const r = buildGoalPayload({ description: "  ", repoPath: "/r", runtime: "pi", mode: "sdd" });
    expect("error" in r).toBe(true);
  });
  it("falla sin repo", () => {
    const r = buildGoalPayload({ description: "hacer algo", repoPath: "", runtime: "pi", mode: "sdd" });
    expect("error" in r).toBe(true);
  });
  it("normaliza y aplica defaults", () => {
    const r = buildGoalPayload({ description: "  hacer X  ", repoPath: " /repo ", runtime: "raro", mode: "raro" });
    expect(r).toEqual({ payload: { description: "hacer X", repoPath: "/repo", runtime: "pi", mode: "sdd", acceptanceCriteria: [] } });
  });
  it("respeta runtime claude y mode simple válidos", () => {
    const r = buildGoalPayload({ description: "x", repoPath: "/r", runtime: "claude", mode: "simple" });
    expect(r).toEqual({ payload: { description: "x", repoPath: "/r", runtime: "claude", mode: "simple", acceptanceCriteria: [] } });
  });
  it("trimea y descarta criterios vacíos", () => {
    const r = buildGoalPayload({ description: "x", repoPath: "/r", runtime: "pi", mode: "sdd", acceptanceCriteria: ["  uno ", "", "  ", "dos"] });
    expect("payload" in r && r.payload.acceptanceCriteria).toEqual(["uno", "dos"]);
  });
  it("incluye model/effort solo si tienen valor", () => {
    const con = buildGoalPayload({ description: "x", repoPath: "/r", runtime: "claude", mode: "simple", model: " claude-opus-4-8 ", effort: "high" });
    expect("payload" in con && con.payload.model).toBe("claude-opus-4-8");
    expect("payload" in con && con.payload.effort).toBe("high");
    const sin = buildGoalPayload({ description: "x", repoPath: "/r", runtime: "pi", mode: "simple", model: "  ", effort: "" });
    expect("payload" in sin && "model" in sin.payload).toBe(false);
    expect("payload" in sin && "effort" in sin.payload).toBe(false);
  });
});
