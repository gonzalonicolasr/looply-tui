import { TextAttributes } from "@opentui/core";
import { gradientChars } from "../lib/gradient.ts";
import { ACCENT, ACCENT2 } from "../theme.ts";

const LOGO = [
  " ╦  ╔═╗╔═╗╔═╗╦  ╦ ╦",
  " ║  ║ ║║ ║╠═╝║  ╚╦╝",
  " ╩═╝╚═╝╚═╝╩  ╩═╝ ╩ ",
];

export function Banner() {
  return (
    <box style={{ flexDirection: "column" }}>
      {LOGO.map((line, i) => (
        <text key={i}>
          {gradientChars(line, ACCENT, ACCENT2).map((c, j) => (
            <span key={j} fg={c.color} attributes={TextAttributes.BOLD}>{c.ch}</span>
          ))}
        </text>
      ))}
    </box>
  );
}
