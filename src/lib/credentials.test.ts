import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadToken, saveToken, tokenPath } from "./credentials.ts";

let cfg: string;
beforeEach(() => {
  cfg = mkdtempSync(join(tmpdir(), "looply-cfg-"));
  vi.stubEnv("XDG_CONFIG_HOME", cfg);
  vi.stubEnv("LOOPLY_ADMIN_TOKEN", "");
});
afterEach(() => {
  vi.unstubAllEnvs();
  rmSync(cfg, { recursive: true, force: true });
});

describe("credentials", () => {
  it("env LOOPLY_ADMIN_TOKEN tiene prioridad", () => {
    vi.stubEnv("LOOPLY_ADMIN_TOKEN", "from-env");
    saveToken("from-file");
    expect(loadToken()).toBe("from-env");
  });
  it("sin env, lee el token guardado", () => {
    saveToken("guardado-123");
    expect(loadToken()).toBe("guardado-123");
    expect(readFileSync(tokenPath(), "utf8")).toBe("guardado-123");
  });
  it("sin env ni archivo, devuelve string vacío", () => {
    expect(loadToken()).toBe("");
  });
});
