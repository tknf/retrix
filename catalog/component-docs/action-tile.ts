import type { ComponentDoc } from "../reference";

export default {
  id: "action-tile",
  name: "ActionTile",
  description:
    "塗りつぶしのアイコンと名前を縦に並べたタイルです。リンクや操作をグリッドに並べます。",
  api: ["ActionTile"],
  guidance: [
    "よく使う画面へのショートカットや、選んだ項目への一括操作を、アイコンと名前で格子に並べる時に使います。`CommandMenu` の上段のショートカットと、`Table` の `selectionActions` の一括操作もこのタイルです。",
    "画面の下に浮かぶ操作バーにする時は、タイルを並べる `ActionDock` を使います。",
    "文の流れの中やフォームの末尾に置く一つの操作は `Button` を使います。",
  ],
  usage: [
    '`label` と `icon` は必須です。アイコンは塗りつぶしで上、名前は下に置きます。`href` を渡すと移動のリンク（`current` で今いる場所）、渡さなければ `type="button"` のボタンになり、`onclick` や `data-*` で操作を結び付けます。残りの標準の属性は `a` または `button` に渡ります。',
    "`accent` は `blue`（既定、リンクと同じ青緑）・`green`・`amber`・`coral` で、アイコンの色が変わります。",
    "普段はBasecamp 2のファイルを並べた格子のセルと同じく、白い面に淡い灰色（#e9e9e9 前後）の1pxの枠を付けた角の立った四角で、名前は12pxの黒い太字です。ホバーすると淡い黄色の面にし、押すと黄色の面で内側へへこみます。フォーカスすると内側に青い2pxの線を引きます。`disabled` はリンクなら移動しない要素（`href` の無い `span`）、ボタンなら押せない状態にし、どちらも形と面はそのままで名前とアイコンだけを灰色にします。",
    "`shortcut` は `Keycap` の小さい形で、アイコンの末尾側の上に添えます。キーの登録は利用側が行います。`badge` は `Badge` の小さい形で、アイコンの上に重ねます。バッジがある時は、ショートカットキーの表示をタイルの末尾側の角へ寄せます。",
    "タイルはセルいっぱいに広がるので、並べ方と列数は置く側の格子が決めます。名前は語の途中で切らず、文節の切れ目で折り返します。",
    "文字の指定（書体・大きさ・太さ・行高）は `action-tile.css` が持ちます。共通の `Button` とは別の専用の操作として、文字位置の検査に登録しています。",
  ],
  accessibility: [
    'リンクは `a`、操作は `button` なので、標準のキー操作で押せます。`current` のリンクは `aria-current="page"` を持ちます。',
    '`disabled` のリンクは `role="link"`・`aria-disabled="true"` の `span` になり、フォーカスできません。リンクだけの属性（`target`・`rel` など）と `tabindex` は外し、`aria-description` などほかの属性は保ちます。',
    "`shortcut` の表記は読み上げから外します（`aria-hidden`）。`badge` の文字は名前の前に続けて読み上げます。",
    "強制カラーモードでは、タイルに枠を引きます。",
  ],
} satisfies ComponentDoc;
