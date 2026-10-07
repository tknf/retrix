import type { ComponentDoc } from "../reference";

export default {
  id: "text-editor",
  name: "TextEditor",
  description: "書式ツールを並べた入力エリアです。",
  api: ["TextEditor"],
  guidance: [
    "返信・日記・コメントなど、太字や箇条書きの付いた文の入力エリアを置く時に使います。",
    "書式の要らない本文は `Textarea`、本文と添付・送信ボタンをまとめた入力エリアは `Composer` を使います。`Composer` の `editor` にこのコンポーネントを入れることもできます。",
  ],
  usage: [
    '`id` と `label` を渡します。書式ツール（太字・斜体・取り消し線・リンク・見出し・引用・コード・箇条書き・番号付きの箇条書き・ファイルを添える・元に戻す・やり直す）を並べ、その下に入力エリアを置きます。`tools` で並べるツールを選び、`"|"` で区切りを入れます。',
    '`placement="bottom"` にするとツールバーを入力エリアの下に置きます。`actions` に渡した送信・下書きの保存などの操作は、ツールバーの末尾に置きます。',
    'このコンポーネントは見た目とツールバーだけを持ち、特定のエディターに依存しません。書式を付ける動きは利用側のエディターに任せます。`editor` に任意のリッチテキストのエディターが描く入力エリア（`contenteditable` の要素）を渡し、ツールのボタンの `data-text-editor-tool`（`bold`・`italic`・`link`・`bullets` など）を読んでエディターの操作を呼びます。現在適用中の書式のツールに `data-active="true"` を付けると、淡い青の背景で示します。',
    "`editor` を渡さなければ `textarea` を置きます。`name`・`placeholder`・`value`・`disabled` などの残りの属性は `textarea` に付き、`class` は外側の要素に付きます。`textarea` のままの時も、ツールを動かすのは利用側です（書式の記号を差し込むなど）。ツールを使わない時は `tools={[]}` にします。ツールも `actions` も無い時は、ツールバーを描きません。`disabled` はツールも押せなくします。",
    "ツールバーは `ToolbarController` を `toolbar` として登録して使います。書式を付ける動きのcontrollerは持ちません。送信する値は `textarea` の本文か、`editor` の側で用意した値です。JavaScriptが無い時は `textarea` に書いた文を送ります。",
  ],
  accessibility: [
    'ツールバーは `role="toolbar"` で、「`label`の書式」を名前にし、`aria-controls` で `id` の入力エリアを指します。`editor` を渡す時は、入力エリアの要素に同じ `id` と、`aria-label` などの名前を付けます。',
    "ツールのボタンは名前を持ち、ホバーすると同じ名前を表示します。",
    "ツールバーは一つのTab停止点で、Tabで入ると前にいたツール（初めは先頭の使えるツール）に止まり、矢印キーでツールの間を移ります。`actions` の操作はツールとは別のTab停止点です。",
    'ツールはJavaScriptで動くものなので、controllerが付くまでは全てのツールを `tabindex="-1"` にして、Tabで止めません。',
  ],
  keyboard: [
    ["Tab", "ツールバーへは一か所だけで入ります。"],
    ["←・→", "前後のツールへ移ります。端では反対の端へ回ります。右から左に読む時は逆です。"],
    ["Home・End", "最初・最後の使えるツールへ移ります。"],
    ["Enter・Space", "フォーカスのあるツールを押します。"],
  ],
} satisfies ComponentDoc;
