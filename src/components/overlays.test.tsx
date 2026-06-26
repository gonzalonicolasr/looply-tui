import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { frameOf } from "./__testutil.ts";
import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FolderPicker } from "./FolderPicker.tsx";
import { DescriptionView } from "./DescriptionView.tsx";
import { Login } from "./Login.tsx";
import type { Goal } from "../data/types.ts";

let root: string;
beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "looply-fp-"));
  mkdirSync(join(root, "proyecto-a"));
  mkdirSync(join(root, "proyecto-a", ".git")); // proyecto-a es repo git
  mkdirSync(join(root, "proyecto-b"));
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

const goal = (over: Partial<Goal>): Goal => ({
  id: "g", name: "g", description: "", runtime: "pi", mode: "sdd", status: "done",
  dependsOn: [], retries: 0, maxRetries: 2, lastVerdict: null, costUsd: 0,
  assignedRunner: null, recurringCron: null, createdAt: 0, updatedAt: 0, ...over,
});

describe("FolderPicker", () => {
  it("lista las subcarpetas del path inicial y muestra los hints", async () => {
    const f = await frameOf(
      <FolderPicker initialPath={root} height={20} onPick={() => {}} onCancel={() => {}} />,
      80, 24,
    );
    expect(f).toContain("proyecto-a");
    expect(f).toContain("proyecto-b");
    expect(f).toContain("elegí");
    expect(f).toContain("Esc cancelar");
    expect(f).toContain("no es repo git"); // aviso no bloqueante: el root no es repo
    expect(f).toContain("✓ git");          // proyecto-a marcado como repo
  });
});

describe("DescriptionView", () => {
  it("muestra una descripción larga acotada a la altura (no explota)", async () => {
    const big = goal({ name: "rfc", description: "lorem ipsum ".repeat(500) });
    const f = await frameOf(
      <DescriptionView goal={big} width={60} height={12} onClose={() => {}} />,
      60, 15,
    );
    expect(f).toContain("rfc");
    expect(f).toContain("líneas");
    expect(f.split("\n").length).toBeLessThanOrEqual(16); // canvas acotado
    expect(f).toContain("Esc cierra"); // el hint de abajo sigue visible → la desc se windoweó (no explotó)
  });
});

describe("Login", () => {
  it("muestra los campos email y password con el email por default", async () => {
    const f = await frameOf(
      <Login onLogin={async () => null} onCancel={() => {}} defaultEmail="gonza@test.com" />,
      60, 12,
    );
    expect(f).toContain("login a looply");
    expect(f).toContain("email");
    expect(f).toContain("password");
    expect(f).toContain("gonza@test.com");
  });
});
