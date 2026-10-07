import { Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { expect, test } from "vite-plus/test";
import { ActionTile, CommandMenu } from "../src/hono";

const render = async (content: Child) => {
  const app = new Hono().get("/", (c) => c.html(html`${content}`));
  return (await app.request("/")).text();
};

test("無効なリンクのタイルはaria-descriptionなどを保ち、リンクだけの属性とTabの停止点を外す", async () => {
  const result = await render(
    <ActionTile
      label="請求"
      icon="file"
      href="/billing"
      target="_blank"
      rel="noopener"
      tabindex={0}
      aria-description="管理者だけが開けます"
      data-kind="billing"
      disabled
    />,
  );
  const root = result.slice(0, result.indexOf(">") + 1);
  expect(root).toMatch(/^<span /);
  expect(root).toContain('role="link"');
  expect(root).toContain('aria-disabled="true"');
  expect(root).toContain('aria-description="管理者だけが開けます"');
  expect(root).toContain('data-kind="billing"');
  expect(root).not.toContain("href=");
  expect(root).not.toContain("target=");
  expect(root).not.toContain("rel=");
  expect(root).not.toContain("tabindex");
});

test("CommandMenuの無効なリンクでもdescriptionを読み上げに残す", async () => {
  const result = await render(
    <CommandMenu
      id="commands"
      label="Retrix"
      shortcuts={[
        { label: "請求", href: "/billing", description: "管理者だけが開けます", disabled: true },
      ]}
      groups={[]}
    />,
  );
  expect(result).toMatch(/<span[^>]*aria-description="管理者だけが開けます"[^>]*role="link"/);
});
