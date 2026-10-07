import { defineConfig } from "vite-plus";
import devServer, { defaultOptions } from "@hono/vite-dev-server";
import { controlTextPlugin } from "./scripts/control-text-plugin";

export default defineConfig(({ mode }) => ({
  staged: { "*": "vp check --no-error-on-unmatched-pattern" },
  plugins: [
    controlTextPlugin(),
    ...(mode === "client"
      ? []
      : [
          devServer({
            entry: "catalog/app.tsx",
            export: "app",
            exclude: [...defaultOptions.exclude, /^\/src\/css\/assets\//],
          }),
        ]),
  ],
  server: { host: "127.0.0.1", port: 5173, strictPort: true },
  build:
    mode === "client"
      ? {
          outDir: "dist/catalog",
          emptyOutDir: false,
          rolldownOptions: {
            input: "catalog/client.ts",
            output: { entryFileNames: "assets/client.js" },
          },
        }
      : {
          ssr: "catalog/app.tsx",
          outDir: "dist/server",
          rolldownOptions: { output: { entryFileNames: "app.js" } },
        },
  pack: [
    { entry: ["src/hono/index.ts"], outDir: "dist/hono", dts: true, format: "esm" },
    { entry: ["src/controllers/index.ts"], outDir: "dist/controllers", dts: true, format: "esm" },
  ],
  lint: { options: { typeAware: true, typeCheck: true } },
  test: { include: ["test/**/*.test.ts", "test/**/*.test.tsx"] },
}));
