import { cp } from "node:fs/promises";
await cp("src/css", "dist/css", { recursive: true });
