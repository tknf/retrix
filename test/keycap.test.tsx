import { Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { expect, test } from "vite-plus/test";
import { Keycap } from "../src/hono";

const render = async (content: Child) => {
  const app = new Hono().get("/", (c) => c.html(html`${content}`));
  return (await app.request("/")).text();
};

test("labelを渡すとキーの表記を読み上げから外し、見えない文で名前を伝える", async () => {
  const result = await render(<Keycap keys={["⌘", "S"]} label="CommandとS" />);
  expect(result).not.toContain("aria-label");
  expect(result).toContain('<kbd aria-hidden="true">⌘</kbd><kbd aria-hidden="true">S</kbd>');
  expect(result).toContain('<span class="rx-visually-hidden">CommandとS</span>');
});

test("aria-labelを渡してもspanには付けず、labelと同じ扱いにする", async () => {
  const result = await render(<Keycap keys={["⌘", "S"]} aria-label="CommandとS" />);
  expect(result).not.toContain("aria-label");
  expect(result).toContain('<span class="rx-visually-hidden">CommandとS</span>');
});

test("名前が無ければキーの表記をそのまま読む", async () => {
  const result = await render(<Keycap keys={["Ctrl", "S"]} />);
  expect(result).not.toContain("aria-hidden");
  expect(result).not.toContain("rx-visually-hidden");
});
