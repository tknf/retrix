import { readFile, writeFile, mkdir } from "node:fs/promises";
const manifest = JSON.parse(await readFile("src/internal/icon-manifest.json", "utf8"));
const symbols = [];
await mkdir("src/css/assets", { recursive: true });
for (const [name, file] of Object.entries(manifest)) {
  if (!/^[a-z-]+$/.test(name) || typeof file !== "string" || !/^[a-z-]+$/.test(file))
    throw new Error("アイコン名が不正です");
  const svg = await readFile(
    `node_modules/@phosphor-icons/core/assets/regular/${file}.svg`,
    "utf8",
  );
  const content = svg.match(/<svg[^>]+>([\s\S]+)<\/svg>/)?.[1];
  if (!content) throw new Error(`SVGを読み取れません: ${file}`);
  symbols.push(
    `<symbol id="rx-${name}" viewBox="0 0 256 256" fill="currentColor">${content}</symbol>`,
  );
  // 縦並びの一覧など、太く塗ったアイコンで項目を見分ける場所のための塗りつぶし版。
  const filled = await readFile(
    `node_modules/@phosphor-icons/core/assets/fill/${file}-fill.svg`,
    "utf8",
  );
  const filledContent = filled.match(/<svg[^>]+>([\s\S]+)<\/svg>/)?.[1];
  if (!filledContent) throw new Error(`SVGを読み取れません: ${file}-fill`);
  symbols.push(
    `<symbol id="rx-${name}-fill" viewBox="0 0 256 256" fill="currentColor">${filledContent}</symbol>`,
  );
  // 同じ素材をSVG useとCSS background/maskのどちらからも使えるようにする。
  await writeFile(`src/css/assets/${name}.svg`, svg);
  // 小さく置いても線が細くならないよう、CSSのアイコンに使う太字版も書き出す（Tagの削除の×など）。
  const bold = await readFile(
    `node_modules/@phosphor-icons/core/assets/bold/${file}-bold.svg`,
    "utf8",
  );
  await writeFile(`src/css/assets/${name}-bold.svg`, bold);
}
const license = await readFile("node_modules/@phosphor-icons/core/LICENSE", "utf8");
const sprite = `<svg xmlns="http://www.w3.org/2000/svg">\n<!-- Phosphor Icons / MIT\n${license.replaceAll("--", "—")}-->\n${symbols.join("\n")}\n</svg>\n`;
await mkdir("public/assets", { recursive: true });
await mkdir("dist", { recursive: true });
await writeFile("public/assets/rx-icons.svg", sprite);
await writeFile("dist/icons.svg", sprite);
await writeFile("dist/PHOSPHOR-LICENSE", license);
const iconTypes = [
  "// src/internal/icon-manifest.jsonからscripts/build-icons.mjsが生成します。",
  "export type IconName =",
  ...Object.keys(manifest).map(
    (name, index, names) => `  | ${JSON.stringify(name)}${index === names.length - 1 ? ";" : ""}`,
  ),
  "",
].join("\n");
await writeFile("src/internal/icon-manifest-types.ts", iconTypes);
console.log(`${symbols.length}個のPhosphorアイコンをスプライトにしました。`);
