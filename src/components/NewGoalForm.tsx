import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { editInEditor } from "../lib/editor.ts";
import type { NewGoalInput } from "../lib/newgoal.ts";
import { ACCENT, DIM, TEXT, runtime as rtOf } from "../theme.ts";
import { FolderPicker } from "./FolderPicker.tsx";

type Field = "repo" | "objetivo" | "criterios" | "runtime" | "mode" | "model" | "effort";
const FIELDS: Field[] = ["repo", "objetivo", "criterios", "runtime", "mode", "model", "effort"];
const EFFORTS = ["", "minimal", "low", "medium", "high", "xhigh"];
const RUNTIMES = ["pi", "claude", "opencode", "codex"] as const;
type RuntimeName = (typeof RUNTIMES)[number];

// Valores para prellenar el form al re-correr un goal existente (tecla `e`).
export interface GoalFormInitial {
  repo?: string;
  objetivo?: string;
  criterios?: string[];
  runtime?: RuntimeName;
  mode?: "sdd" | "simple";
  model?: string;
  effort?: string;
}

export function NewGoalForm({ onCreate, onCancel, setRawMode, tokenMissing, height, initial }: {
  onCreate: (input: NewGoalInput) => Promise<string | null>; // devuelve mensaje de error o null si ok
  onCancel: () => void;
  setRawMode: (v: boolean) => void;
  tokenMissing: boolean;
  height: number;
  initial?: GoalFormInitial; // prellenado al re-correr un goal
}) {
  const [repo, setRepo] = useState(initial?.repo ?? "");
  const [objetivo, setObjetivo] = useState(initial?.objetivo ?? "");
  const [criteria, setCriteria] = useState<string[]>(initial?.criterios ?? []);
  const [rt, setRt] = useState<RuntimeName>(initial?.runtime ?? "pi");
  const [mode, setMode] = useState<"sdd" | "simple">(initial?.mode ?? "sdd");
  const [model, setModel] = useState(initial?.model ?? "");
  const [effort, setEffort] = useState(initial?.effort ?? "");
  const [field, setField] = useState<Field>("objetivo");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [picking, setPicking] = useState(false);
  const [inputMode, setInputMode] = useState<null | "objetivo" | "criterio" | "model">(null);
  const [draft, setDraft] = useState("");

  const move = (dir: number) =>
    setField((f) => FIELDS[(FIELDS.indexOf(f) + dir + FIELDS.length) % FIELDS.length]);
  const cycleEffort = (dir: number) =>
    setEffort((e) => EFFORTS[(EFFORTS.indexOf(e) + dir + EFFORTS.length) % EFFORTS.length]);
  const cycleRuntime = (dir: number) =>
    setRt((r) => RUNTIMES[(RUNTIMES.indexOf(r) + dir + RUNTIMES.length) % RUNTIMES.length]);

  function submitDraft() {
    const v = draft.trim();
    if (inputMode === "objetivo") { setObjetivo(v); setInputMode(null); setDraft(""); }
    else if (inputMode === "model") { setModel(v); setInputMode(null); setDraft(""); }
    else if (inputMode === "criterio") {
      if (!v) { setInputMode(null); setDraft(""); return; } // Enter vacío = terminar
      setCriteria((cs) => [...cs, v]);
      setDraft(""); // queda abierto para el siguiente
    }
  }

  async function submit() {
    setError(null);
    setBusy(true);
    const err = await onCreate({ description: objetivo, repoPath: repo, runtime: rt, mode, acceptanceCriteria: criteria, model, effort });
    setBusy(false);
    if (err) setError(err); // si ok, el padre cierra el form
  }

  useKeyboard((key) => {
    if (picking) return; // el FolderPicker (montado en paralelo) maneja el teclado
    if (busy) return;
    if (key.name === "escape") {
      if (inputMode) { setInputMode(null); setDraft(""); return; }
      return onCancel();
    }
    if (inputMode) return; // el <input> maneja el texto + Enter
    if (key.ctrl && key.name === "s") return void submit();
    if (key.name === "tab") return move(key.shift ? -1 : 1);
    if (key.name === "up") return move(-1);
    if (key.name === "down") return move(1);
    if (field === "runtime" && (key.name === "left" || key.name === "right")) return cycleRuntime(key.name === "left" ? -1 : 1);
    if (field === "mode" && (key.name === "left" || key.name === "right")) return setMode((m) => (m === "sdd" ? "simple" : "sdd"));
    if (field === "effort" && (key.name === "left" || key.name === "right")) return cycleEffort(key.name === "left" ? -1 : 1);
    if (field === "repo" && (key.name === "return" || key.name === "e")) return setPicking(true);
    if (field === "model" && (key.name === "return" || key.name === "a")) { setInputMode("model"); setDraft(model); return; }
    if (field === "objetivo") {
      if (key.name === "return" || key.name === "a") { setInputMode("objetivo"); setDraft(objetivo); return; }
      if (key.name === "e") return setObjetivo(editInEditor(objetivo, setRawMode));
    }
    if (field === "criterios") {
      if (key.name === "return" || key.name === "a") { setInputMode("criterio"); setDraft(""); return; }
      if (key.name === "d") return setCriteria((cs) => cs.slice(0, -1));
      if (key.name === "e")
        return setCriteria(
          editInEditor(criteria.join("\n"), setRawMode).split("\n").map((s) => s.trim()).filter(Boolean),
        );
    }
  });

  if (picking) {
    return (
      <FolderPicker
        initialPath={repo || undefined}
        height={height}
        onPick={(p) => { setRepo(p); setPicking(false); }}
        onCancel={() => setPicking(false)}
      />
    );
  }

  const mark = (f: Field) => (field === f ? ACCENT : DIM);
  const rtInfo = rtOf(rt);
  const objPreview = objetivo
    ? objetivo.replace(/\s+/g, " ").slice(0, 52) + (objetivo.length > 52 ? "…" : "")
    : "(Enter para escribir el objetivo)";
  const onlySimple = mode === "sdd" ? "  · (modo simple)" : "";

  return (
    <box style={{ flexDirection: "column", border: true, borderStyle: "rounded", borderColor: ACCENT, paddingX: 1, flexGrow: 1 }}>
      <text fg={ACCENT} attributes={TextAttributes.BOLD}>{initial ? "  re-correr goal" : "  nuevo goal"}</text>
      <box style={{ flexDirection: "row", marginTop: 1 }}>
        <text fg={mark("repo")}>{`${field === "repo" ? "▌" : " "}repo      `}</text>
        <text fg={repo ? TEXT : DIM} wrapMode="none" truncate>{repo || "(Enter para elegir carpeta)"}</text>
      </box>
      <box style={{ flexDirection: "row" }}>
        <text fg={mark("objetivo")}>{`${field === "objetivo" ? "▌" : " "}objetivo  `}</text>
        {inputMode === "objetivo" ? (
          <input value={draft} onInput={setDraft} onSubmit={submitDraft} focused placeholder="qué querés que haga el agente" style={{ flexGrow: 1 }} />
        ) : (
          <text fg={objetivo ? TEXT : DIM} wrapMode="none" truncate>{objPreview}</text>
        )}
      </box>
      <box style={{ flexDirection: "row" }}>
        <text fg={mark("criterios")}>{`${field === "criterios" ? "▌" : " "}criterios `}</text>
        <text fg={DIM}>
          {`${criteria.length ? `${criteria.length}` : "(ninguno)"}${field === "criterios" && inputMode !== "criterio" ? "  · a agregar · d borrar último" : ""}`}
        </text>
      </box>
      {criteria.map((c, i) => (
        <text key={i} fg={DIM}>{`          • ${c}`}</text>
      ))}
      {inputMode === "criterio" ? (
        <box style={{ flexDirection: "row" }}>
          <text fg={ACCENT}>{"          + "}</text>
          <input value={draft} onInput={setDraft} onSubmit={submitDraft} focused placeholder="criterio (Enter agrega · Enter vacío termina)" style={{ flexGrow: 1 }} />
        </box>
      ) : null}
      <box style={{ flexDirection: "row" }}>
        <text fg={mark("runtime")}>{`${field === "runtime" ? "▌" : " "}runtime   `}</text>
        <text fg={rtInfo.color}>{`${rtInfo.glyph} ${rt}`}</text>
        <text fg={DIM}>   (←/→)</text>
      </box>
      <box style={{ flexDirection: "row" }}>
        <text fg={mark("mode")}>{`${field === "mode" ? "▌" : " "}modo      `}</text>
        <text fg={TEXT}>{mode}</text>
        <text fg={DIM}>   (←/→)</text>
      </box>
      <box style={{ flexDirection: "row" }}>
        <text fg={mark("model")}>{`${field === "model" ? "▌" : " "}modelo    `}</text>
        {inputMode === "model" ? (
          <input value={draft} onInput={setDraft} onSubmit={submitDraft} focused placeholder="ej claude-opus-4-8 / gpt-5.5 (vacío = default)" style={{ flexGrow: 1 }} />
        ) : (
          <text fg={model ? TEXT : DIM} wrapMode="none" truncate>{`${model || "(default del agente)"}${onlySimple}`}</text>
        )}
      </box>
      <box style={{ flexDirection: "row" }}>
        <text fg={mark("effort")}>{`${field === "effort" ? "▌" : " "}effort    `}</text>
        <text fg={effort ? TEXT : DIM}>{effort || "—"}</text>
        <text fg={DIM}>{`   (←/→)${onlySimple}`}</text>
      </box>
      {tokenMissing ? <box style={{ marginTop: 1 }}><text fg="#fb923c">⚠ seteá LOOPLY_ADMIN_TOKEN para poder crear</text></box> : null}
      {error ? <box style={{ marginTop: 1 }}><text fg="#f87171">{`✗ ${error}`}</text></box> : null}
      <box style={{ marginTop: 1 }}>
        <text fg={DIM}>
          {busy ? "creando…"
            : inputMode ? "Enter confirma · Esc cancela"
            : "tab/↑↓ campo · Enter escribir/elegir · ←/→ cambiar · Ctrl-S crear · Esc cancelar"}
        </text>
      </box>
    </box>
  );
}
