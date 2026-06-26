import { testRender } from "@opentui/react/test-utils";

// Renderiza un nodo OpenTUI en el test-renderer headless y devuelve el frame de
// caracteres (equivalente a `lastFrame()` de ink-testing-library). OJO:
// captureCharFrame devuelve TODO el canvas (width×height), no solo el contenido,
// así que el conteo de líneas mide el canvas — dimensioná `height` acorde.
export async function frameOf(node: any, width = 80, height = 24): Promise<string> {
  const s = await testRender(node, { width, height });
  await s.renderOnce();
  const f = s.captureCharFrame();
  s.renderer.destroy();
  return f;
}
