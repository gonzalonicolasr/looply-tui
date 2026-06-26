export interface Goal {
  id: string; name: string; description: string;
  runtime: string; mode: string; status: string;
  dependsOn: string[]; retries: number; maxRetries: number;
  lastVerdict: string | null; costUsd: number;
  assignedRunner: string | null; recurringCron: string | null;
  error?: string | null; // motivo de falla — lo trae GET /goals, el TUI lo descartaba
  createdAt: number; updatedAt: number;
}

// Detalle completo de un goal (GET /goals/:id): trae los campos de creación que
// la lista omite — usado para re-correr un goal prellenando el formulario.
export interface GoalDetail extends Goal {
  repoPath: string;
  baseBranch: string;
  acceptanceCriteria: string[];
  model: string | null;
  effort: string | null;
}
export interface Run {
  id: number; goalId: string; attempt: number; status: string;
  runtime: string; verdict: string | null; exitCode: number | null;
  costUsd: number | null; startedAt: number; finishedAt: number | null;
}
export interface GoalLogLine { phase: string; line: string; ts: number; }

export type LooplyEvent =
  | { type: "progress"; goalId: string; runId: number; phase: string; line: string }
  | { type: "status"; goalId: string; status: string; verdict: string | null }
  | { type: "runner"; runnerId: string; status: "online" | "offline" };
