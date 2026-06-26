import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { listDirs, type BrowseResult } from "../lib/browse.ts";
import { windowFromTop, offsetForSelection } from "../lib/scroll.ts";
import { ACCENT, DIM, TEXT } from "../theme.ts";

export function FolderPicker({ initialPath, onPick, onCancel, height }: {
  initialPath?: string;
  onPick: (path: string) => void;
  onCancel: () => void;
  height: number;
}) {
  const [result, setResult] = useState<BrowseResult>(() => listDirs(initialPath));
  const [selIdx, setSelIdx] = useState(0);

  const go = (path: string | null) => {
    if (!path) return;
    setResult(listDirs(path));
    setSelIdx(0);
  };

  useKeyboard((key) => {
    if (key.name === "escape") return onCancel();
    if (key.name === "s") return onPick(result.path);
    if (key.name === "up" || key.name === "k") return setSelIdx((i) => Math.max(0, i - 1));
    if (key.name === "down" || key.name === "j") return setSelIdx((i) => Math.min(result.entries.length - 1, i + 1));
    if (key.name === "return") {
      const e = result.entries[selIdx];
      if (e) go(e.path);
      return;
    }
    if (key.name === "left" || key.name === "backspace" || key.name === "delete") return go(result.parent);
  });

  const listH = Math.max(1, height - 5); // título + path + (..) + hint + margen
  const start = offsetForSelection(selIdx, result.entries.length, listH);
  const visible = windowFromTop(result.entries, start, listH);

  return (
    <box style={{ flexDirection: "column", border: true, borderStyle: "rounded", borderColor: ACCENT, paddingX: 1, flexGrow: 1 }}>
      <text fg={ACCENT} attributes={TextAttributes.BOLD}>  elegí la carpeta del repo</text>
      <text fg={DIM} wrapMode="none" truncate>{result.path}</text>
      <text fg={result.isGitRepo ? "#34d399" : "#fb923c"} wrapMode="none" truncate>
        {result.isGitRepo
          ? "✓ es repo git — s para elegirlo"
          : "⚠ no es repo git — entrá a uno (Looply le hace worktree)"}
      </text>
      {result.error ? <text fg="#f87171">{`⚠ ${result.error}`}</text> : null}
      {result.parent ? <text fg={DIM}>  ../  (← subir)</text> : null}
      {result.entries.length === 0 ? (
        <text fg={DIM}>  (sin subcarpetas)</text>
      ) : (
        visible.map((e, i) => {
          const sel = start + i === selIdx;
          return (
            <text key={e.path} wrapMode="none" truncate>
              <span fg={sel ? ACCENT : DIM}>{`${sel ? "▌" : " "} ${e.name}/`}</span>
              {e.isRepo ? <span fg="#34d399">  ✓ git</span> : null}
            </text>
          );
        })
      )}
      <box style={{ flexDirection: "row", marginTop: 1 }}>
        <text fg={DIM}>↑↓ mover · Enter entrar · ← subir · </text>
        <text fg={TEXT}>s</text>
        <text fg={DIM}> elegir esta · Esc cancelar</text>
      </box>
    </box>
  );
}
