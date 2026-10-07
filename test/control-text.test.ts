import { readFile } from "node:fs/promises";
import postcss from "postcss";
import { expect, test } from "vite-plus/test";
import { controlMarkupErrors, controlTextErrors } from "../scripts/control-text.mjs";

const menuCss = () => readFile("src/css/components/dropdown-menu.css", "utf8");
const badgeCss = () => readFile("src/css/components/badge.css", "utf8");
const check = (css: string, path = "src/css/components/dropdown-menu.css") =>
  controlTextErrors(postcss.parse(css), path);
const addMenuRule = async (declarations: string, selector = ".rx-menu > li > .item.rx-button") =>
  `${await menuCss()}\n@layer components { ${selector} { ${declarations} } }`;

test("ButtonGroupは配置を所有するが内部Buttonの文字上書きは引き続き拒否する", () => {
  const path = "src/css/components/button-group.css";
  expect(check(".rx-button-group { align-items: stretch; }", path)).toEqual([]);
  expect(check(".rx-button-group > .rx-button { align-items: stretch; }", path)).not.toEqual([]);
  expect(check(".rx-button-group > .rx-button > span { translate: 0 1px; }", path)).not.toEqual([]);
});

test("Badgeのアイコンをベースラインへ下げる変更と操作用フォントの削除を拒否する", async () => {
  const css = await badgeCss();
  expect(check(css, "src/css/components/badge.css")).toEqual([]);
  expect(
    check(
      css.replace("align-items: start", "align-items: baseline"),
      "src/css/components/badge.css",
    ),
  ).not.toEqual([]);
  expect(
    check(
      css.replace("font-family: var(--rx-control-font-family);", ""),
      "src/css/components/badge.css",
    ),
  ).not.toEqual([]);
});

test("メニューのCSSは共通Buttonの文字と縦配置を上書きしない", async () => {
  expect(check(await menuCss())).toEqual([]);
});

for (const declaration of [
  "font: inherit;",
  "font-family: var(--rx-font);",
  "font-weight: 600;",
  "line-height: 1.5;",
  "padding-block: 0.5rem;",
  "padding-block-start: 2px;",
  "align-items: start;",
  "transform: translateY(2px);",
  "translate: 0 2px;",
  "margin-block-start: -2px;",
  "text-box-trim: trim-both;",
]) {
  test(`既知の崩れ方を再導入すると拒否する: ${declaration}`, async () => {
    expect(check(await addMenuRule(declaration))).not.toEqual([]);
  });
}

test("新しいCSSファイルからの上書きも検出する", async () => {
  expect(
    check(await addMenuRule("font: inherit;"), "src/css/components/new-control.css"),
  ).not.toEqual([]);
});

test("状態別・メディア条件内の上書きも検出する", async () => {
  const css = `${await menuCss()} @layer components { @media (min-width: 500px) {
    .rx-menu > li > .item { &:hover { font-weight: 600; } }
  } }`;
  expect(check(css)).not.toEqual([]);
});

test("文字を包む子要素だけをずらす変更も検出する", async () => {
  expect(
    check(
      await addMenuRule(
        "transform: translateY(-2px);",
        ".rx-menu > li > .rx-menu > li > .item > .rx-menu > li > .rx-menu > li > .item > .content > .rx-menu > li > .rx-menu > li > .item > .rx-menu > li > .rx-menu > li > .item > .content > .heading > .text > span",
      ),
    ),
  ).not.toEqual([]);
});

test("説明文を分けたラベル行でも文字の移動や行高変更を拒否する", async () => {
  for (const selector of [
    ".rx-menu > li > .rx-menu > li > .item > .rx-menu > li > .rx-menu > li > .item > .content > .heading",
    ".rx-menu > li > .rx-menu > li > .item > .content",
    ".rx-menu > li > .rx-menu > li > .item > .content > .description",
  ]) {
    expect(check(await addMenuRule("transform: translateY(2px);", selector))).not.toEqual([]);
    expect(check(await addMenuRule("line-height: 2;", selector))).not.toEqual([]);
  }
});

test("メニューは上揃えを保ち中央配置を拒否する", async () => {
  expect(
    check(
      await addMenuRule(
        "align-items: center;",
        ".rx-menu > li > .rx-menu > li > .item > .rx-menu > li > .rx-menu > li > .item > .content > .heading",
      ),
    ),
  ).not.toEqual([]);
  expect(check(await addMenuRule("display: flex;"))).not.toEqual([]);
  expect(check(await addMenuRule("padding-block: 4px 8px;"))).not.toEqual([]);
  expect(check(await menuCss())).toEqual([]);
});

test("独自buttonへフォントだけを指定しても上下余白の上書きを見逃さない", () => {
  expect(
    check(`@layer components { .rx-dropdown-menu { & > .rx-menu {
    font-family: var(--rx-control-font-family);
    & > li > button { font-family: var(--rx-control-font-family); padding-block: 0.5rem; }
  } } }`),
  ).not.toEqual([]);
});

test("基準のButton自体から中央揃えを削除した場合も検出する", async () => {
  const css = await readFile("src/css/components/button.css", "utf8");
  expect(check(css, "src/css/components/button.css")).toEqual([]);
  expect(
    check(css.replace("align-items: center;", ""), "src/css/components/button.css"),
  ).not.toEqual([]);
});

