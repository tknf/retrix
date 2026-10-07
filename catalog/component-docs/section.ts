import type { ComponentDoc } from "../reference";

export default {
  id: "section",
  name: "Section",
  description: "関連する内容を、見出し・件数・操作と一緒にまとめます。",
  api: ["Section"],
  guidance: [
    "作業面の中で、関連する一覧や内容を見出しと件数でまとめる時に使います。",
    "画面全体の見出しは`PageHeader`、一件の内容をカードにまとめる時は`Card`、見出しを持たない区切りは`Divider`を使います。",
  ],
  usage: [
    "`title`を見出しに出し、`children`をその下に置きます。見出しは赤（`#990000`）の通常の太さの名前（15px、`--rx-section-title`）に、件数と操作を続けて並べます（「議論　［新しい投稿］」）。名前と件数・操作の間は16px空けます。見出しから線は伸ばしません。続く一覧や表の罫線と重ねないためです。",
    "`count`は名前の横の、淡い灰色（`#f2f2f2`）の地に11pxの灰色の数字を書いた高さ20pxのピルに出します。`count={0}`も表示します。",
    "カード・`SplitView`・右の列・入れ子の`Section`の中では、見出しを本文の大きさ（13px）の黒い太字にします。赤い見出しは作業面の最上位のまとまりだけに使います。",
    "`tone`は見出しの文字の色です。`neutral`は赤（`--rx-heading`）、`info`・`success`・`warning`・`danger`はそれぞれの役割の色です。カードなどの中で黒い太字にした見出しには効きません。色だけで状態を伝えず、見出しの文言でも示します。",
    "`actions`は件数の後ろに続けて並べます。控えめなボタン（高さ22px）を置きます。狭い場所では見出しの行を折り返します。",
  ],
  accessibility: [
    "ルートは`section`、見出しは常に`h2`です。画面の見出し（`h1`）の下のまとまりに使います。",
    "ルートに読み上げ名は付けません。ランドマークとして扱わせたい時は、`aria-labelledby`などを利用側で渡します。",
  ],
  propNotes: {
    Section: {
      children: "見出しの下に置く内容。",
    },
  },
} satisfies ComponentDoc;
