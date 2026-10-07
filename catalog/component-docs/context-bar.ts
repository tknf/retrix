import type { ComponentDoc } from "../reference";

export default {
  id: "context-bar",
  name: "ContextBar",
  description: "現在の位置と、関連する移動・操作を作業面の上部にまとめます。",
  api: ["ContextBar"],
  guidance: [
    "作業面の上端で、現在地のパンくずと、その対象への移動・操作をまとめる時に使います。",
    "パンくずだけを置く時は`Breadcrumb`、一つ上へ戻るだけなら`BackLink`を使います。",
    "`Toolbar`は関連する複数の操作、`ContextBar`は現在地とその対象の操作をまとめます。操作のグループにキー操作が要る時は、`ContextBar`の中に`Toolbar`を置きます。",
  ],
  usage: [
    "`items`で現在地までの階層を渡し、`children`に`Button`・`ActionLink`・`Toolbar`・`ButtonGroup`・`DropdownMenu`などを置きます。操作はバーの末尾側に寄ります。",
    "主要な操作は一つに絞り、補助操作の後に置きます。移動は`ActionLink`、フォームの送信や画面内の操作は`Button`を使います。フォームの外から送信・リセットする時は、`Button`の`form`属性に対象のフォームの`id`を渡します。",
    "バーの高さは操作の有無で変えません。幅が足りない時は現在地、操作の順に折り返し、長い名前や空白のない識別子も折り返します。",
    "`Surface`と組み合わせる時は`context`に渡します。`Surface`の上端に、本文と同じ左右の余白で置き、下の区切り線を消します。`AppShell`の作業面の先頭に置いた時も同じく、見出しと同じ左右の位置に置いて区切り線を消し、作業面の上の余白を詰めます。",
  ],
  accessibility: [
    '現在地は`Breadcrumb`の`nav`で出し、`label`がその読み上げ名になります。最後の項目に`aria-current="page"`を付けます。',
    'バー全体には`role="menu"`や`role="toolbar"`を付けません。',
    "無効な操作を置く時は、操作できない理由を本文にも示し、`aria-describedby`などで関連付けます。",
  ],
  propNotes: {
    ContextBar: {
      children:
        "バーの末尾側に置く操作。`Button`・`ActionLink`・`Toolbar`・`ButtonGroup`・`DropdownMenu`などを渡します。",
    },
  },
} satisfies ComponentDoc;
