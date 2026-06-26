import { gauge } from "../lib/gauge.ts";
import { sparkline } from "../lib/sparkline.ts";
import { cost as fmtCost } from "../lib/format.ts";
import type { Stats } from "../data/store.ts";
import { ACCENT, DIM } from "../theme.ts";

// Una sola línea, truncada al ancho del terminal, para que el header mida
// siempre exactamente 4 filas (banner 3 + statbar 1).
export function StatBar({ stats, activity, connected, runnerOnline }: {
  stats: Stats; activity: number[]; connected: boolean; runnerOnline: boolean;
}) {
  const pct = Math.round(stats.successRate * 100);
  return (
    <box>
      <text wrapMode="none" truncate>
        <span fg={DIM}>in-flight </span><span fg="#60a5fa">{`◴ ${stats.inFlight}`}</span>
        <span fg={DIM}>{"   success "}</span><span fg="#34d399">{`${gauge(stats.successRate, 10)} ${pct}%`}</span>
        <span fg={DIM}>{"   24h "}</span><span fg={ACCENT}>{sparkline(activity)}</span>
        <span fg={DIM}>{`   ${fmtCost(stats.cost)}`}</span>
        <span fg={runnerOnline ? "#34d399" : "#f87171"}>{"   ● runner"}</span>
        <span fg={connected ? "#34d399" : "#fb923c"}>{`   ${connected ? "live" : "reconnecting"}`}</span>
      </text>
    </box>
  );
}
