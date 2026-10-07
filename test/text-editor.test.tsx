import { Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { expect, test } from "vite-plus/test";
import { TextEditor } from "../src/hono";

const render = async (content: Child) => {
  const app = new Hono().get("/", (c) => c.html(html`${content}`));
  return (await app.request("/")).text();
};

const toolTags = (result: string) => result.match(/<button[^>]*data-text-editor-tool[^>]*>/g) ?? [];

test("ツールバーにtoolbarのcontrollerを付け、全ての書式ツールを矢印キーで移る対象にする", async () => {
  const result = await render(<TextEditor id="note" label="メモ" tools={["bold", "|", "link"]} />);
  expect(result).toMatch(/<div class="toolbar"[^>]*role="toolbar"[^>]*data-controller="toolbar"/);
  const tools = toolTags(result);
  expect(tools).toHaveLength(2);
  for (const tool of tools) expect(tool).toContain('data-toolbar-target="control"');
});

test("controllerが付くまでは書式ツールをTabで止めない", async () => {
  const result = await render(<TextEditor id="note" label="メモ" />);
  const tools = toolTags(result);
  expect(tools.length).toBeGreaterThan(0);
  for (const tool of tools) expect(tool).toContain('tabindex="-1"');
});

test("書式ツールも操作も無い時はツールバーを描かない", async () => {
  const result = await render(<TextEditor id="note" label="メモ" tools={[]} />);
  expect(result).not.toContain('role="toolbar"');
  expect(result).toContain("<textarea");
});