test("操作用フォントのトークンを本文用に替える変更を検出する", async () => {
  const css = await readFile("src/css/tokens.css", "utf8");
  expect(check(css, "src/css/tokens.css")).toEqual([]);
  expect(
    check(
      css.replace('"Helvetica Neue", Arial, var(--rx-font)', "var(--rx-font)"),
      "src/css/tokens.css",
    ),
  ).not.toEqual([]);
});

test("フォント名を保っても行メトリクスの補正を外したら検出する", async () => {
  const css = await readFile("src/css/tokens.css", "utf8");
  for (const declaration of [
    "ascent-override: 89%;",
    "descent-override: 11%;",
    "line-gap-override: 0%;",
  ]) {
    expect(check(css.replaceAll(declaration, ""), "src/css/tokens.css")).not.toEqual([]);
  }
  const root = postcss.parse(css);
  root.walkAtRules("font-face", (rule) => {
    rule.remove();
  });
  expect(check(root.toString(), "src/css/tokens.css")).not.toEqual([]);
});

test("正しい共通宣言の後に同じファイルで上書きしても検出する", async () => {
  const css = await readFile("src/css/components/button.css", "utf8");
  expect(
    check(
      `${css} @layer components { .rx-button { font-family: var(--rx-font); } }`,
      "src/css/components/button.css",
    ),
  ).not.toEqual([]);
});

test("色の変更や説明文の文字サイズまで禁止しない", async () => {
  expect(check(await addMenuRule("color: var(--rx-danger);"))).toEqual([]);
  expect(
    check(
      `@layer components { .rx-menu > li > .rx-menu > li > .item > .rx-menu > li > .rx-menu > li > .item > .content > .rx-menu > li > .rx-menu > li > .item > .rx-menu > li > .rx-menu > li > .item > .content > .heading > .text { & > small { font-size: var(--rx-small); } } }`,
    ),
  ).toEqual([]);
});

test("共通コンポーネントを迂回したボタンを新規ファイルでも検出する", () => {
  const source = 'export const Example = () => <button type="button">確認する</button>;';
  expect(controlMarkupErrors(source, "src/hono/new-menu.tsx")).not.toEqual([]);
  expect(
    controlMarkupErrors(
      "export const Example = () => <Button>確認する</Button>;",
      "src/hono/new-menu.tsx",
    ),
  ).toEqual([]);
});

test("ActionTileの専用buttonは許し、同じbuttonを別のファイルに書くと検出する", () => {
  const tile =
    '<button type="button" class="rx-action-tile"><span class="name">公開する</span></button>';
  expect(controlMarkupErrors(tile, "src/hono/action-tile.tsx")).toEqual([]);
  expect(controlMarkupErrors(tile, "src/hono/table.tsx")).not.toEqual([]);
  // 追加のclassを受けるclasses()の呼び出しでも、固定の文字列の引数で所有元を判断する。
  const extended =
    '<button type="button" class={classes("rx-action-tile", className)}>公開する</button>';
  expect(controlMarkupErrors(extended, "src/hono/action-tile.tsx")).toEqual([]);
  expect(controlMarkupErrors(extended, "src/hono/table.tsx")).not.toEqual([]);
  expect(
    controlMarkupErrors(
      '<button type="button" class={classes(className)}>公開する</button>',
      "src/hono/action-tile.tsx",
    ),
  ).not.toEqual([]);
  expect(
    controlMarkupErrors(
      '<button type="button" class="tile">公開する</button>',
      "src/hono/action-tile.tsx",
    ),
  ).not.toEqual([]);
});

test("Promptの選択肢のカードは専用buttonとして許し、別のファイルや別のclassでは検出する", () => {
  const choice =
    '<button type="submit" class="choice" name="kind" value="person"><strong>人</strong></button>';
  expect(controlMarkupErrors(choice, "src/hono/prompt.tsx")).toEqual([]);
  expect(controlMarkupErrors(choice, "src/hono/card.tsx")).not.toEqual([]);
  expect(
    controlMarkupErrors('<button type="submit" class="option">人</button>', "src/hono/prompt.tsx"),
  ).not.toEqual([]);
});

test("EmojiPickerのセルとReactionsのリアクションは専用buttonとして許し、別のファイルや別のclassでは検出する", () => {
  const emoji = '<button type="button" class="emoji" aria-label="いいね">👍</button>';
  expect(controlMarkupErrors(emoji, "src/hono/emoji-picker.tsx")).toEqual([]);
  expect(controlMarkupErrors(emoji, "src/hono/reactions.tsx")).not.toEqual([]);
  const reaction =
    '<button type="button" class="reaction" aria-pressed="true"><span class="content">👍</span></button>';
  expect(controlMarkupErrors(reaction, "src/hono/reactions.tsx")).toEqual([]);
  expect(controlMarkupErrors(reaction, "src/hono/emoji-picker.tsx")).not.toEqual([]);
  expect(
    controlMarkupErrors('<button type="button" class="chip">👍</button>', "src/hono/reactions.tsx"),
  ).not.toEqual([]);
});

test("Calendarの予定のボタンは専用buttonとして許し、別のファイルや別のclassでは検出する", () => {
  const event = '<button type="button" class="event" popovertarget="e1">編集会議</button>';
  expect(controlMarkupErrors(event, "src/hono/calendar.tsx")).toEqual([]);
  expect(controlMarkupErrors(event, "src/hono/grid.tsx")).not.toEqual([]);
  expect(
    controlMarkupErrors('<button type="button" class="day">15</button>', "src/hono/calendar.tsx"),
  ).not.toEqual([]);
});
