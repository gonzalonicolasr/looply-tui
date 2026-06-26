import type { GoalLogLine } from "../data/types.ts";
import { windowFromBottom } from "../lib/scroll.ts";
import { PHASE_COLOR, DIM } from "../theme.ts";

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export function LogStream({ lines, height, active, frame = 0, offset = 0 }: {
  lines: GoalLogLine[]; height: number; active: boolean; frame?: number; offset?: number;
}) {
  const spinnerRows = active ? 1 : 0;
  const indicatorRows = offset > 0 ? 1 : 0;
  const h = Math.max(1, height - spinnerRows - indicatorRows); // spinner + indicador ocupan filas
  const visible = windowFromBottom(lines, offset, h);
  return (
    <box style={{ flexDirection: "column" }}>
      {visible.length === 0 ? (
        <text fg={DIM}>sin logs todavía</text>
      ) : (
        visible.map((l, i) => (
          <text key={i} wrapMode="none" truncate>
            <span fg={PHASE_COLOR[l.phase] ?? DIM}>{`[${l.phase}]`}</span>
            <span>{` ${l.line}`}</span>
          </text>
        ))
      )}
      {active ? <text fg="#fbbf24">{`${SPINNER[frame % SPINNER.length]} running`}</text> : null}
      {offset > 0 ? <text fg={DIM}>{`  ↑ ${offset} líneas más abajo (PgDn)`}</text> : null}
    </box>
  );
}
