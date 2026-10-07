import { expect, test } from "vite-plus/test";
import { Hono } from "hono";
import { DropdownMenu, type MenuItem } from "../src/hono";

const render = async (items: readonly MenuItem[]) => {
  const app = new Hono().get("/", (c) =>
    c.html(<DropdownMenu id="menu" label="操作" items={items} />),
  );
  return (await app.request("/")).text();
};
const items = () =>
  [
    { label: "実行", value: "run" },
    { kind: "separator" },
    {
      kind: "group",
      label: "表示",
      items: [
        { kind: "checkbox", label: "通知", value: "notify", checked: "mixed" },
        { kind: "radio", label: "一覧", name: "view", value: "list", checked: true },
        { kind: "radio", label: "カード", name: "view", value: "cards" },
      ],
    },
    {
      kind: "submenu",
      label: "書き出す",
      items: [{ kind: "submenu", label: "画像", items: [{ label: "PNG", value: "png" }] }],
    },
  ] satisfies MenuItem[];

test("多段メニューの参照先は一意で各階層に名前が付く", async () => {
  const markup = await render(items());
  const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  expect(new Set(ids).size).toBe(ids.length);
  for (const [, reference] of markup.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g))
    expect(ids).toContain(reference);
  expect(markup.match(/role="menu"/g)).toHaveLength(3);
  expect(markup.match(/popover="manual"/g)).toHaveLength(4);
  expect(markup.match(/aria-expanded="false"/g)).toHaveLength(3);
  expect(markup).toContain('data-dropdown-menu-value="png"');
});

test("親子メニューに対して画面を覆う透明レイヤーを一つだけ持つ", async () => {
  const markup = await render(items());
  expect(markup.match(/class="shield"/g)).toHaveLength(1);
  expect(markup).toContain(
    'data-dropdown-menu-target="shield" popover="manual" tabindex="-1" hidden',
  );
  expect(markup.indexOf('class="shield"')).toBeLessThan(markup.indexOf('<menu id="menu"'));
});

test("複数選択と単一選択は対応するroleと初期状態を出力する", async () => {
  const markup = await render(items());
  expect(markup).toContain('role="menuitemcheckbox"');
  expect(markup).toContain('aria-checked="mixed"');
  expect(markup.match(/role="menuitemradio"/g)).toHaveLength(2);
  expect(markup).toContain('aria-checked="true"');
  expect(markup).toContain('aria-checked="false"');
  expect(markup).toContain('role="separator"');
  expect(markup).toContain('role="group"');
});

test("リンクはURLを保持し無効なリンクには遷移先を渡さない", async () => {
  const markup = await render([
    { kind: "link", label: "記事", href: "/search?a=1&b=2", target: "_blank" },
    { kind: "link", label: "無効", href: "/disabled-path", disabled: true },
  ]);
  expect(markup).toContain('href="/search?a=1&amp;b=2"');
  expect(markup).toContain('rel="noopener noreferrer"');
  expect(markup).not.toContain("/disabled-path");
  expect(markup).toContain('aria-disabled="true"');
});

test("空のメニューにもフォーカス先と説明が残る", async () => {
  const markup = await render([]);
  expect(markup).toContain("利用できる操作はありません");
  expect(markup).toContain('tabindex="-1"');
  expect(markup).not.toContain('role="menuitem"');
});

test("説明文はアイコンとラベルの行から分離する", async () => {
  const markup = await render([
    { label: "複製する", value: "copy", icon: "layers", description: "新しい下書きを作ります" },
  ]);
  expect(markup).toContain('class="content" data-leading="true"');
  expect(markup).toContain('class="heading"');
  expect(markup).toContain(
    '</span></span><small class="description">新しい下書きを作ります</small>',
  );
});
