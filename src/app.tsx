import { useEffect, useState } from "react";
import { useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/react";
import { useLooplyData } from "./data/useLooplyData.ts";
import { deriveStats, activityBuckets } from "./data/store.ts";
import { computeLayout } from "./lib/layout.ts";
import { clampOffset } from "./lib/scroll.ts";
import { buildGoalPayload, type NewGoalInput } from "./lib/newgoal.ts";
import { loadToken, saveToken } from "./lib/credentials.ts";
import { createGoal, markReady, login, getGoalDetail } from "./data/api.ts";
import { DEFAULT_EMAIL } from "./config.ts";
import { Header } from "./components/Header.tsx";
import { Board } from "./components/Board.tsx";
import { Detail } from "./components/Detail.tsx";
import { Footer } from "./components/Footer.tsx";
import { NewGoalForm, type GoalFormInitial } from "./components/NewGoalForm.tsx";
import { DescriptionView } from "./components/DescriptionView.tsx";
import { Login } from "./components/Login.tsx";

// Soltar/restaurar raw mode para el editor externo (antes lo daba Ink useStdin).
const setRawMode = (v: boolean) => {
  try {
    process.stdin.setRawMode?.(v);
  } catch {
    /* sin TTY */
  }
};

export function App({ base }: { base: string }) {
  const renderer = useRenderer();
  const { width: cols, height: rows } = useTerminalDimensions();
  const data = useLooplyData(base);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [spinner, setSpinner] = useState(0);
  const [token, setToken] = useState<string>(() => loadToken());
  const [showLogin, setShowLogin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDesc, setShowDesc] = useState(false);
  const [logOffset, setLogOffset] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [editInitial, setEditInitial] = useState<GoalFormInitial | null>(null);

  const goals = data.goals;
  const selected = goals[Math.min(selectedIdx, Math.max(0, goals.length - 1))] ?? null;
  const hasActive = goals.some((g) => g.status === "active");
  const overlayOpen = showLogin || showForm || showDesc;

  const { bodyHeight, logHeight } = computeLayout(rows);
  const selLogs = selected ? data.logs[selected.id] ?? [] : [];

  useEffect(() => {
    if (selected) data.loadGoalDetail(selected.id);
    setLogOffset(0); // resetear scroll de logs al cambiar de goal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  useEffect(() => {
    if (!hasActive) return;
    const t = setInterval(() => setSpinner((s) => s + 1), 150);
    return () => clearInterval(t);
  }, [hasActive]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // navegación del board: inactiva mientras hay un overlay (login/form/descripción)
  useKeyboard((key) => {
    if (overlayOpen) return; // los overlays montan su propio useKeyboard
    if (key.name === "q" || (key.ctrl && key.name === "c")) { renderer.destroy(); return; }
    if (key.name === "n") { setEditInitial(null); token ? setShowForm(true) : setShowLogin(true); return; } // lazy login
    if (key.name === "e") { // re-correr: abrir el form prellenado con los valores del goal
      if (!selected) return;
      getGoalDetail(base, selected.id)
        .then((g) => {
          setEditInitial({
            repo: g.repoPath,
            objetivo: g.description,
            criterios: g.acceptanceCriteria,
            runtime: g.runtime === "claude" ? "claude" : "pi",
            mode: g.mode === "simple" ? "simple" : "sdd",
            model: g.model ?? "",
            effort: g.effort ?? "",
          });
          token ? setShowForm(true) : setShowLogin(true);
        })
        .catch(() => setToast("no pude cargar el goal para re-correr"));
      return;
    }
    if (key.name === "return") { if (selected) setShowDesc(true); return; }
    if (key.name === "pageup") { setLogOffset((o) => clampOffset(o + logHeight, selLogs.length, logHeight)); return; }
    if (key.name === "pagedown") { setLogOffset((o) => clampOffset(o - logHeight, selLogs.length, logHeight)); return; }
    if (key.name === "down" || key.name === "j") setSelectedIdx((i) => Math.min(goals.length - 1, i + 1));
    if (key.name === "up" || key.name === "k") setSelectedIdx((i) => Math.max(0, i - 1));
    if (key.name === "g" && !key.shift) setSelectedIdx(0);
    if (key.name === "g" && key.shift) setSelectedIdx(Math.max(0, goals.length - 1)); // G
    if (key.name === "r") data.loadGoalDetail(selected?.id ?? "");
  });

  async function handleLogin(email: string, password: string): Promise<string | null> {
    try {
      const t = await login(base, email, password);
      saveToken(t);
      setToken(t);
      setShowLogin(false);
      setShowForm(true); // tras loguear, seguís a crear el goal
      return null;
    } catch (e) {
      return String((e as Error).message ?? e);
    }
  }

  async function handleCreate(input: NewGoalInput): Promise<string | null> {
    const built = buildGoalPayload(input);
    if ("error" in built) return built.error;
    if (!token) return "sesión expirada — Esc y volvé a entrar";
    try {
      const g = await createGoal(base, token, built.payload);
      await markReady(base, token, g.id);
      setShowForm(false);
      setEditInitial(null);
      setToast(`✓ creado y encolado: ${g.id}`);
      data.refresh();
      return null;
    } catch (e) {
      return String((e as Error).message ?? e);
    }
  }

  const stats = deriveStats(goals);
  const activity = activityBuckets(goals, Math.floor(Date.now() / 1000));

  return (
    <box style={{ flexDirection: "column", height: rows, overflow: "hidden", paddingX: 1 }}>
      <Header stats={stats} activity={activity} connected={data.connected} runnerOnline={data.runnerOnline} />
      <box style={{ flexDirection: "row", marginTop: 1, height: bodyHeight, overflow: "hidden" }}>
        {showLogin ? (
          <Login onLogin={handleLogin} onCancel={() => setShowLogin(false)} defaultEmail={DEFAULT_EMAIL} />
        ) : showForm ? (
          <NewGoalForm
            onCreate={handleCreate}
            onCancel={() => { setShowForm(false); setEditInitial(null); }}
            setRawMode={setRawMode}
            tokenMissing={!token}
            height={bodyHeight}
            initial={editInitial ?? undefined}
          />
        ) : showDesc && selected ? (
          <DescriptionView goal={selected} width={cols} height={bodyHeight} onClose={() => setShowDesc(false)} />
        ) : (
          <>
            <box style={{ flexDirection: "column", width: "42%", marginRight: 1, overflow: "hidden" }}>
              <Board goals={goals} selectedId={selected?.id ?? null} />
            </box>
            <box style={{ flexDirection: "column", flexGrow: 1, border: true, borderStyle: "rounded", borderColor: "#3f3f46", overflow: "hidden" }}>
              <Detail
                goal={selected}
                logs={selLogs}
                runs={selected ? data.runs[selected.id] ?? [] : []}
                logHeight={logHeight}
                spinnerFrame={spinner}
                logOffset={logOffset}
              />
            </box>
          </>
        )}
      </box>
      {toast ? <text fg="#34d399">{toast}</text> : null}
      <Footer connected={data.connected} base={base} showForm={overlayOpen} />
    </box>
  );
}
