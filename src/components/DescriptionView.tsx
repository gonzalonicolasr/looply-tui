import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import type { Goal } from "../data/types.ts";
import { wrapText } from "../lib/wraptext.ts";
import { windowFromTop, clampOffset } from "../lib/scroll.ts";
import { ACCENT, DIM, TEXT, statusColor } from "../theme.ts";

export function DescriptionView({ goal, width, height, onClose }: {
  goal: Goal;
  width: number;
  height: number;
  onClose: () => void;
}) {
  const [offset, setOffset] = useState(0);
  const lines = wrapText(goal.description.trim(), Math.max(10, width - 4));
  const listH = Math.max(1, height - 4); // título + status + hint + margen

  useKeyboard((key) => {
    if (key.name === "escape" || key.name === "return" || key.name === "q") return onClose();
    if (key.name === "up" || key.name === "k") return setOffset((o) => clampOffset(o - 1, lines.length, listH));
    if (key.name === "down" || key.name === "j") return setOffset((o) => clampOffset(o + 1, lines.length, listH));
    if (key.name === "pageup") return setOffset((o) => clampOffset(o - listH, lines.length, listH));
    if (key.name === "pagedown") return setOffset((o) => clampOffset(o + listH, lines.length, listH));
  });

  const visible = windowFromTop(lines, offset, listH);
  const atEnd = offset >= Math.max(0, lines.length - listH);

  return (
    <box style={{ flexDirection: "column", border: true, borderStyle: "rounded", borderColor: ACCENT, paddingX: 1, flexGrow: 1 }}>
      <text fg={TEXT} attributes={TextAttributes.BOLD}>{goal.name}</text>
      <text fg={statusColor(goal.status)}>{`${goal.status} · ${lines.length} líneas de descripción`}</text>
      {visible.map((l, i) => (
        <text key={i} fg={DIM}>{l.length ? l : " "}</text>
      ))}
      <box style={{ marginTop: 1 }}>
        <text fg={DIM}>{`↑↓/PgUp/PgDn scroll${atEnd ? " · (fin)" : ""} · Esc cierra`}</text>
      </box>
    </box>
  );
}
