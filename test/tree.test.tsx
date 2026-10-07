import { Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { expect, test } from "vite-plus/test";
import { Tree } from "../src/hono";

const render = async (content: Child) => {
  const app = new Hono().get("/", (c) => c.html(html`${content}`));
  return (await app.request("/")).text();
};

test("初期HTMLではリンクをTabの巡回から外さず、JavaScriptなしでも辿れる", async () => {
  const result = await render(
    <Tree
      id="docs"
      label="資料"
      items={[
        {
          value: "guide",
          label: "利用案内",
          href: "/guide",
          children: [{ value: "start", label: "はじめに", href: "/start" }],
        },
      ]}
    />,
  );
  expect(result).toMatch(/<a id="[^"]+-label" href="\/guide">利用案内<\/a>/);
  expect(result).toMatch(/<a id="[^"]+-label" href="\/start">はじめに<\/a>/);
  expect(result).toContain('data-controller="tree tree-presentation"');
});

test("項目の名前は見出しの文字だけから取り、開閉のボタンの名前を混ぜない", async () => {
  const result = await render(
    <Tree
      id="docs"
      label="資料"
      items={[
        { value: "guide", label: "利用案内", children: [{ value: "start", label: "はじめに" }] },
      ]}
    />,
  );
  expect(result).toContain('aria-labelledby="docs-item-0-label"');
  expect(result).toMatch(/<span id="docs-item-0-label" class="label">利用案内<\/span>/);
});
