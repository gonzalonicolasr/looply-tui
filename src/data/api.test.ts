import { describe, it, expect, vi, afterEach } from "vitest";
import { getGoals, getGoalLog, getGoalDetail, getRuns, createGoal, markReady, login } from "./api.ts";

afterEach(() => vi.restoreAllMocks());

function mockFetch(body: unknown, ok = true) {
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok, status: ok ? 200 : 401, json: async () => body })));
}

describe("api", () => {
  it("getGoals pega a /goals y devuelve el array", async () => {
    mockFetch([{ id: "g1", status: "active" }]);
    const goals = await getGoals("http://x");
    expect(globalThis.fetch).toHaveBeenCalledWith("http://x/goals", expect.anything());
    expect(goals[0].id).toBe("g1");
  });
  it("getGoalLog pega a /goals/:id/log", async () => {
    mockFetch([{ phase: "build", line: "hi", ts: 1 }]);
    const log = await getGoalLog("http://x", "g1");
    expect(globalThis.fetch).toHaveBeenCalledWith("http://x/goals/g1/log", expect.anything());
    expect(log[0].line).toBe("hi");
  });
  it("getGoalDetail pega a /goals/:id y trae los campos de creación", async () => {
    mockFetch({ id: "g1", repoPath: "/r", acceptanceCriteria: ["a"], model: "m", effort: "high" });
    const g = await getGoalDetail("http://x", "g1");
    expect(globalThis.fetch).toHaveBeenCalledWith("http://x/goals/g1", expect.anything());
    expect(g.repoPath).toBe("/r");
    expect(g.acceptanceCriteria).toEqual(["a"]);
    expect(g.model).toBe("m");
  });
  it("getRuns pega a /runs?goal=:id", async () => {
    mockFetch([{ id: 1, goalId: "g1", attempt: 1 }]);
    const runs = await getRuns("http://x", "g1");
    expect(globalThis.fetch).toHaveBeenCalledWith("http://x/runs?goal=g1", expect.anything());
    expect(runs[0].attempt).toBe(1);
  });
  it("createGoal hace POST con Bearer y body", async () => {
    mockFetch({ id: "g-new", status: "draft" });
    const g = await createGoal("http://x", "tok", { description: "d", repoPath: "/r" });
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toBe("http://x/goals");
    expect(call[1].method).toBe("POST");
    expect(call[1].headers.authorization).toBe("Bearer tok");
    expect(JSON.parse(call[1].body).description).toBe("d");
    expect(g.id).toBe("g-new");
  });
  it("createGoal lanza el error del backend en !ok", async () => {
    mockFetch({ error: "repoPath is required" }, false);
    await expect(createGoal("http://x", "tok", {})).rejects.toThrow("repoPath is required");
  });
  it("login hace POST /login y devuelve el token", async () => {
    mockFetch({ ok: true, token: "tok-123", email: "x@y.com" });
    const t = await login("http://x", "x@y.com", "pass");
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toBe("http://x/login");
    expect(call[1].method).toBe("POST");
    expect(JSON.parse(call[1].body)).toEqual({ email: "x@y.com", password: "pass" });
    expect(t).toBe("tok-123");
  });
  it("login lanza el error en credenciales inválidas", async () => {
    mockFetch({ error: "invalid credentials" }, false);
    await expect(login("http://x", "a", "b")).rejects.toThrow("invalid credentials");
  });
  it("markReady hace POST a /:id/ready con Bearer", async () => {
    mockFetch({ ok: true });
    await markReady("http://x", "tok", "g1");
    const call = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(call[0]).toBe("http://x/goals/g1/ready");
    expect(call[1].method).toBe("POST");
    expect(call[1].headers.authorization).toBe("Bearer tok");
  });
});
