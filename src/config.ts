export const LOOPLY_URL = (process.env.LOOPLY_URL ?? "https://looply.ceroclawd.com").replace(/\/$/, "");
export const DEFAULT_EMAIL = process.env.LOOPLY_AUTH_EMAIL ?? "gonza@test.com";
// El token para crear goals se resuelve en lib/credentials (env > archivo) + login.
export const LOG_BUFFER = 500;          // máximo de líneas de log por goal
export const LOG_FLUSH_MS = 100;        // throttle de re-render de logs
export const RECONNECT_BASE_MS = 1000;  // backoff inicial de SSE
export const RECONNECT_MAX_MS = 15000;  // backoff tope
