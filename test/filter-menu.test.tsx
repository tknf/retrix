import { Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { expect, test } from "vite-plus/test";
import { FilterMenu, type FilterMenuProps } from "../src/hono";

const render = async (content: Child) => {
  const app = new Hono().get("/", (c) => c.html(html`${content}`));
  return (await app.request("/")).text();
};

const props = (overrides: Partial<FilterMenuProps> = {}): FilterMenuProps => ({
  id: "labels",
  label: "ラベル",
  title: "ラベルを選ぶ",
  options: [{ value: "bug", label: "不具合" }],
  ...overrides,
});

const trigger = (result: string) => {
  const match = result.match(/<button[^>]*popovertarget="labels-panel"[^>]*>([\s\S]*?)<\/button>/);
  if (!match) throw new Error("開く操作が見つからない");
  return { tag: match[0].slice(0, match[0].indexOf(">") + 1), content: match[1] ?? "" };
};

test("アイコンだけの開く操作にiconが無ければ▾のマークを出す", async () => {
  const result = trigger(await render(<FilterMenu {...props({ iconOnly: true })} />));
  expect(result.tag).toContain('aria-label="ラベル"');
  expect(result.content).toContain("#rx-caret");
  expect(result.content).not.toContain("ラベル");
});

test("アイコンだけの開く操作にiconがあれば▾を追加しない", async () => {
  const result = trigger(
    await render(<FilterMenu {...props({ iconOnly: true, icon: "check" })} />),
  );
  expect(result.content).toContain("#rx-check");
  expect(result.content).not.toContain("#rx-caret");
});

test("開く操作の開閉状態はcontrollerが伝え、初期HTMLには固定のaria-expandedを書かない", async () => {
  const result = trigger(await render(<FilterMenu {...props()} />));
  expect(result.tag).toContain('data-filter-menu-target="trigger"');
  expect(result.tag).not.toContain("aria-expanded");
});
