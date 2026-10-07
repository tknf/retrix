import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createServer } from "vite-plus";
import { expect, test } from "vite-plus/test";
import { controlTextPlugin } from "../scripts/control-text-plugin";

test("実際のVite読み込み経路で文字指定の退行を拒否し正常なCSSを通す", async () => {
  const directory = await mkdtemp(join(tmpdir(), "rx-control-text-"));
  const cssDirectory = join(directory, "src/css/components");
  await mkdir(cssDirectory, { recursive: true });
  const css = await readFile("src/css/components/dropdown-menu.css", "utf8");
  await writeFile(join(cssDirectory, "dropdown-menu.css"), css);
  await writeFile(
    join(cssDirectory, "invalid.css"),
    "@layer components { .rx-menu > li > .item { font: inherit; } }",
  );
  const server = await createServer({
    root: directory,
    configFile: false,
    plugins: [controlTextPlugin()],
    logLevel: "silent",
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    await expect(server.transformRequest("/src/css/components/invalid.css?direct")).rejects.toThrow(
      "文字位置",
    );
    const transformed = await server.transformRequest(
      "/src/css/components/dropdown-menu.css?direct",
    );
    expect(transformed).not.toBeNull();
  } finally {
    await server.close();
    await rm(directory, { recursive: true, force: true });
  }
});
