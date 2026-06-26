import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { listDirs } from "./browse.ts";

let root: string;

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), "looply-browse-"));
  mkdirSync(join(root, "zeta"));
  mkdirSync(join(root, "alpha"));
  mkdirSync(join(root, "alpha", ".git")); // alpha es un repo git
  mkdirSync(join(root, ".oculto")); // dotdir → debe filtrarse
  writeFileSync(join(root, "archivo.txt"), "x"); // archivo → debe filtrarse
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe("listDirs", () => {
  it("devuelve solo subdirectorios sin dotfiles, ordenados", () => {
    const r = listDirs(root);
    expect(r.entries.map((e) => e.name)).toEqual(["alpha", "zeta"]);
    expect(r.path).toBe(root);
    expect(r.parent).toBe(dirname(root));
  });
  it("parent es null en la raíz", () => {
    expect(listDirs("/").parent).toBeNull();
  });
  it("marca qué carpetas son repos git (.git) y si el path actual lo es", () => {
    const r = listDirs(root);
    expect(r.isGitRepo).toBe(false); // root no es repo
    const alpha = r.entries.find((e) => e.name === "alpha")!;
    const zeta = r.entries.find((e) => e.name === "zeta")!;
    expect(alpha.isRepo).toBe(true);
    expect(zeta.isRepo).toBe(false);
    expect(listDirs(join(root, "alpha")).isGitRepo).toBe(true); // entrar al repo
  });
  it("no lanza ante un path inexistente (devuelve error)", () => {
    const r = listDirs(join(root, "no-existe-jamas"));
    expect(r.entries).toEqual([]);
    expect(r.error).toBeTruthy();
  });
});
