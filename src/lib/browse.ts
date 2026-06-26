import { readdirSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { resolve, join, dirname } from "node:path";

export interface DirEntry {
  name: string;
  path: string;
  isRepo: boolean; // tiene .git → es un repo git (Looply puede hacerle worktree)
}
export interface BrowseResult {
  path: string;
  parent: string | null; // null en la raíz
  entries: DirEntry[];
  isGitRepo: boolean; // el path actual es un repo git
  error?: string;
}

// Una carpeta sirve como repoPath de Looply si tiene un .git (dir normal o file
// de worktree/submódulo) — es lo que `git worktree add -C <repo>` necesita.
function hasGit(p: string): boolean {
  try {
    return existsSync(join(p, ".git"));
  } catch {
    return false;
  }
}

// Lista subdirectorios (sin dotfiles) del filesystem LOCAL. Replica la lógica
// de worker/runner.ts handleBrowse. No lanza: ante error devuelve entries:[] +
// error legible (permiso, no existe, etc.). Marca qué carpetas son repos git.
export function listDirs(dir?: string): BrowseResult {
  const target = dir && dir.trim() ? dir : homedir();
  const path = resolve(target);
  const parentRaw = dirname(path);
  const parent = parentRaw === path ? null : parentRaw;
  try {
    const entries = readdirSync(path, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith("."))
      .map((d) => {
        const full = join(path, d.name);
        return { name: d.name, path: full, isRepo: hasGit(full) };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
    return { path, parent, entries, isGitRepo: hasGit(path) };
  } catch (e) {
    return { path, parent, entries: [], isGitRepo: hasGit(path), error: String((e as Error).message ?? e) };
  }
}
