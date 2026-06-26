import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { App } from "./app.tsx";
import { LOOPLY_URL } from "./config.ts";

const renderer = await createCliRenderer();
createRoot(renderer).render(<App base={LOOPLY_URL} />);
