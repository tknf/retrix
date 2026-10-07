import { cp, mkdir, writeFile } from "node:fs/promises";
import { app, paths } from "../dist/server/app.js";

for (const path of paths) {
  const response = await app.request(`http://localhost${path}`);
  if (!response.ok) throw new Error(`生成失敗: ${path}`);
  const directory = `dist/catalog${path === "/" ? "" : path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, await response.text());
}
await cp("src/css", "dist/catalog/src/css", { recursive: true });
await cp("catalog/catalog.css", "dist/catalog/catalog/catalog.css", { recursive: true });
await cp("public/assets", "dist/catalog/assets", { recursive: true });
console.log(`${paths.length}ページを生成しました。`);
