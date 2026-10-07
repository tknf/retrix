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
    "`title`を見出しに出し、`children`をその下に置きます。見出しは赤茶の通常の太さの名前（18px）に、件数と操作を続けて並べます（「議論　［新しい投稿］」）。見出しから線は伸ばしません。続く一覧や表の罫線と重ねないためです。",
    "`count`は名前の横の灰色の小さなピルに出します。`count={0}`も表示します。",
    "`tone`は見出しの文字の色です。`neutral`は赤茶（`--rx-heading`）、`info`・`success`・`warning`・`danger`はそれぞれの役割の色です。色だけで状態を伝えず、見出しの文言でも示します。",
    "`actions`は件数の後ろに続けて並べます。小さなボタンを置きます。狭い場所では見出しの行を折り返します。",
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
