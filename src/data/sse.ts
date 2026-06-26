import type { LooplyEvent } from "./types.ts";
import { RECONNECT_BASE_MS, RECONNECT_MAX_MS } from "../config.ts";

// Parser puro: recibe el buffer acumulado, devuelve los eventos completos y el
// resto sin terminar. Cada frame SSE termina en "\n\n".
export function parseSSE(buffer: string): { events: LooplyEvent[]; rest: string } {
  const events: LooplyEvent[] = [];
  const parts = buffer.split("\n\n");
  const rest = parts.pop() ?? "";
  for (const frame of parts) {
    const dataLines = frame
      .split("\n")
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trim());
    if (dataLines.length === 0) continue;
    try {
      events.push(JSON.parse(dataLines.join("\n")) as LooplyEvent);
    } catch {
      // frame no-JSON (p.ej. retry) → ignorar
    }
  }
  return { events, rest };
}

// Cliente: abre el stream SSE y llama onEvent por cada evento; reconecta con
// backoff. Devuelve una función para cerrar. onStatus informa la conexión.
export function connectEvents(
  base: string,
  onEvent: (e: LooplyEvent) => void,
  onStatus: (connected: boolean) => void,
): () => void {
  let closed = false;
  let controller: AbortController | null = null;
  let backoff = RECONNECT_BASE_MS;

  async function loop() {
    while (!closed) {
      controller = new AbortController();
      try {
        const res = await fetch(`${base}/events`, {
          headers: { accept: "text/event-stream" },
          signal: controller.signal,
        });
        if (!res.ok || !res.body) throw new Error(`SSE ${res.status}`);
        onStatus(true);
        backoff = RECONNECT_BASE_MS;
        const reader = (res.body as ReadableStream<Uint8Array>).getReader();
        const decoder = new TextDecoder();
        let buf = "";
        while (!closed) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const { events, rest } = parseSSE(buf);
          buf = rest;
          for (const e of events) onEvent(e);
        }
      } catch {
        // cae a reconexión
      }
      if (closed) break;
      onStatus(false);
      await new Promise((r) => setTimeout(r, backoff));
      backoff = Math.min(backoff * 2, RECONNECT_MAX_MS);
    }
  }
  loop();
  return () => {
    closed = true;
    controller?.abort();
  };
}
