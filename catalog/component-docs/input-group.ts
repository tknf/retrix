import type { ComponentDoc } from "../reference";

export default {
  id: "input-group",
  name: "InputGroup",
  description: "入力欄の前後に、単位や接頭辞を並べます。",
  api: ["InputGroup"],
  guidance: [
    "「¥」「人」「https://」のように、値の前後に決まった文字を添えて入力させる時に使います。",
    "検索欄と「検索」ボタンのように、入力と一つの操作を一組で並べる時にも使います。",
    "文字だけの入力は `Input`、数だけで単位が要らない時は `NumberField` を使います。",
  ],
  usage: [
    '`Field` の `children` の中で、受け取った属性をそのまま `InputGroup` へ展開します。`prefix`・`suffix` 以外の属性は中の入力へ渡します。`type="number"` の時は中の入力を `NumberField` にし、PageUp・PageDownで10倍のstepだけ動かせます。その場合は `NumberFieldController` を `number-field` として登録します。',
    "`prefix`・`suffix` は入力と同じ枠の中に淡い文字で置きます。値には含めず、送信するのは入力の値だけです。置き場所が14rem未満になると、枠の外の操作を次の行へ送り、接頭辞と接尾辞が両方ある時は縦に積みます。",
    '`action` を渡すと枠の外の末尾側にButtonを置きます。`label` が文言で、残りはButtonのpropsです。Buttonの既定の `type` は `button` なので、フォームを送信する時は `type: "submit"` を渡します。',
    '`size="large"` は入力とボタンを高く大きい文字にします。エラー・`readonly`・`disabled` は枠全体の縁と面で示します。',
  ],
  accessibility: [
    "`prefix`・`suffix` は入力の説明として `aria-describedby` に加えます。単位は読み上げでも伝わるよう、ラベルにも「料金（円）」のように含めます。",
    "アイコンだけを `prefix` に置く時は、入力のラベルで何の欄かが分かるようにします。",
  ],
} satisfies ComponentDoc;
