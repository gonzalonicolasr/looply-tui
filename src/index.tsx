import { useEffect, useState } from "react";
import { createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";
import { App } from "./app.tsx";
import { Splash } from "./components/Splash.tsx";
import { LOOPLY_URL } from "./config.ts";

// Muestra el splash sunset al arrancar (~1.4s), después el board. Cualquier
// tecla lo saltea; LOOPLY_NO_SPLASH=1 lo desactiva.
function Boot({ base }: { base: string }) {
  const [booting, setBooting] = useState(process.env.LOOPLY_NO_SPLASH !== "1");
  useEffect(() => {
    if (!booting) return;
    const t = setTimeout(() => setBooting(false), 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useKeyboard(() => {
    if (booting) setBooting(false);
  });
  return booting ? <Splash /> : <App base={base} />;
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<Boot base={LOOPLY_URL} />);
