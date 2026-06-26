import type { Goal, GoalDetail, Run, GoalLogLine } from "./types.ts";

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`);
  return (await res.json()) as T;
}

export function getGoals(base: string): Promise<Goal[]> {
  return getJSON<Goal[]>(`${base}/goals`);
}
export function getGoalLog(base: string, id: string): Promise<GoalLogLine[]> {
  return getJSON<GoalLogLine[]>(`${base}/goals/${id}/log`);
}
export function getGoalDetail(base: string, id: string): Promise<GoalDetail> {
  return getJSON<GoalDetail>(`${base}/goals/${id}`);
}
export function getRuns(base: string, goalId: string): Promise<Run[]> {
  return getJSON<Run[]>(`${base}/runs?goal=${goalId}`);
}

// --- auth ---

export async function login(base: string, email: string, password: string): Promise<string> {
  const res = await fetch(`${base}/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = (await res.json().catch(() => ({}))) as { token?: string; error?: string };
  if (!res.ok || !data.token) throw new Error(data.error ?? `login → ${res.status}`);
  return data.token;
}

// --- escritura (requieren admin token) ---

export async function createGoal(base: string, token: string, payload: object): Promise<Goal> {
  const res = await fetch(`${base}/goals`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const e = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(e.error ?? `POST /goals → ${res.status}`);
  }
  return (await res.json()) as Goal;
}

export async function markReady(base: string, token: string, id: string): Promise<void> {
  const res = await fetch(`${base}/goals/${id}/ready`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`POST /goals/${id}/ready → ${res.status}`);
}
