import ts from "typescript";
import { access, readFile, readdir, mkdtemp, writeFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const pkg = JSON.parse(await readFile("package.json", "utf8"));
for (const key of ["./hono", "./controllers"]) {
  for (const target of Object.values(pkg.exports[key])) await access(target);
}
for (const file of await readdir("src/css", { recursive: true })) {
  if (file.endsWith(".css")) {
    const source = await readFile(`src/css/${file}`, "utf8");
    const distributed = await readFile(`dist/css/${file}`, "utf8");
    if (source !== distributed) throw new Error(`配布CSSが不一致: ${file}`);
    const catalog = await readFile(`dist/catalog/src/css/${file}`, "utf8");
    if (source !== catalog) throw new Error(`カタログCSSが不一致: ${file}`);
  }
}
const components = await import(pathToFileURL(resolve(pkg.exports["./hono"].import)).href);
if (typeof components.Button !== "function") throw new Error("Honoのエントリーポイントが不正");
console.log("Hono・controllersのエントリーポイント、型定義、配布CSSを確認しました。");

// 掲載する各例を配布済みの公開型で検査する。ソース型だけの成功にしない。
const temporary = await mkdtemp(resolve(".rx-consumer-"));
try {
  const files = [];
  for (const file of await readdir("catalog/hono-examples")) {
    if (!file.endsWith(".tsx")) continue;
    const source = await readFile(`catalog/hono-examples/${file}`, "utf8");
    const target = resolve(temporary, file);
    await writeFile(target, source.replace('"../../src/hono"', '"@tknf/retrix/hono"'));
    files.push(target);
  }
  const program = ts.createProgram(files, {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    jsxImportSource: "hono/jsx",
    strict: true,
    noEmit: true,
    skipLibCheck: true,
  });
  const diagnostics = ts.getPreEmitDiagnostics(program);
  if (diagnostics.length) {
    throw new Error(
      ts.formatDiagnosticsWithColorAndContext(diagnostics, {
        getCanonicalFileName: (file) => file,
        getCurrentDirectory: () => process.cwd(),
        getNewLine: () => "\n",
      }),
    );
  }
  console.log(`${files.length}件の掲載コードを@tknf/retrix/honoの配布型で確認しました。`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}

const sprite = await readFile("dist/icons.svg", "utf8");
if (sprite !== (await readFile("dist/catalog/assets/rx-icons.svg", "utf8")))
  throw new Error("配布スプライトが不一致");
await access("dist/PHOSPHOR-LICENSE");
const iconManifest = JSON.parse(await readFile("src/internal/icon-manifest.json", "utf8"));
for (const name of Object.keys(iconManifest)) {
  const source = await readFile(`src/css/assets/${name}.svg`, "utf8");
  for (const directory of ["dist/css/assets", "dist/catalog/src/css/assets"])
    if ((await readFile(`${directory}/${name}.svg`, "utf8")) !== source)
      throw new Error(`配布入力アイコンが不一致: ${name}`);
}
console.log("共通スプライト・入力アイコン・ライセンスの配布を確認しました。");
