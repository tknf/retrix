import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { EditableProperty } from "../src/hono/editable-property";

const render = async (multiline: boolean) =>
  String(
    await html`${(
      <EditableProperty
        id="memo"
        label="メモ"
        name="memo"
        value={"1行目\n2行目 <b>"}
        multiline={multiline}
      />
    )}`,
  );

test("複数行は初期値をtextareaの中身に文字として書く", async () => {
  const markup = await render(true);
  const textarea = markup.match(/<textarea([^>]*)>([^]*?)<\/textarea>/);
  expect(textarea?.[1]).not.toContain("value=");
  expect(textarea?.[2]).toBe("1行目\n2行目 &lt;b&gt;");
  expect(markup).toContain('data-multiline="true"');
});

test("一行・複数行とも確定はControl / Meta+Enterにそろえ、確定ボタンに伝える", async () => {
  for (const multiline of [false, true]) {
    const markup = await render(multiline);
    expect(markup).toContain('data-editable-commit-key-value="modifier-enter"');
    expect(markup).toContain('aria-keyshortcuts="Control+Enter Meta+Enter"');
  }
  expect(await render(false)).toMatch(/<input[^>]*value="1行目\n2行目 &lt;b&gt;"/);
});
