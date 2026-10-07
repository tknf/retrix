import type { ComponentDoc } from "../reference";

export default {
  id: "loading",
  name: "Loading",
  description: "読み込み中の処理を、文言とインジケーターで示します。",
  api: ["Loading"],
  guidance: [
    "次の記事やコメントの取得など、短い待ちを何を待っているかの言葉と一緒に示す時に使います。",
    "送信などボタンを押した後の待ちは、そのボタンの `busy` を使います。",
    "作業量が分かる処理や、終わりの分からない長い処理は `Progress` を使います。架空の進み具合を付けません。",
    "読み込んだ結果が0件だった時は `EmptyState` を使います。",
  ],
  usage: [
    "`label` に待っている処理を書きます。文とインジケーターは灰色です。インジケーターは `variant` で選び、`wave`（既定）は三つの灰色の点を先頭側から順に濃くします。点は動かさず、濃くなっていない点も消さずに淡く残します。`orbit` は淡い輪の一部だけを濃くして回す丸、`halo` は中心から広がって消える灰色の輪です。",
    '`layout="inline"` は文の流れに置く小さなインジケーターです。領域全体で待つ時は `layout="region"` にすると、面を敷かずに大きめのインジケーターと文を中央に縦に並べます。',
    "読み込みを終えたら、Loadingを結果に置き換えます。JavaScriptは使いません。",
  ],
  accessibility: [
    '`role="status"` を持つので、`label` の文を読み上げます。インジケーターは読み上げから外します。',
    "動きを減らす設定では、インジケーターの動きを止めます。",
  ],
} satisfies ComponentDoc;
