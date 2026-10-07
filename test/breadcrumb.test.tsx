import { Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { expect, test } from "vite-plus/test";
import { Breadcrumb } from "../src/hono";

const render = async (content: Child) => {
  const app = new Hono().get("/", (c) => c.html(html`${content}`));
  return (await app.request("/")).text();
};

test("現在地だけをリンクにしない文字にしてaria-currentを付け、上位のリンクには付けない", async () => {
  const result = await render(
    <Breadcrumb
      items={[
        { label: "ホーム", href: "/" },
        { label: "記事", href: "/articles" },
        { label: "編集", href: "/articles/1/edit" },
      ]}
    />,
  );
  expect(result.match(/aria-current=/g)).toHaveLength(1);
  expect(result).toContain('<span aria-current="page">編集</span>');
  expect(result).toContain('<a href="/articles">記事</a>');
  expect(result).not.toContain('href="/articles/1/edit"');
});
