import { TextAttributes } from "@opentui/core";
import type { Goal } from "../data/types.ts";
import { groupByLane, LANES } from "../data/store.ts";
import { GoalRow } from "./GoalRow.tsx";
import { DIM } from "../theme.ts";

export function Board({ goals, selectedId }: { goals: Goal[]; selectedId: string | null }) {
  const lanes = groupByLane(goals);
  return (
    <box style={{ flexDirection: "column" }}>
      {LANES.map((lane) => (
        <box key={lane} style={{ flexDirection: "column" }}>
          <text fg={DIM} attributes={TextAttributes.BOLD}>{`${lane.toUpperCase()} ${lanes[lane].length}`}</text>
          {lanes[lane].map((g) => (
            <GoalRow key={g.id} goal={g} selected={g.id === selectedId} />
          ))}
        </box>
      ))}
    </box>
  );
}
