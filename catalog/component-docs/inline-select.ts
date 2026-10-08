import type { ComponentDoc } from "../reference";

export default {
  id: "inline-select",
  name: "InlineSelect",
  description: "文中の語をクリックして、選択肢から選びます。",
  api: ["InlineSelect"],
  guidance: [
    "「30分前に知らせる」「全員が送ったファイル」のように、設定や条件を一つの文として読ませ、その中の語だけを選べるようにする時に使います。",
    "ラベルの付いた欄として並べる時は `Select`、選んだ条件でページを移る時は `FilterBar` を使います。",
  ],
  usage: [
    "`label` と `options`（`value`・`label`）を渡し、文の中に置きます。`value` に初めに選んでおく選択肢の値を渡し、渡さなければ先頭を選びます。選択肢の `label` は前後の文とつないで読める形で書きます。",
    "実体は標準の `select` です。前後の文と同じ大きさ・行高のまま、選べる語を、Basecamp 2の検索の条件の文と同じく枠の無い淡い青（`#e1e8f8`）の面に青緑（`#1c5c77`）の太字で置き、終わりに小さな▾を添えます。角はピルにせず角丸2pxです。ホバーすると文字と▾をリンクと同じ赤にし、フォーカスすると青い縁の外に淡い青の輪を広げます。開いた一覧の選択肢は本文の黒い文字です。`disabled` では形と面をそのままにし、文字と▾だけを灰色にします。幅は選んだ語に合わせ、収まらない時は語を省略します。",
    "`class` は外側の `span` に付き、`name`・`disabled`・`form` などの残りの属性は `select` に付きます。`name` を渡すとフォームで選んだ `value` を送ります。",
    "controllerは持ちません。選び直しは標準の `change` で受け取ります。JavaScriptが無い時も同じく動きます。",
  ],
  accessibility: [
    "文の中では前後の文が見出しの役を持たないので、`label` を `select` の `aria-label` にします。何を選ぶかを短く書きます（「知らせる時」など）。",
    "キーボードの操作と選択肢の一覧は、ブラウザの標準の `select` のままです。",
  ],
} satisfies ComponentDoc;
