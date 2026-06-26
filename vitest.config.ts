import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
  // Solo los tests framework-agnósticos (lib/data/theme) corren en vitest/Node.
  // Los tests de componentes (.test.tsx) usan OpenTUI y corren bajo `bun test`.
  test: { environment: "node", include: ["src/**/*.test.ts"] },
});
