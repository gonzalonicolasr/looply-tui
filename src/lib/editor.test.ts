import { describe, it, expect } from "vitest";
import { appendFileSync } from "node:fs";
import { editInEditor } from "./editor.ts";

describe("editInEditor", () => {
  it("siembra el initial, corre el editor y devuelve el contenido editado", () => {
    // editor fake: agrega texto al archivo que recibe como argumento
    const fakeSpawn = ((_cmd: string, args: string[]) => {
      appendFileSync(args[0], " + editado");
      return { status: 0 } as ReturnType<typeof import("node:child_process").spawnSync>;
    }) as typeof import("node:child_process").spawnSync;

    const rawCalls: boolean[] = [];
    const out = editInEditor("inicial", (v) => rawCalls.push(v), { editor: "fake", spawn: fakeSpawn });

    expect(out).toBe("inicial + editado");
    expect(rawCalls).toEqual([false, true]); // soltó y restauró el raw mode
  });

  it("devuelve string vacío si el contenido queda en blanco", () => {
    const noop = (() => ({ status: 0 })) as unknown as typeof import("node:child_process").spawnSync;
    const out = editInEditor("   ", () => {}, { editor: "fake", spawn: noop });
    expect(out).toBe("");
  });
});
