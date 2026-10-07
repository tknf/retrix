import { Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { expect, test } from "vite-plus/test";
import { Composer } from "../src/hono";

const render = async (content: Child) => {
  const app = new Hono().get("/", (c) => c.html(html`${content}`));
  return (await app.request("/")).text();
};

test("editorを渡してもerrorを編集コンポーネントの下に出し、包むまとまりに関連付ける", async () => {
  const result = await render(
    <Composer
      id="post"
      label="お知らせ"
      name="body"
      submitLabel="投稿する"
      error="本文を入力してください。"
      editor={<div contenteditable aria-label="お知らせ" />}
    />,
  );
  expect(result).toMatch(
    /<div class="editor" role="group" aria-labelledby="post-body-label" aria-describedby="post-body-error" data-invalid="true">/,
  );
  expect(result).toContain('<p class="error" id="post-body-error">');
  expect(result).toContain("本文を入力してください。");
});

test("editorを渡してerrorが無い時はエラーの欄と関連付けを出さない", async () => {
  const result = await render(
    <Composer id="post" label="お知らせ" name="body" submitLabel="投稿する" editor={<div />} />,
  );
  expect(result).not.toContain("post-body-error");
  expect(result).not.toContain("data-invalid");
});
