import { readFileSync, writeFileSync, mkdirSync, chmodSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";

// Token persistido del login. Prioridad: env LOOPLY_ADMIN_TOKEN (override) >
// archivo guardado (~/.config/looply/token).
export function tokenPath(): string {
  const base = process.env.XDG_CONFIG_HOME || join(homedir(), ".config");
  return join(base, "looply", "token");
}

export function loadToken(): string {
  if (process.env.LOOPLY_ADMIN_TOKEN) return process.env.LOOPLY_ADMIN_TOKEN;
  try {
    return readFileSync(tokenPath(), "utf8").trim();
  } catch {
    return "";
  }
}

export function saveToken(token: string): void {
  const p = tokenPath();
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, token, { mode: 0o600 });
  try {
    chmodSync(p, 0o600);
  } catch {
    /* best-effort */
  }
}
