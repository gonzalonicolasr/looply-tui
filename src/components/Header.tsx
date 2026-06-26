import { Banner } from "./Banner.tsx";
import { StatBar } from "./StatBar.tsx";
import type { Stats } from "../data/store.ts";

export function Header({ stats, activity, connected, runnerOnline }: {
  stats: Stats; activity: number[]; connected: boolean; runnerOnline: boolean;
}) {
  return (
    <box style={{ flexDirection: "column" }}>
      <Banner />
      <StatBar stats={stats} activity={activity} connected={connected} runnerOnline={runnerOnline} />
    </box>
  );
}
