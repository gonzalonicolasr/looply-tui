import { describe, it, expect } from "bun:test";
import { frameOf } from "./__testutil.ts";
import { Board } from "./Board.tsx";
import { LogStream } from "./LogStream.tsx";
import { Footer } from "./Footer.tsx";
import { Detail } from "./Detail.tsx";
import type { Goal } from "../data/types.ts";

const goal = (id: string, status: string): Goal => ({
  id, name: id, description: "", runtime: "pi", mode: "sdd", status,
  dependsOn: [], retries: 0, maxRetries: 2, lastVerdict: null, costUsd: 0,
  assignedRunner: null, recurringCron: null, createdAt: 0, updatedAt: 0,
});

describe("estructura", () => {
  it("Board muestra los títulos de lane con goals", async () => {
    const f = await frameOf(
      <Board goals={[goal("a", "active"), goal("b", "draft")]} selectedId="a" />,
      60, 12,
    );
    expect(f).toContain("IN-FLIGHT");
    expect(f).toContain("BACKLOG");
    expect(f).toContain("a");
    expect(f).toContain("b");
  });
  it("LogStream colorea por fase y muestra las líneas", async () => {
    const f = await frameOf(
      <LogStream lines={[{ phase: "build", line: "compilando", ts: 0 }]} height={5} active />,
      50, 8,
    );
    expect(f).toContain("compilando");
    expect(f).toContain("build");
  });
  it("LogStream con offset muestra el indicador de scroll", async () => {
    const lines = Array.from({ length: 20 }, (_, i) => ({ phase: "build", line: `l${i}`, ts: 0 }));
    const f = await frameOf(<LogStream lines={lines} height={5} active={false} offset={5} />, 50, 8);
    expect(f).toContain("líneas más abajo");
  });
  it("Footer muestra los keybindings", async () => {
    const f = await frameOf(<Footer connected base="http://x" />, 80, 3);
    expect(f).toContain("salir");
  });
  it("Detail trunca una descripción gigante (no explota en altura)", async () => {
    const big = goal("rfc", "active");
    big.description = "lorem ipsum dolor sit amet ".repeat(2000); // ~54k chars
    const f = await frameOf(
      <Detail goal={big} logs={[]} runs={[]} logHeight={5} spinnerFrame={0} />,
      80, 18,
    );
    expect(f.split("\n").length).toBeLessThan(20); // canvas acotado
    expect(f).toContain("history"); // la desc gigante se truncó → la sección de abajo sigue visible
  });
});
