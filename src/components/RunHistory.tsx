import type { Run } from "../data/types.ts";
import { humanDuration, cost as fmtCost } from "../lib/format.ts";
import { DIM } from "../theme.ts";

function verdictColor(v: string | null): string {
  if (v === "pasa") return "#34d399";
  if (v === "corregir") return "#fb923c";
  if (v === "replantear") return "#f87171";
  return "#a1a1aa";
}

export function RunHistory({ runs }: { runs: Run[] }) {
  if (runs.length === 0) return <text fg={DIM}>sin intentos</text>;
  return (
    <box style={{ flexDirection: "column" }}>
      {runs.map((r) => {
        const dur = r.finishedAt ? humanDuration(r.finishedAt - r.startedAt) : "…";
        return (
          <text key={r.id}>
            <span fg={DIM}>{`#${r.attempt} `}</span>
            <span fg={verdictColor(r.verdict)}>{r.verdict ?? r.status}</span>
            <span fg={DIM}>{` ${dur} exit:${r.exitCode ?? "-"} ${fmtCost(r.costUsd ?? 0)}`}</span>
          </text>
        );
      })}
    </box>
  );
}
