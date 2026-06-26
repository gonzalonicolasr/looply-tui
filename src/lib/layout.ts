export interface Layout {
  bodyHeight: number; // alto del panel master-detail (board/detalle)
  logHeight: number;  // cuántas líneas de log mostrar dentro del detalle
}

// Reparte la altura del terminal sin exceder nunca rows. El chrome fijo:
// banner(3) + statbar(1) + gap(1) + footer(1) = 6. El detalle reserva su propio
// chrome (border, nombre, status, descripción, headers de sección, history).
export function computeLayout(rows: number): Layout {
  const CHROME = 6;
  const bodyHeight = Math.max(1, rows - CHROME);
  const DETAIL_CHROME = 9; // border 2 + nombre + status + desc + "logs" + "history" + ~3 history
  const logHeight = Math.max(2, bodyHeight - DETAIL_CHROME);
  return { bodyHeight, logHeight };
}
