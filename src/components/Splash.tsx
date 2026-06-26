import { useEffect, useState } from "react";
import { TextAttributes } from "@opentui/core";
import { useTerminalDimensions } from "@opentui/react";

// Splash de inicio — el logo LOOPLY con el gradiente sunset de la landing
// (durazno → coral → rosa → violeta) + un shimmer de luz que barre, una línea
// de horizonte que crece y el tagline apareciendo. ~1.4s, se saltea con tecla.
const LOGO = [
  " ╦  ╔═╗╔═╗╔═╗╦  ╦ ╦",
  " ║  ║ ║║ ║╠═╝║  ╚╦╝",
  " ╩═╝╚═╝╚═╝╩  ╩═╝ ╩ ",
];
const STOPS = ["#ffd9a8", "#ff9e7d", "#ff6f91", "#c082c9"]; // atardecer

function hex(h: string) {
  return { r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) };
}
function toHex(r: number, g: number, b: number) {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
function gradAt(t: number) {
  const seg = t * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(seg));
  const f = seg - i;
  const a = hex(STOPS[i]);
  const b = hex(STOPS[i + 1]);
  return { r: a.r + (b.r - a.r) * f, g: a.g + (b.g - a.g) * f, b: a.b + (b.b - a.b) * f };
}
function lighten(c: { r: number; g: number; b: number }, amt: number) {
  return toHex(c.r + (255 - c.r) * amt, c.g + (255 - c.g) * amt, c.b + (255 - c.b) * amt);
}

export function Splash() {
  const { width, height } = useTerminalDimensions();
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setFrame((f) => f + 1), 70);
    return () => clearInterval(id);
  }, []);

  const w = LOGO[0].length;
  const phase = (frame % 18) / 18; // la luz barre 0→1
  const horizonW = Math.min(w, 2 + frame * 3); // el horizonte crece
  const showTag = frame >= 6;

  return (
    <box style={{ width, height, flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {LOGO.map((line, li) => (
        <text key={li}>
          {line.split("").map((ch, ci) => {
            const t = w > 1 ? ci / (w - 1) : 0;
            const base = gradAt(t);
            const d = Math.abs(t - phase);
            const fg = d < 0.13 ? lighten(base, ((0.13 - d) / 0.13) * 0.55) : toHex(base.r, base.g, base.b);
            return <span key={ci} fg={fg} attributes={TextAttributes.BOLD}>{ch}</span>;
          })}
        </text>
      ))}
      <text fg="#ff9e7d">{"─".repeat(Math.max(1, Math.min(w, horizonW)))}</text>
      <text fg={showTag ? "#c4adba" : "#2a2230"}>loop engineer tu IA · chau prompts</text>
    </box>
  );
}
