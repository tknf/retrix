import type { ComponentDoc } from "../reference";

export default {
  id: "empty-state",
  name: "EmptyState",
  description: "表示する情報がない理由と、次の操作を示します。",
  api: ["EmptyState"],
  guidance: [
    "一覧や検索の結果が0件の時、初めて使う時、確認などの作業を全て終えた時に、その理由と次の操作を示す時に使います。",
    "読み込みに失敗した・検索できなかったなどのエラーは、0件と区別して `Notice` で示します。",
    "まだ読み込んでいる時は `Loading` を使います。",
  ],
  usage: [
    "`title` に何が無いのか・何が終わったのかを書き、childrenに説明、`actions` に次の操作（`ActionLink` など）を渡します。題名と説明は破線の枠に書き、操作は枠の下に置きます。",
    "`kind` で場面を選びます。`empty` は0件（灰）、`start` は初めて使う時（青）、`complete` は作業を終えた時（緑）で、枠をその色にします。",
    "`icon` は渡した時だけ題名の上に置きます。`complete` は渡さなくても、ペンで描くチェックを置きます。",
    "架空の件数や見本のデータを置きません。JavaScriptは使いません。",
  ],
  accessibility: [
    "`section` で、`title` を見出し（`h3`）にします。アイコンは読み上げから外します。",
    "動きを減らす設定では、チェックを描く動きを止めます。",
  ],
  propNotes: {
    EmptyState: { children: "枠の中の説明文。" },
  },
} satisfies ComponentDoc;
