export interface NewGoalInput {
  description: string;
  repoPath: string;
  runtime: string;
  mode: string;
  acceptanceCriteria?: string[];
  model?: string;
  effort?: string;
}
export interface GoalPayload {
  description: string;
  repoPath: string;
  runtime: "pi" | "claude";
  mode: "sdd" | "simple";
  acceptanceCriteria: string[];
  model?: string;
  effort?: string;
}

// Valida y normaliza lo que el usuario tipeó en el formulario. description y
// repoPath son obligatorios (igual que parseCreateGoal del backend); runtime y
// mode caen a sus defaults si vienen raros; acceptanceCriteria se trimea y
// descarta vacíos; model/effort se incluyen solo si tienen valor (aplican al
// agente en modo simple; en sdd los maneja zero).
export function buildGoalPayload(input: NewGoalInput): { payload: GoalPayload } | { error: string } {
  const description = input.description.trim();
  const repoPath = input.repoPath.trim();
  if (!description) return { error: "la descripción es obligatoria (apretá 'e')" };
  if (!repoPath) return { error: "el repo es obligatorio" };
  const runtime: "pi" | "claude" = input.runtime === "claude" ? "claude" : "pi";
  const mode: "sdd" | "simple" = input.mode === "simple" ? "simple" : "sdd";
  const acceptanceCriteria = (input.acceptanceCriteria ?? []).map((c) => c.trim()).filter(Boolean);
  const payload: GoalPayload = { description, repoPath, runtime, mode, acceptanceCriteria };
  const model = (input.model ?? "").trim();
  const effort = (input.effort ?? "").trim();
  if (model) payload.model = model;
  if (effort) payload.effort = effort;
  return { payload };
}
