import type { ComponentDoc } from "../reference";

export default {
  id: "tag",
  name: "Tag",
  description: "分類や選択した条件を短く示します。",
  api: ["Tag", "TagGroup"],
  guidance: [
    "記事の分類や、選んだ絞り込みの条件を短く示す時に使います。",
    "公開中・確認待ちなどの状態は、濃い塗りの `Badge` で示します。Tagは枠の付いた角の小さな四角で、分類を示します。",
    "利用者が自由に書いてタグを追加する入力欄は `TagInput` を使います。",
  ],
  usage: [
    '`label` を渡します。Highriseのタグと同じく、面を塗らない小さな四角に1pxの淡い灰色（#dddddd）の枠と角丸2pxを付け、文字は11pxの灰色（#666666）の通常の太さです。一行の高さは約19pxです。`accent` は `blue`・`green`・`amber`・`coral` から選び、HighriseのDealsの色付きのタグと同じく、その色の平らな塗りに白い文字で示します（色は `Badge` と同じ）。`data-current="true"` を渡すと、灰色（#747474）の塗りに白い文字で強調します。',
    "`href` を渡すと分類へ移るリンクになります。下線は引かず、ホバーすると枠を一段濃くし、淡い灰色の面を敷きます。",
    "`removeButton` を渡すとタグの末尾に、タグの文字と同じ色の小さな×ボタン（18px）を置きます。解除した後の処理は利用側が行います。`href` と `removeButton` は同時に使えません。",
    "複数のタグは `TagGroup` で囲みます。タグの間を4pxに詰めて折り返し、長い文言も省略しません。",
    "`Tag` は `class`・`id` などのHTML属性をタグのルート（`href` がある時は `a`、それ以外は `span`）に渡します。JavaScriptは使いません。",
  ],
  accessibility: [
    '`TagGroup` は `role="group"` で、`label` を名前にします。',
    "解除の操作はアイコンだけのボタンなので、「暮らしを解除」のように何を解除するかを `aria-label` で付けます。",
    "`accent` の色は見分けの補助です。意味は文言で伝えます。",
  ],
  propNotes: {
    TagGroup: { children: "並べる `Tag`。" },
  },
} satisfies ComponentDoc;
