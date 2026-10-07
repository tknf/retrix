import { Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { expect, test } from "vite-plus/test";
import { SplitButton } from "../src/hono";

const render = async (content: Child) => {
  const app = new Hono().get("/", (c) => c.html(html`${content}`));
  return (await app.request("/")).text();
};

const items = () => [{ value: "draft", label: "下書きとして保存" }];

const buttonTag = (result: string, pattern: RegExp) => {
  const tag = result.match(/<button[^>]*>/g)?.find((candidate) => pattern.test(candidate));
  if (!tag) throw new Error(`ボタンが見つからない: ${pattern}`);
  return tag;
};

test("idを主操作のボタンに付け、▾のメニューと操作は派生したidにする", async () => {
  const result = await render(<SplitButton id="send" label="送る" items={items()} />);
  expect(buttonTag(result, /class="rx-button main"/)).toContain('id="send"');
  expect(buttonTag(result, /data-dropdown-menu-target="trigger"/)).toContain(
    'id="send-menu-trigger"',
  );
  expect(result).toContain('id="send-menu"');
  expect(result.match(/\sid="send"/g)).toHaveLength(1);
});

test("処理中は主操作を置き換え、▾も同じ処理中の見た目で押せなくし、マークは残す", async () => {
  const result = await render(
    <SplitButton id="send" label="送る" busy busyLabel="送っています…" items={items()} />,
  );
  const main = buttonTag(result, /class="rx-button main"/);
  expect(main).toContain('aria-busy="true"');
  expect(main).toContain("disabled");
  expect(result).toContain("送っています…");
  const menu = buttonTag(result, /data-dropdown-menu-target="trigger"/);
  expect(menu).toMatch(/\sdisabled(?:\s|=|>)/);
  expect(menu).toContain('data-busy="true"');
  expect(result.match(/送っています…/g)).toHaveLength(1);
});

test("処理中でなければ▾は押せる", async () => {
  const result = await render(<SplitButton id="send" label="送る" items={items()} />);
  expect(buttonTag(result, /data-dropdown-menu-target="trigger"/)).not.toMatch(
    /\sdisabled(?:\s|=|>)/,
  );
});
