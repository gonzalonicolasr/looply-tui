// Helpers de scroll/ventana, compartidos por folder picker, descripción y logs.

export function clampOffset(offset: number, total: number, height: number): number {
  const max = Math.max(0, total - height);
  return Math.max(0, Math.min(offset, max));
}

// Ventana desde el tope: items[offset .. offset+height]. offset se clampa.
export function windowFromTop<T>(items: T[], offset: number, height: number): T[] {
  const start = clampOffset(offset, items.length, height);
  return items.slice(start, start + height);
}

// Ventana desde el fondo: offsetFromEnd=0 → últimas `height`; aumentar sube.
export function windowFromBottom<T>(items: T[], offsetFromEnd: number, height: number): T[] {
  const off = clampOffset(offsetFromEnd, items.length, height);
  const end = Math.max(0, items.length - off);
  const start = Math.max(0, end - height);
  return items.slice(start, end);
}

// offset (desde el tope) que mantiene visible el índice seleccionado.
export function offsetForSelection(selIdx: number, total: number, height: number): number {
  const offset = selIdx >= height ? selIdx - height + 1 : 0;
  return clampOffset(offset, total, height);
}
