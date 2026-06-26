import { TextAttributes } from "@opentui/core";
import type { Goal } from "../data/types.ts";
import { statusColor, statusGlyph, runtime as rtOf, ACCENT, DIM, TEXT } from "../theme.ts";
import { cost as fmtCost } from "../lib/format.ts";

export function GoalRow({ goal, selected }: { goal: Goal; selected: boolean }) {
  const rt = rtOf(goal.runtime);
  return (
    <box style={{ flexDirection: "row" }}>
      <text fg={selected ? ACCENT : DIM}>{selected ? "▌" : " "}</text>
      <text fg={statusColor(goal.status)}>{`${statusGlyph(goal.status)} `}</text>
      <text fg={selected ? TEXT : DIM} attributes={selected ? TextAttributes.BOLD : undefined}>{goal.name.padEnd(16).slice(0, 16)}</text>
      <text fg={rt.color}>{` ${rt.glyph} `}</text>
      <text fg={statusColor(goal.status)}>{goal.status}</text>
      {goal.costUsd > 0 ? <text fg={DIM}>{`  ${fmtCost(goal.costUsd)}`}</text> : null}
    </box>
  );
}
