import type { ComponentDoc } from "../reference";

export default {
  id: "toolbar",
  name: "Toolbar",
  description: "対象に対する複数の操作をまとめます。",
  api: ["Toolbar"],
  guidance: [
    "一つの対象やフォームに対する複数の操作（送信・リセット・移動）を、一続きの並びにまとめる時に使います。",
    '現在の絞り込み条件を示す並びは `FilterBar`（`nav`）を使います。`Toolbar` は実行する操作の並び（`role="toolbar"`）です。どちらの操作も、共通の角の小さな `Button` の形です。',
    "関連する二つ三つの操作を一つにつなげて見せる時は `ButtonGroup`、画面の下に浮かべる操作バーは `ActionDock` を使います。",
  ],
  usage: [
    '`ToolbarController` を `toolbar` として登録します。`Button`・`ActionLink` などの操作に `data-toolbar-target="control"` を付けると、全体が一つのTab停止点になり、矢印キーで操作を移れます。`data-controller` を渡すと、`toolbar` に続けて追加します。',
    '縦に並べる時は `data-toolbar-orientation-value="vertical"` を渡します。上下の矢印で移り、`aria-orientation="vertical"` を付けます。',
    "フォームの送信・リセットは `Button` の `type` で指定します。押した後の処理は各操作とフォームが行います。",
    '操作は0.25remの間隔で並び、狭い配置では折り返します。子に `class="start"` を付けると伸びる欄（14remから24remまで）、`class="end"` を付けると行末へ寄せたまとまりになります。',
    '`data-toolbar-target="control"` の付いた操作が一つも無い時は、controllerは働かず、コンソールに警告を出します。JavaScriptなしでは、各操作が通常のTab停止点のまま動きます。',
  ],
  keyboard: [
    [
      "Tab",
      "並びに入る時は一つの操作（最後に使った操作、無ければ最初の有効な操作）へ移り、もう一度押すと並びの外へ出ます。",
    ],
    ["→ / ←", "次・前の有効な操作へ移ります。右から左では反転し、端では反対の端へ戻ります。"],
    ["↓ / ↑", "縦の並びの時に、次・前の有効な操作へ移ります。"],
    ["Home / End", "最初・最後の有効な操作へ移ります。"],
  ],
  accessibility: [
    'ルートは `role="toolbar"` で、`label` を名前として読み上げます。並びの説明は、画面の文を `aria-describedby` で結び付けます。',
    '`disabled` または `aria-disabled="true"` の操作は、矢印の移動で飛ばします。',
  ],
  propNotes: {
    Toolbar: {
      children: '並べる操作。矢印キーで渡る操作には `data-toolbar-target="control"` を付ける。',
    },
  },
} satisfies ComponentDoc;
