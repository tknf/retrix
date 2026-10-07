import type { ComponentDoc } from "../reference";

export default {
  id: "composer",
  name: "Composer",
  description: "本文・添付・送信の操作を、一つの入力エリアにまとめます。",
  api: ["Composer"],
  guidance: [
    "メッセージ・コメント・返信のように、本文を書いて送る入力エリアを置く時に使います。",
    "書式ツールを並べる時は、`TextEditor` を `editor` に入れます。本文の欄を他の項目と並べて入力する通常のフォームでは、`Field` と `Textarea` を使います。",
  ],
  usage: [
    "`id`・`label`・`name`・`submitLabel` を渡します。全体は標準の `form` で、`action`・`method` などの属性はそのまま `form` に付きます。題名の行に `label` を置き、その下に本文の欄、下の行に `actions` と送信ボタンを並べます。`Composer` 自体は面も影も持たず、本文の欄だけが `Input` と同じ枠（上の枠を少し濃くした沈んだ欄）とフォーカスの輪を持ちます。",
    "`to` に宛先（人やチャンネル）、`status` に下書きの保存などの状態を渡すと、題名の行に並べます。`label` は本文と同じ大きさの太字、宛先は灰色の小さな文字、状態は末尾側に茶色の小さな文字で出します。`attachments` には `FileInput` や選んだファイルの一覧を渡し、本文の下に置きます。",
    "本文の欄は本文と同じ文字サイズと行の高さで表示し、`field-sizing` に対応するブラウザでは4行から入力した分だけ伸びます（20行まで）。",
    "`busy` は送信ボタンを「送信中…」にして押せなくし、二重の送信を防ぎます。`error` は本文の欄の下に出して欄に関連付けます。送信・下書きの保存・送信後に `busy` や `error` を切り替えることは利用側で行います。",
    "`editor` にリッチテキストの編集コンポーネント（ProseMirror・Tiptapなど）や `contenteditable` の要素を渡すと、本文の欄と差し替えます。中の入力エリアがどの深さにあっても、本文と同じ文字と行の高さを適用し、囲みに `Input` と同じ枠とフォーカスの輪を付け、段落や箇条書きの間を一定の間隔にそろえます。空の `contenteditable` には `data-placeholder` の文を薄く出します。この時 `name`・`value`・`placeholder`・`rows`・`required` は使わず、送信する値の受け渡しは編集コンポーネントの側で行います。`error` は本文の欄と同じく編集コンポーネントの下に出し、囲みの枠を赤茶にします。",
    "controllerは持ちません。JavaScriptが無い時も、標準のフォームとして本文と添付を送信できます。",
  ],
  accessibility: [
    '本文の欄は `label` を名前にします。`editor` を渡した時は、`label` を名前にしたまとまり（`role="group"`）で編集コンポーネントを包みます。入力エリアそのものの名前（`aria-label` など）は編集コンポーネントの側で付けます。',
    "`busy` の間は `form` と送信ボタンに `aria-busy` を付けます。",
    "`error` を渡すと、本文の欄に `aria-invalid` を付け、誤りの文を `aria-describedby` に加えます。",
    '`editor` を渡した時は、誤りの文（IDは `<id>-body-error`）を編集コンポーネントを包むまとまりの `aria-describedby` にします。入力エリアそのものには、編集コンポーネントの側で `aria-invalid="true"` と、このIDを指す `aria-describedby` を付けます。',
  ],
} satisfies ComponentDoc;
