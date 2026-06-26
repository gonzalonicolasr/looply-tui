import { TextAttributes } from "@opentui/core";
import type { Goal, GoalLogLine, Run } from "../data/types.ts";
import { runtime as rtOf, statusColor, DIM, TEXT } from "../theme.ts";
import { LogStream } from "./LogStream.tsx";
import { RunHistory } from "./RunHistory.tsx";

export function Detail({ goal, logs, runs, logHeight, spinnerFrame, logOffset = 0 }: {
  goal: Goal | null; logs: GoalLogLine[]; runs: Run[]; logHeight: number; spinnerFrame: number; logOffset?: number;
}) {
  if (!goal) return <box style={{ paddingX: 1 }}><text fg={DIM}>elegí un goal (↑↓)</text></box>;
  const rt = rtOf(goal.runtime);
  const active = goal.status === "active";
  return (
    <box style={{ flexDirection: "column", paddingX: 1 }}>
      <box style={{ flexDirection: "row" }}>
        <text fg={TEXT} attributes={TextAttributes.BOLD}>{goal.name}</text>
        <text fg={rt.color}>{`  ${rt.glyph} ${goal.runtime}`}</text>
      </box>
      <text fg={statusColor(goal.status)}>
        {`${goal.status} · intento ${goal.retries + 1}/${goal.maxRetries + 1}${goal.lastVerdict ? ` · ${goal.lastVerdict}` : ""}`}
      </text>
      {goal.error ? <text fg="#f87171" wrapMode="none" truncate>{`✗ ${goal.error}`}</text> : null}
      <text fg={DIM} wrapMode="none" truncate>{goal.description.replace(/\s+/g, " ").trim()}</text>
      <box style={{ marginTop: 1 }}><text fg={DIM}>─ logs ─</text></box>
      <LogStream lines={logs} height={logHeight} active={active} frame={spinnerFrame} offset={logOffset} />
      <box style={{ marginTop: 1 }}><text fg={DIM}>─ history ─</text></box>
      <RunHistory runs={runs.slice(-6)} />
    </box>
  );
}
