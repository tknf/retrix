import type { Child } from "hono/jsx";

/** 例がSSRで使うリクエスト由来の値。WingはcookieからSSRの開閉状態を決める。 */
export type ExampleContext = { cookies: Record<string, string> };

const modules = import.meta.glob<{ default: (context: ExampleContext) => Child }>(
  "./hono-examples/*.tsx",
  {
    eager: true,
  },
);
const sources = import.meta.glob<string>("./hono-examples/*.tsx", {
  eager: true,
  query: "?raw",
  import: "default",
});

// 描画するコード自体を掲載し、展示とコピー用コードのずれを防ぐ。
export const getHonoExample = (id: string) => {
  const path = `./hono-examples/${id}.tsx`;
  const example = modules[path];
  const source = sources[path];
  if (!example || !source) throw new Error(`Hono利用例がありません: ${id}`);
  return {
    render: example.default,
    source: source.replace('"../../src/hono"', '"@tknf/retrix/hono"'),
  };
};
