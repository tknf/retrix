import ts from "typescript";

// 字形の見た目の保証ではなく、既知の実装上の退行を提出前に止める。
const buttonFile = "src/css/components/button.css";
const requiredButton = new Map([
  ["font-family", "var(--rx-control-font-family)"],
  ["font-size", "var(--rx-button-font)"],
  ["font-weight", "400"],
  ["line-height", "calc(10 / 7)"],
  ["min-block-size", "var(--rx-button-size)"],
  ["padding-block", "0"],
  ["align-items", "center"],
]);
const protectedProperties = new Set([
  "font",
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "block-size",
  "height",
  "min-block-size",
  "padding",
  "padding-block",
  "padding-block-start",
  "padding-block-end",
  "padding-top",
  "padding-bottom",
  "align-items",
  "place-items",
  "vertical-align",
  "translate",
  "transform",
  "position",
  "inset-block-start",
  "inset-block-end",
  "top",
  "bottom",
  "margin-block-start",
  "margin-block-end",
  "margin-top",
  "margin-bottom",
]);

const context = (rule) => {
  const selectors = [];
  let node = rule;
  while (node) {
    if (node.type === "rule") selectors.unshift(node.selector);
    node = node.parent;
  }
  return selectors.join(" ").replaceAll(/\s+/g, " ").trim();
};

// カレンダーとメニューの行構造を、宣言単位で区別する。
// ファイル全体を除外しない。メニュー項目への再導入は許可しない。
const reviewedOverrides = new Map([
  // 上から積み、一行時の中央は対称な上下余白で作る。
  [
    "src/css/components/dropdown-menu.css|.rx-menu > li > .item.rx-button",
    new Map([["padding-block", "calc((var(--rx-menu-row-size) - 10em / 7 - 0.125rem) / 2)"]]),
  ],
  [
    "src/css/components/dropdown-menu.css|.rx-menu > li > .item > .content > .heading",
    new Map([["align-items", "start"]]),
  ],
  [
    "src/css/components/dropdown-menu.css|.rx-menu > li > .item > .content > .description",
    new Map([
      ["font-size", "var(--rx-small)"],
      ["line-height", "var(--rx-control-leading)"],
    ]),
  ],
]);

/** PostCSSの構文木を調べる。カスケードやブラウザの描画を模擬しない。 */
export const controlTextErrors = (root, path) => {
  const errors = [];
  const report = (rule, message) =>
    errors.push(`${path}:${rule.source?.start?.line ?? 1}: 文字位置: ${message}`);
  if (path === "src/css/tokens.css") {
    const families = [];
    root.walkDecls("--rx-control-font-family", (declaration) => families.push(declaration.value));
    if (
      families.length !== 1 ||
      families[0] !==
        '"Retrix UI Latin", "Retrix UI Japanese", "Helvetica Neue", Arial, var(--rx-font)'
    )
      report(root, "操作用フォントの基準が変わっている。本文フォントへ戻さない");
    const faces = [];
    root.walkAtRules("font-face", (rule) => {
      const values = new Map(
        rule.nodes.filter((node) => node.type === "decl").map((node) => [node.prop, node.value]),
      );
      if (!['"Retrix UI Latin"', '"Retrix UI Japanese"'].includes(values.get("font-family")))
        return;
      faces.push(`${values.get("font-family")}|${values.get("font-weight")}`);
      for (const [prop, value] of [
        ["ascent-override", "89%"],
        ["descent-override", "11%"],
        ["line-gap-override", "0%"],
      ]) {
        if (values.get(prop) !== value) report(rule, `共通フォントの${prop}は${value}を維持する`);
      }
    });
    for (const family of ['"Retrix UI Latin"', '"Retrix UI Japanese"']) {
      for (const weight of ["400", "600 900"]) {
        if (!faces.includes(`${family}|${weight}`))
          report(root, `${family}の${weight}の行メトリクスがない`);
      }
    }
  }
  if (path === buttonFile) {
    const owner = root.nodes
      .flatMap((node) => node.nodes ?? [])
      .find((node) => node.type === "rule" && node.selectors.includes(".rx-button"));
    for (const [prop, value] of requiredButton) {
      const declarations =
        owner?.nodes.filter((node) => node.type === "decl" && node.prop === prop) ?? [];
      if (declarations.at(-1)?.value !== value)
        report(owner ?? root, `.rx-buttonの${prop}は${value}を維持する`);
    }
  }
  if (path === "src/css/components/badge.css") {
    root.walkRules(".rx-badge", (rule) => {
      const declarations = rule.nodes.filter((node) => node.type === "decl");
      if (
        !declarations.some(
          (node) => node.prop === "font-family" && node.value === "var(--rx-control-font-family)",
        )
      )
        report(rule, "Badgeの文字は共通の操作用フォントを使う");
      if (!declarations.some((node) => node.prop === "align-items" && node.value === "start"))
        report(rule, "Badgeのアイコンは先頭行に揃え、文字のベースラインへ下げない");
    });
  }
  root.walkRules((rule) => {
    const selector = context(rule);
    // アイコンの回転は文字の上下補正に含めない。
    const iconOnly = /\.(?:rx-icon|caret|mark|dot|mixed)(?::[\w()-]+)?(?:\s*,|$)/.test(
      rule.selector,
    );
    const button = /\.rx-button(?![\w-])/.test(selector) && !iconOnly;
    const menuText =
      /\.rx-menu\b/.test(selector) &&
      /(?:\.(?:item|text|content|heading|description)\b|\bbutton\b)/.test(selector) &&
      !iconOnly;
    for (const declaration of rule.nodes.filter((node) => node.type === "decl")) {
      const { prop, value } = declaration;
      if (
        rule.selectors.some((entry) => /\.rx-menu\b.*> \.item(?:\.rx-button)?$/.test(entry)) &&
        prop === "display" &&
        value !== "block"
      )
        report(rule, "メニュー項目はblockで上から積み、上下対称の余白を使う");
      if (prop.startsWith("text-box")) report(rule, "text-boxによる文字位置の個別補正を追加しない");
      if (!button && !menuText) continue;
      if (!protectedProperties.has(prop)) continue;
      if (path === "src/css/base.css") continue; // componentsより前の共通初期値。
      if (path === buttonFile) {
        if (requiredButton.get(prop) === value) continue;
        const large = selector.includes('[data-size="large"]');
        if (
          large &&
          ((prop === "font-size" && value === "calc(var(--rx-button-font) * 8 / 7)") ||
            (prop === "line-height" && value === "var(--rx-control-leading)") ||
            (prop === "min-block-size" && value === "var(--rx-button-large)"))
        )
          continue;
      }
      // 説明文はラベルとは別の文字サイズ・行高を持つ。
      if (
        menuText &&
        rule.selector === "& > small" &&
        ((prop === "font-size" && value === "var(--rx-small)") ||
          (prop === "line-height" && value === "var(--rx-control-leading)"))
      )
        continue;
      const coarse =
        rule.parent?.type === "atrule" &&
        rule.parent.name === "media" &&
        rule.parent.params === "(pointer: coarse)";
      if (coarse && prop === "min-block-size" && value === "2.75rem") continue;
      if (reviewedOverrides.get(`${path}|${selector}`)?.get(prop) === value) continue;
      report(rule, `${selector}の${prop}: ${value}は共通Buttonの文字・縦配置を上書きする`);
    }
  });
  return errors;
};

