import type { ComponentDoc } from "../reference";

export default {
  id: "switch",
  name: "Switch",
  description: "オン・オフの設定を切り替えます。",
  api: ["Switch"],
  guidance: [
    "通知を受け取る・完了した仕事を表示する、のようなオン・オフの設定に使います。",
    "規約への同意のように、送信の時に確かめる一つの確認は `Choice` のチェックボックスを使います。",
    "二つ以上の状態から選ぶ時は `ToggleGroup` かラジオボタンの `Choice` を使います。",
  ],
  usage: [
    '実体は標準のチェックボックスに `role="switch"` を付けたものです。`label` と `description` を並べ、全体を押せる範囲にします。`checked` は初期状態です。',
    "オンの時だけ `name` と `value` を送信します。`value` を省略すると `on` を送ります。オフの時は何も送らないので、オフを保存するかは送信先で決めます。フォームのリセットと `disabled` も標準のまま動きます。",
    "controllerの登録は要らず、JavaScriptが無い時も同じように動きます。切り替えてすぐ保存する画面では、利用側で `change` を受けて保存します。",
    "`id` を省略すると生成します。祖先の `fieldset` の `disabled` でもまとめて使えなくできます。",
  ],
  keyboard: [["Space", "オン・オフを切り替えます。"]],
  accessibility: [
    '`role="switch"` なので、オン・オフの状態として読み上げます。',
    "`label` を読み上げ名、`description` を説明として関連付けます。`aria-label` か `aria-labelledby` を渡すとそちらを名前にし、渡した `aria-describedby` は説明の前に残します。",
  ],
} satisfies ComponentDoc;
