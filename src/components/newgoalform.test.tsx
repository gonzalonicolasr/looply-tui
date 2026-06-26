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
});
