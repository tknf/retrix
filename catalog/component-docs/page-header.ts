import type { ComponentDoc } from "../reference";

export default {
  id: "page-header",
  name: "PageHeader",
  description: "対象と作業を、大きな見出しで伝えます。",
  api: ["PageHeader"],
  guidance: [
    "画面の最上部で、その画面の対象と作業を大きな見出しで示す時に使います。",
    "作業面の中のまとまりの見出しは`Section`、人やグループの画面の見出しは`ProfileHeader`を使います。",
    '`align="center"`は作業面の主題を示す時だけに使います。本文や入力欄は中央に揃えません。',
  ],
  usage: [
    "`title`を見出し、`description`をその下の補足として出します。`icon`は見出しの前の大きなアイコンで、淡い灰色の面に3pxの白い縁と四方への浅い影を付けた48pxの四角（角丸2px）に灰色で収めます。`actions`は見出しの後に並ぶ操作です。見出しは18px（`--rx-title`）の黒い太字で、補足は12pxの茶色の文字です。",
    '既定は先頭側に揃え、見出しの下に24px空けて1px `#dedede` の罫線を引いて、そこからシートの中身が始まることを示します。`align="center"`では下の罫線を引かず、アイコン・見出し・補足・操作を中央に積みます。Basecamp 2のCatch upの見出しと同じく、見出しの左右に線は伸ばしません。',
    "見出しの文字は、シートの見出しの大きさ（18px）を上限に、`PageHeader`自身の幅が狭いほど小さくします。まとまりの見出しの大きさ（15px）より小さくはしません。幅が30rem未満では`actions`を見出しの下の行へ回します。",
  ],
  accessibility: [
    "ルートは`header`で、見出しと補足を`hgroup`にまとめます。",
    "見出しは常に`h1`です。一つの画面に`PageHeader`は一つだけ置きます。",
  ],
} satisfies ComponentDoc;
