import { expect, test } from "vite-plus/test";
import { Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { Dialog, Button, Input } from "../src/hono";

const render = async (content: Child) => {
  const app = new Hono().get("/", (c) => c.html(html`${content}`));
  return (await app.request("/")).text();
};

test("見出しを初期フォーカスにして本文と操作欄を分離する", async () => {
  const result = await render(
    <Dialog id="review" title="確認" trigger="開く" actions={<Button>保存する</Button>}>
      <p>本文</p>
    </Dialog>,
  );
  expect(result).toContain('tabindex="-1" autofocus');
  expect(result).toContain('<div class="body"><p>本文</p></div>');
  expect(result).toContain('<footer class="actions">');
  expect(result).toContain('aria-haspopup="dialog"');
  expect(result).toContain('closedby="any"');
  expect(result).not.toMatch(/<dialog[^>]*\sopen(?:\s|=|>)/);
});

test("操作を渡さない時は閉じる操作だけを見出しに置き、空の操作欄を出さない", async () => {
  const result = await render(
    <Dialog id="notice" title="お知らせ" trigger="開く">
      <p>本文</p>
    </Dialog>,
  );
  expect(result).toContain('data-dialog-target="close"');
  expect(result).not.toContain('<footer class="actions">');
});

test("フォームの送信先と明示したautofocusを保持する", async () => {
  const result = await render(
    <Dialog
      id="edit"
      title="編集"
      trigger="編集する"
      initialFocus="content"
      closeLabel="キャンセル"
      actions={
        <Button type="submit" form="edit-form">
          保存する
        </Button>
      }
    >
      <form id="edit-form" method="dialog">
        <Input name="title" required autofocus />
      </form>
    </Dialog>,
  );
  expect(result.match(/\sautofocus(?:\s|=|>)/g)).toHaveLength(1);
  expect(result).toContain('form="edit-form"');
  expect(result).toContain('method="dialog"');
  expect(result).toContain('data-dialog-target="close"');
  expect(result).toContain("キャンセル");
});

test("本文のない確認でも閉じる操作と見出しの関連を持つ", async () => {
  const result = await render(
    <Dialog id="empty" title="お知らせ" trigger="開く" size="compact" triggerDisabled />,
  );
  expect(result).toContain('data-size="compact"');
  expect(result).toContain('aria-labelledby="empty-title"');
  expect(result).not.toContain("aria-describedby");
  expect(result).toContain('data-dialog-target="close"');
  expect(result).toContain("disabled");
});
