import type { ComponentDoc } from "../reference";

export default {
  id: "hover-card",
  name: "HoverCard",
  description: "対象の概要と関連する操作を、近くに表示します。",
  api: ["HoverCard"],
  guidance: [
    "人・案件・資料へのリンクのように、移る前に中身の概要を確かめたい対象に使います。",
    "一言の補足で足りる時は `Tooltip`、押して開く補足や小さな入力は `Popover` を使います。",
    "ホバーしなくても分かるよう、欠かせない情報はプレビューだけに置かず、移動先にも置きます。",
  ],
  usage: [
    "`HoverCardController` を `hover-card` として登録します。`id` は画面内で一意にします。ホバーして300ms後、またはフォーカスした時にプレビューのパネルを開き、ポインターとフォーカスが離れて150ms後に閉じます。ポインターをパネルへ移す間は、斜めに横切っても開いたままです。",
    "`href` が無ければ `label` の操作を押しても開きます。`href` を渡すと、`label` を移動のリンクにし、隣に目のアイコンのプレビュー操作を置きます。リンクを押すと移動し、プレビュー操作を押すとパネルを開きます。プレビュー操作はcontrollerが働いた時だけ出します。",
    "パネルの見出し・説明・本文・操作欄の組み立ては `Popover`・`Dialog` と同じです。`title` を省略すると `label` を見出しにします。関連する操作がある時だけ `actions` を渡します。`size` はパネルの幅の上限で、`compact` は16rem、`default` は20rem、`wide` は28remです。",
    "Escapeと、見出しの横の閉じる操作で閉じます。閉じた後は、ポインターを離すかフォーカスを外すまで再び開きません。",
    "タッチ操作では触れても開きません。JavaScriptなしではパネルは開かず、リンクは通常のリンクとして動きます。パネルの中身の取得や操作の処理は利用側が行います。",
  ],
  keyboard: [
    [
      "Tab（リンク・操作へ）",
      "フォーカスするとパネルを開きます。パネルの中の操作へもTabで進めます。",
    ],
    ["Enter / Space（プレビュー操作）", "パネルを開きます。"],
    ["Escape", "パネルを閉じ、パネルの中にフォーカスがあれば開いた操作へ戻します。"],
  ],
  accessibility: [
    'パネルは `role="dialog"` で、見出しを名前（`aria-labelledby`）、`description` を説明（`aria-describedby`）にします。',
    "開く操作とプレビュー操作は `aria-controls` と `aria-expanded` を持ちます。プレビュー操作は「（label）のプレビューを開く」という名前で読み上げます。",
    "パネルの中に `autofocus` を置くと、controllerは働かず、コンソールに警告を出します。",
    "見出しの横の閉じる操作はアイコンだけなので、`closeLabel` を `aria-label` にします。",
  ],
  events: [
    [
      "hover-card:beforetoggle",
      "パネルを開く・閉じる直前。取り消せます。`detail` は `open`（次の状態）・`previousOpen`・`reason`（`pointer` または `keyboard`）です。",
    ],
    [
      "hover-card:toggle",
      "パネルを開いた・閉じた後。`detail` は `hover-card:beforetoggle` と同じです。",
    ],
  ],
  propNotes: {
    HoverCard: {
      children: "パネルの本文。対象の概要を置く。",
    },
  },
} satisfies ComponentDoc;
