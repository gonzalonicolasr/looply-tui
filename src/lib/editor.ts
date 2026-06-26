import { spawnSync } from "node:child_process";
import { writeFileSync, readFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface EditOpts {
  editor?: string;
  spawn?: typeof spawnSync;
}

// Abre $EDITOR sobre un archivo temporal sembrado con `initial` y devuelve el
// contenido editado. Suelta el raw mode de Ink (setRawMode(false)) para que el
// editor tome la terminal, y lo restaura al volver. `spawn`/`editor` son
// inyectables para testear sin un editor real.
export function editInEditor(
  initial: string,
  setRawMode: (v: boolean) => void,
  opts: EditOpts = {},
): string {
  const editor = opts.editor ?? process.env.EDITOR ?? process.env.VISUAL ?? "nano";
  const run = opts.spawn ?? spawnSync;
  const file = join(tmpdir(), `looply-goal-${process.pid}-${Date.now()}.md`);
  writeFileSync(file, initial ?? "");
  try {
    setRawMode(false);
    run(editor, [file], { stdio: "inherit" });
  } finally {
    setRawMode(true);
  }
  let content = "";
  try {
    content = readFileSync(file, "utf8");
  } catch {
    /* el editor pudo borrarlo */
  }
  try {
    unlinkSync(file);
  } catch {
    /* ya no está */
  }
  return content.trim();
}
