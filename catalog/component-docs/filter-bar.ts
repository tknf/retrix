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
    "`label` と `items`（`label`・`href`・`current`・任意の `count`・`icon`）を渡します。各条件は `Button` と同じ見た目の `ActionLink` になり、`current` の条件は `Button` のオンと同じ青緑の縦の塗りに白い文字にします。`count` は名前の後に灰色の数字で出し（選んでいる条件では白）、0も表示します。",
    "`appearance` の `chips` は各リンクを角の小さなボタンの形のまま0.25remの間隔で並べて折り返し、`segmented` は `ButtonGroup` と同じく隙間なくつなげて間を1本の線にし、外側の角だけを丸めた一組として一行に並べます。",
    '条件を含むURLと、どれを選んでいるかはサーバーが決めて渡します。`items` の代わりに `children` でリンクを直接並べることもできます。その時は `a` 要素を直接の子にし、現在地の `aria-current`・`data-current="true"` は利用側で付けます。',
    "controllerは持たず、通常のリンクなのでJavaScriptが無くても移れます。",
  ],
  accessibility: [
    "全体は `nav` で、`label` を名前にします。何を絞り込むかを短く書きます（「記事の状態」など）。",
    '`current` の条件に `aria-current="page"` を付け、今選んでいる条件を読み上げでも伝えます。',
  ],
} satisfies ComponentDoc;
