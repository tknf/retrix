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
    "`title` に何が無いのか・何が終わったのかを書き、childrenに説明、`actions` に次の操作（`ActionLink` など）を渡します。枠や面は付けず、中央に太字の題名と灰色の説明を書き、操作はその下に置きます。",
    "`kind` で場面を選びます。`empty` は0件（灰色）、`start` は初めて使う時（青緑）、`complete` は作業を終えた時（緑）で、アイコンを置く丸をその色で塗ります。",
    "`icon` は渡した時だけ、題名の上の場面の色で塗った小さな丸に白で置きます。`complete` は渡さなくても、緑の丸にペンで描くチェックを置きます。",
    "架空の件数や見本のデータを置きません。JavaScriptは使いません。",
  ],
  accessibility: [
    "`section` で、`title` を見出し（`h3`）にします。アイコンは読み上げから外します。",
    "動きを減らす設定では、チェックを描く動きを止めます。",
  ],
  propNotes: {
    EmptyState: { children: "題名の下に置く説明文。" },
  },
} satisfies ComponentDoc;
