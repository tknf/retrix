import type { ComponentDoc } from "../reference";

export default {
  id: "filter-bar",
  name: "FilterBar",
  description: "一覧の絞り込み条件を、リンクで切り替えます。",
  api: ["FilterBar"],
  guidance: [
    '一覧の上で、状態や期間などの条件を一つ選んで絞り込む時に使います。`appearance="segmented"` にすると、月・週・一覧のような表示の切り替えにも使えます。',
    "条件ごとにページ（URL）を移ります。ページを移らずにその場で切り替える時は `Tabs` や `ToggleGroup`、多めの候補から打って探して選ぶ時は `FilterMenu` を使います。",
  ],
  usage: [
    "`label` と `items`（`label`・`href`・`current`・任意の `count`・`icon`）を渡します。各条件は `Button` と同じ文字の大きさ（12px）と高さ（22px）の `ActionLink` になります。`count` は名前の後に数字で出し、0も表示します。",
    "`appearance` の `chips` は、各条件を枠も面も無い黒い文字にして0.25remの間隔で並べて折り返します。件数は淡い青の数字（#5574b0）で、ホバーすると条件名に下線を引きます。`current` の条件は、メニューの選んでいる項目と同じ淡い青（`--rx-option-active`、#ddeefe）の面に黒い文字（件数も黒）にし、ピルで囲みません。`segmented` は控えめなボタンを `ButtonGroup` と同じく隙間なくつなげて間を1本の線にし、外側の角だけを丸めた一組として一行に並べます。件数は灰色の数字で、`current` の条件はチェックボックスの選んだ状態と同じ淡い青の縦の塗りに紺の縁と紺の文字にします。",
    '条件を含むURLと、どれを選んでいるかはサーバーが決めて渡します。`items` の代わりに `children` でリンクを直接並べることもできます。その時は `a` 要素を直接の子にし、現在地の `aria-current`・`data-current="true"` は利用側で付けます。',
    "controllerは持たず、通常のリンクなのでJavaScriptが無くても移れます。",
  ],
  accessibility: [
    "全体は `nav` で、`label` を名前にします。何を絞り込むかを短く書きます（「記事の状態」など）。",
    '`current` の条件に `aria-current="page"` を付け、今選んでいる条件を読み上げでも伝えます。',
  ],
} satisfies ComponentDoc;
