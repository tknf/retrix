import { Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { expect, test } from "vite-plus/test";
import { ColorPicker } from "../src/hono";

const render = async (content: Child) => {
  const app = new Hono().get("/", (c) => c.html(html`${content}`));
  return (await app.request("/")).text();
};

test("色相環を持たないので、効かない色相の幅を上流へ渡さない", async () => {
  const result = await render(<ColorPicker label="色" name="color" step={5} hueStep={15} />);
  expect(result).toContain('data-color-picker-step-value="5"');
  expect(result).not.toContain("data-color-picker-hue-step-value");
});
