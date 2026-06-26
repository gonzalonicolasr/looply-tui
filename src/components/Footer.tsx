import { DIM } from "../theme.ts";

export function Footer({ connected, base, showForm = false }: {
  connected: boolean; base: string; showForm?: boolean;
}) {
  return (
    <box style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <text fg={DIM}>
        {showForm
          ? "Esc cierra / cancela"
          : "↑↓ goal · ⏎ desc · e re-correr · PgUp/Dn logs · n nuevo · r refrescar · q salir"}
      </text>
      <text fg={connected ? "#34d399" : "#fb923c"}>{base.replace(/^https?:\/\//, "")}</text>
    </box>
  );
}
