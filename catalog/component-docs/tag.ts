import type { ComponentDoc } from "../reference";

export default {
  id: "tag",
  name: "Tag",
  description: "分類や選択した条件を短く示します。",
  api: ["Tag", "TagGroup"],
  guidance: [
    "記事の分類や、選んだ絞り込みの条件を短く示す時に使います。",
    "公開中・確認待ちなどの状態は、背景を塗った `Badge` で示します。Tagは背景を塗らず、枠線で分類を示します。",
    "利用者が自由に書いてタグを追加する入力欄は `TagInput` を使います。",
  ],
  usage: [
    "`label` を渡します。枠線は文字と同じ色、文字はMediumです。`accent` は `blue`・`green`・`amber`・`coral` から選び、渡さなければ淡い灰色にします。",
    "`href` を渡すと分類へ移るリンクになり、ホバーすると背景に役割の色を淡く付けます。",
    "`removeButton` を渡すとタグの末尾に解除の×ボタンを置きます。解除した後の処理は利用側が行います。`href` と `removeButton` は同時に使えません。",
    "複数のタグは `TagGroup` で囲みます。タグの間を0.5remあけて折り返し、長い文言も省略しません。",
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
