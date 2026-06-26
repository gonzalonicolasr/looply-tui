import { describe, it, expect } from "bun:test";
import { frameOf } from "./__testutil.ts";
import { NewGoalForm } from "./NewGoalForm.tsx";

describe("NewGoalForm", () => {
  it("muestra los campos y el hint de teclas", async () => {
    const f = await frameOf(
      <NewGoalForm onCreate={async () => null} onCancel={() => {}} setRawMode={() => {}} tokenMissing={false} height={20} />,
      90, 30,
    );
    expect(f).toContain("nuevo goal");
    expect(f).toContain("repo");
    expect(f).toContain("runtime");
    expect(f).toContain("modo");
    expect(f).toContain("Esc cancelar");
  });
  it("avisa cuando falta el admin token", async () => {
    const f = await frameOf(
      <NewGoalForm onCreate={async () => null} onCancel={() => {}} setRawMode={() => {}} tokenMissing height={20} />,
      90, 30,
    );
    expect(f).toContain("LOOPLY_ADMIN_TOKEN");
  });
  it("prellena los campos cuando recibe `initial` (re-correr un goal)", async () => {
    const f = await frameOf(
      <NewGoalForm
        onCreate={async () => null} onCancel={() => {}} setRawMode={() => {}} tokenMissing={false} height={20}
        initial={{ repo: "/home/gon/projects/looply", objetivo: "arreglar el mcp del browser", runtime: "claude", mode: "simple" }}
      />,
      90, 30,
    );
    expect(f).toContain("re-correr goal");          // título cambia
    expect(f).toContain("looply");                  // repo prellenado
    expect(f).toContain("arreglar el mcp del browser"); // objetivo prellenado
  });
  it("muestra los runtimes nuevos (opencode/codex) cuando vienen prellenados", async () => {
    const fo = await frameOf(
      <NewGoalForm onCreate={async () => null} onCancel={() => {}} setRawMode={() => {}} tokenMissing={false} height={20} initial={{ runtime: "opencode" }} />,
      90, 30,
    );
    expect(fo).toContain("opencode");
    const fc = await frameOf(
      <NewGoalForm onCreate={async () => null} onCancel={() => {}} setRawMode={() => {}} tokenMissing={false} height={20} initial={{ runtime: "codex" }} />,
      90, 30,
    );
    expect(fc).toContain("codex");
  });
});
