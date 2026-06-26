import { describe, it, expect } from "vitest";
import { parseSSE } from "./sse.ts";

describe("parseSSE", () => {
  it("parsea un frame named-event con data JSON", () => {
    const { events, rest } = parseSSE('event: status\ndata: {"type":"status","goalId":"g1","status":"active","verdict":null}\n\n');
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: "status", goalId: "g1", status: "active" });
    expect(rest).toBe("");
  });
  it("acumula un frame parcial en rest hasta el \\n\\n", () => {
    const { events, rest } = parseSSE('event: progress\ndata: {"type":"progress"');
    expect(events).toHaveLength(0);
    expect(rest).toContain("progress");
  });
  it("ignora frames de comentario/retry sin data", () => {
    const { events } = parseSSE("retry: 3000\n\n");
    expect(events).toHaveLength(0);
  });
  it("parsea múltiples frames en un chunk", () => {
    const chunk =
      'data: {"type":"runner","runnerId":"omarchy","status":"online"}\n\n' +
      'data: {"type":"progress","goalId":"g1","runId":1,"phase":"build","line":"x"}\n\n';
    const { events } = parseSSE(chunk);
    expect(events).toHaveLength(2);
    expect(events[1]).toMatchObject({ type: "progress", phase: "build" });
  });
});
