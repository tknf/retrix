import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { Treegrid } from "../src/hono";

const render = async () =>
  String(
    await html`${(
      <Treegrid
        caption="資料"
        columns={[{ heading: "名前" }]}
        expanded={[]}
        selection="multiple"
        items={[
          {
            value: "folder",
            label: "フォルダ",
            children: [{ value: "child", label: "子の資料" }],
          },
        ]}
      />
    )}`,
  );

test("Treegridは閉じた行の子もJavaScriptなしで読めるよう、開閉の状態をサーバーで書かない", async () => {
  const markup = await render();
  const rows = markup.match(/<tr data-treegrid-target="row"[^>]*>/g) ?? [];
  expect(rows).toHaveLength(2);
  for (const row of rows) {
    expect(row).not.toContain("hidden");
    expect(row).not.toContain("aria-expanded");
    expect(row).not.toContain("data-state");
  }
  // 開いておく行は接続の後にcontrollerが使う。
  expect(markup).toContain('data-treegrid-expanded-value="[]"');
  expect(markup).toContain('data-treegrid-target="toggle"');
});
