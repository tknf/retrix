import type { ComponentDoc } from "../reference";

export default {
  id: "breadcrumb",
  name: "Breadcrumb",
  description: "階層をたどって、上の階層へ戻ります。",
  api: ["Breadcrumb"],
  guidance: [
    "階層の深い画面で、上位の階層をたどって戻れるようにする時に使います。",
    "作業面の上端で現在地と操作を一緒に置く時は`ContextBar`、一つ上へ戻るだけなら`BackLink`を使います。",
  ],
  usage: [
    "`items`に上位から現在地までを順に渡します。`href`を持つ項目は、青緑の文字に1pxの下線を引いたリンクになり、ホバーすると赤にします。`href`の無い途中の項目は灰色の文字です。最後の項目は現在地として黒い通常の太さの文字で出し、`href`を渡してもリンクにしません。文字は12pxです。",
    "項目の間には淡い灰色の「›」を置きます。狭い場所では項目の間で折り返し、長い名前は途中でも折り返します。",
    "単独でも、`ContextBar`の現在地としても使えます。",
  ],
  accessibility: [
    "ルートは`label`を読み上げ名に持つ`nav`で、項目を`ol`の順に並べます。",
    '最後の項目に`aria-current="page"`を付けます。',
  ],
} satisfies ComponentDoc;
