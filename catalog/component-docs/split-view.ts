import type { ComponentDoc } from "../reference";

export default {
  id: "split-view",
  name: "SplitView",
  description: "一覧と本文、作業と補足を並べて表示します。",
  api: ["SplitView"],
  guidance: [
    '一覧と、その中で選んだ一件の本文を並べる時は`layout="reader"`を使います。',
    '作業の本体と、その値や状態の補足を並べる時は`layout="inspector"`を使います。',
    "作業面の左右に開閉できる補助パネルを付ける時は`Wing`、同じ場所で中身を切り替える時は`Tabs`を使います。",
  ],
  usage: [
    "`primary`・`secondary`を渡します。DOMの読み順は常に`primary`、`secondary`の順です。二つの領域は一枚の面に並べ、境目に罫線を一本引きます。",
    "`SplitView`自身の幅が52rem以上で左右に並べます。`inspector`は`primary`を広く（おおよそ2:1）、`reader`は`primary`を狭く（おおよそ3:5）取ります。52rem未満では`primary`を上、`secondary`を下に積み、境目の罫線は横になります。",
    "`resizable`を指定し、`SplitterController`を`splitter`として登録すると、境目にハンドルを出します。ハンドルのドラッグと矢印キーで、`primary`の幅を全体の20〜80%の間で変えられます。初めの幅は`initialSize`で決めます。幅を変えられるのは左右に並べた時だけです。",
    "利用者が幅を変えると`splitter:beforechange`、続けて`splitter:change`を発火します。ドラッグは離した時に一度だけ発火します。幅を覚えておく時は、`splitter:change`の`detail.value`を利用側で保存し、次の描画で`initialSize`に渡します。",
    "JavaScriptなしではハンドルを出さず、`layout`の比率で並べます。",
  ],
  keyboard: [
    [
      "← / →",
      "ハンドルで、`primary`の幅を1%ずつ狭く・広くします。右から左へ書く言語では向きが逆になります。",
    ],
    ["Home / End", "ハンドルで、`primary`を最小（20%）・最大（80%）の幅にします。"],
    ["Enter", "ハンドルで、`primary`を最小の幅にします。もう一度押すと元の幅に戻します。"],
  ],
  accessibility: [
    'ハンドルは`role="separator"`・`aria-orientation="vertical"`で、「領域の幅を調整」という読み上げ名と、`primary`の領域を指す`aria-controls`を持ちます。今の幅はcontrollerが`aria-valuenow`・`aria-valuemin`・`aria-valuemax`で伝えます。',
    "controllerが使う幅の範囲入力（「主領域の幅」）を、見た目からは隠して置きます。",
  ],
  events: [
    [
      "splitter:beforechange",
      "利用者が幅を変える直前に発火します。`detail`は`value`（新しい幅の%）・`previousValue`・`reason`（`pointer`または`keyboard`）です。取り消すと元の幅に戻します。",
    ],
    ["splitter:change", "幅を変えた後に発火します。`detail`は`splitter:beforechange`と同じです。"],
  ],
  propNotes: {
    SplitView: {
      id: "ルートのid。省略すると自動で作り、ハンドルと`primary`の領域、幅の入力の関連付けに使います。",
    },
  },
} satisfies ComponentDoc;
