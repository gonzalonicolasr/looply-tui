import { useEffect, useRef, useState } from "react";
import type { Goal, GoalLogLine, LooplyEvent, Run } from "./types.ts";
import { getGoals, getGoalLog, getRuns } from "./api.ts";
import { connectEvents } from "./sse.ts";
import { appendLog } from "./store.ts";
import { LOG_BUFFER, LOG_FLUSH_MS } from "../config.ts";

export interface LooplyData {
  goals: Goal[];
  logs: Record<string, GoalLogLine[]>;
  runs: Record<string, Run[]>;
  connected: boolean;
  runnerOnline: boolean;
  error: string | null;
  loadGoalDetail: (id: string) => void;
  refresh: () => void;
}

export function useLooplyData(base: string): LooplyData {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [logs, setLogs] = useState<Record<string, GoalLogLine[]>>({});
  const [runs, setRuns] = useState<Record<string, Run[]>>({});
  const [connected, setConnected] = useState(false);
  const [runnerOnline, setRunnerOnline] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // buffer de líneas pendientes (throttle de re-render)
  const pending = useRef<Record<string, GoalLogLine[]>>({});

  const refresh = useRef(async () => {
    try {
      setGoals(await getGoals(base));
      setError(null);
    } catch (e) {
      setError(String((e as Error).message ?? e));
    }
  });

  useEffect(() => {
    refresh.current();
    const flush = setInterval(() => {
      const p = pending.current;
      if (Object.keys(p).length === 0) return;
      pending.current = {};
      setLogs((prev) => {
        const next = { ...prev };
        for (const [id, lines] of Object.entries(p)) {
          let acc = next[id] ?? [];
          for (const l of lines) acc = appendLog(acc, l, LOG_BUFFER);
          next[id] = acc;
        }
        return next;
      });
    }, LOG_FLUSH_MS);

    const close = connectEvents(
      base,
      (e: LooplyEvent) => {
        if (e.type === "progress") {
          (pending.current[e.goalId] ??= []).push({ phase: e.phase, line: e.line, ts: 0 });
        } else if (e.type === "status") {
          refresh.current();
        } else if (e.type === "runner") {
          setRunnerOnline(e.status === "online");
          refresh.current();
        }
      },
      setConnected,
    );

    return () => {
      clearInterval(flush);
      close();
    };
  }, [base]);

  function loadGoalDetail(id: string) {
    getGoalLog(base, id).then((seed) =>
      setLogs((prev) => ({ ...prev, [id]: prev[id]?.length ? prev[id] : seed })),
    ).catch(() => {});
    getRuns(base, id).then((r) => setRuns((prev) => ({ ...prev, [id]: r }))).catch(() => {});
  }

  return { goals, logs, runs, connected, runnerOnline, error, loadGoalDetail, refresh: () => refresh.current() };
}
