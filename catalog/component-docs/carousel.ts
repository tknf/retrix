import type { ComponentDoc } from "../reference";

export default {
  id: "carousel",
  name: "Carousel",
  description: "関連する内容を1件ずつ表示し、前後に切り替えます。",
  api: ["Carousel"],
  guidance: [
    "お知らせや特集など、関連する少数の内容を同じ場所で一枚ずつ読ませる時に使います。",
    "全件を見比べる必要がある内容は、隠さずに `Card` を並べるか一覧にします。",
  ],
  usage: [
    "`slides` に一枚ずつ `title` と `content` を渡します。各スライドは `Card` として描き、`preview`・`eyebrow`・`footer`・`href` はCardの同じ名前の欄に渡ります。見出しの上には「1 / 3」のように位置を茶色の小さな文字で書きます。",
    "スライドが2件以上ある時だけ前後の操作を置きます。`CarouselController` を `carousel` として登録すると前後へ移れ、最後と最初はつながります。1件では操作を置かず、0件では「表示する項目はありません」の空状態を示します。",
    "`interval` に正のミリ秒を渡すと「自動再生」の操作を置きます。自動送りは利用者がこの操作を押した時だけ始まり、「一時停止」を押すか、中へフォーカスが入ると止まります。",
    "スライドは同じ場所に重ね、枠の高さを一番高いスライドにそろえるので、切り替えても下の内容は動きません。切り替えは動きを付けずにその場で入れ替えます。前後の操作はアイコンだけの控えめな`Button`（22pxの正方形、角丸5px）で、カードの左右の縁をまたいで重なり、配置先の幅が27rem未満ではカードの下に並びます。",
    "JavaScriptがない時は `initialIndex` のスライドだけを表示し、前後の操作は働きません。",
  ],
  keyboard: [
    [
      "Tab",
      "前後の操作・自動再生の操作・スライドの中のリンクへ移ります。中へフォーカスが入ると自動送りを止めます。",
    ],
    [
      "Enter / Space",
      "「前のスライド」「次のスライド」で前後へ移り、「自動再生」「一時停止」で自動送りを切り替えます。",
    ],
  ],
  accessibility: [
    'ルートは `role="group"`・`aria-roledescription="carousel"` で、`label` を名前にします。各スライドは `aria-roledescription="slide"` のまとまりで、「1 / 3: 題名」を名前に持ちます。',
    "見えていないスライドは `hidden` にし、読み上げとフォーカスから外します。",
    "前後の操作は「前のスライド」「次のスライド」を名前に持つ、アイコンだけのボタンです。",
    "自動送りは利用者が選ぶまで始めず、フォーカスが中へ入ると止めます。",
  ],
  events: [
    [
      "carousel:beforechange",
      "利用者の操作か自動送りでスライドが変わる前に発火します。取り消せます。detailは `index`（移る先）・`previousIndex`・`reason`（`pointer`・`keyboard`・`timer`）です。",
    ],
    ["carousel:change", "スライドが変わった後に、同じdetailで発火します。"],
  ],
} satisfies ComponentDoc;