/** 新しい生のbuttonが共通の文字指定を迂回することを検出する。 */
export const controlMarkupErrors = (source, path) => {
  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const errors = [];
  const visit = (node) => {
    if (
      (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
      node.tagName.getText(file) === "button"
    ) {
      const attributes = node.attributes.properties;
      const attribute = (name) =>
        attributes.find((entry) => ts.isJsxAttribute(entry) && entry.name.getText(file) === name);
      const classValue = attribute("class")?.initializer;
      // class="…"の文字列と、class={classes("…", 追加のclass)}の文字列の引数を読む。
      const call =
        classValue &&
        ts.isJsxExpression(classValue) &&
        classValue.expression &&
        ts.isCallExpression(classValue.expression) &&
        classValue.expression.expression.getText(file) === "classes"
          ? classValue.expression
          : undefined;
      const classes =
        classValue && ts.isStringLiteral(classValue)
          ? classValue.text.split(/\s+/)
          : (call?.arguments ?? [])
              .filter((argument) => ts.isStringLiteral(argument))
              .flatMap((argument) => argument.text.split(/\s+/));
      const role = attribute("role")?.initializer;
      const tab =
        path === "src/hono/tabs.tsx" && role && ts.isStringLiteral(role) && role.text === "tab";
      // ActionTileはアイコンと名前を縦に積む専用の操作で、文字の指定はaction-tile.cssが持つ。
      const tile = path === "src/hono/action-tile.tsx" && classes.includes("rx-action-tile");
      // Promptの選択肢は要点と説明の複数行の文を持つ大きなカードで、文字の指定はprompt.cssが持つ。
      const promptChoice = path === "src/hono/prompt.tsx" && classes.includes("choice");
      // Calendarの詳細を持つ予定のボタンは、リンクの予定と同じ見た目の小さな操作で、文字の指定はcalendar.cssが持つ。
      const calendarEvent = path === "src/hono/calendar.tsx" && classes.includes("event");
      // EmojiPickerのセルは絵文字一字だけを大きく置く専用の操作で、文字の指定はemoji-picker.cssが持つ。
      const emoji = path === "src/hono/emoji-picker.tsx" && classes.includes("emoji");
      // Reactionsの各リアクションは絵文字と数を並べた小さな切り替えで、文字の指定はreactions.cssが持つ。
      const reaction = path === "src/hono/reactions.tsx" && classes.includes("reaction");
      if (
        path !== "src/hono/button.tsx" &&
        !tab &&
        !tile &&
        !promptChoice &&
        !emoji &&
        !calendarEvent &&
        !reaction &&
        !classes.includes("rx-button") &&
        !(
          classes.includes("toggle") &&
          ["password-field", "combobox", "suggestion", "date-picker"].some(
            (name) => path === `src/hono/${name}.tsx`,
          )
        )
      ) {
        const line = file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
        errors.push(
          `${path}:${line}: 文字位置: 独自buttonを追加せずButtonを使う。専用操作は文字指定の所有元も検査へ登録する`,
        );
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(file);
  return errors;
};
