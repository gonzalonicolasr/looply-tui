import { useState } from "react";
import { useKeyboard, usePaste } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { ACCENT, DIM, TEXT } from "../theme.ts";

export function Login({ onLogin, onCancel, defaultEmail }: {
  onLogin: (email: string, password: string) => Promise<string | null>; // error o null si ok
  onCancel: () => void;
  defaultEmail?: string;
}) {
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [password, setPassword] = useState("");
  const [field, setField] = useState<"email" | "password">("email");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (busy) return;
    setError(null);
    setBusy(true);
    const err = await onLogin(email.trim(), password);
    setBusy(false);
    if (err) setError(err); // si ok, el padre cierra el login
  }

  useKeyboard((key) => {
    if (busy) return;
    if (key.name === "escape") return onCancel();
    if (key.name === "tab") return setField((f) => (f === "email" ? "password" : "email"));
    // OpenTUI <input> no enmascara, así que el password se captura acá a mano.
    if (field !== "password") return;
    if (key.name === "return") return void submit();
    if (key.name === "backspace") return setPassword((p) => p.slice(0, -1));
    if (key.sequence && key.sequence.length === 1 && !key.ctrl && !key.meta && key.sequence >= " ") {
      const ch = key.sequence;
      setPassword((p) => p + ch);
    }
  });

  // El <input> de email maneja su propio paste; el password (capturado a mano)
  // necesita el evento de paste explícito (no llega como keypress).
  usePaste((e) => {
    if (busy || field !== "password") return;
    const text = new TextDecoder().decode(e.bytes).replace(/[\r\n]/g, "");
    if (text) setPassword((p) => p + text);
  });

  const pwMask = password.length ? "•".repeat(password.length) : "";

  return (
    <box style={{ flexDirection: "column", border: true, borderStyle: "rounded", borderColor: ACCENT, paddingX: 1, flexGrow: 1 }}>
      <text fg={ACCENT} attributes={TextAttributes.BOLD}>  login a looply</text>
      <text fg={DIM}>  (para crear goals — solo la primera vez, queda guardado)</text>
      <box style={{ flexDirection: "row", marginTop: 1 }}>
        <text fg={field === "email" ? ACCENT : DIM}>{`${field === "email" ? "▌" : " "}email     `}</text>
        <input
          value={email}
          onInput={setEmail}
          focused={field === "email"}
          onSubmit={() => setField("password")}
          placeholder="gonza@test.com"
          style={{ flexGrow: 1 }}
        />
      </box>
      <box style={{ flexDirection: "row" }}>
        <text fg={field === "password" ? ACCENT : DIM}>{`${field === "password" ? "▌" : " "}password  `}</text>
        <text fg={pwMask ? TEXT : DIM}>{pwMask || "••••••"}</text>
      </box>
      {error ? <box style={{ marginTop: 1 }}><text fg="#f87171">{`✗ ${error}`}</text></box> : null}
      <box style={{ marginTop: 1 }}>
        <text fg={busy ? TEXT : DIM}>
          {busy ? "entrando…" : "Tab cambia campo · Enter en password entra · Esc cancela"}
        </text>
      </box>
    </box>
  );
}
