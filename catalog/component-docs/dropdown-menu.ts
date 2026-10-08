import type { ComponentDoc } from "../reference";

export default {
  id: "dropdown-menu",
  name: "DropdownMenu",
  description: "現在の対象に関する補助の操作をまとめます。",
  api: ["DropdownMenu"],
  guidance: [
    "今見ている対象への補助の操作（複製・書き出し・削除など）を、一つの操作の中にしまう時に使います。",
    "表示の切り替えや並び順のように、開いたままオン・オフを切り替えたり一つを選んだりする設定にも使えます（`checkbox`・`radio`）。",
    "文字を入力して絞り込みながら選ぶ時は `FilterMenu`、フォームの値として一つを選ぶ時は `Select` を使います。",
    "主操作にほかのやり方を▾で添える時は `SplitButton` を使います。",
    "説明の文やフォームを載せる時は、白いパネルの `Popover` を使います。",
  ],
  usage: [
    "`DropdownMenuController` を `dropdown-menu` として登録します。`id` は画面内で一意にし、`items` に項目を並べます。開く操作は共通の `Button` で、`variant`・`size`・`disabled`・`busy` は開く操作にかかります。",
    "項目は `kind` で分けます。省略または `action` は通常の操作、`link` はページの移動、`checkbox` はオン・オフ、`radio` は単一選択、`submenu` は下の階層、`separator` は区切り線、`group` は見出し付きのまとまりです。`submenu` と `group` は `items` を持ち、入れ子にできます。`radio` の `name` は、同じ階層の中の選択のまとまりを表します。",
    "項目には `icon`・`description`・`shortcut` を添えられ、通常の操作は `danger` で赤い文字にできます（ホバーした時と選んでいる時は、淡い赤の面に赤い文字にします）。`shortcut` は表示だけで、キーの登録は利用側が行います。",
    "通常の操作は選ぶと閉じ、チェックと単一選択は開いたままチェックマークを更新します。`closeOnSelect` でこの既定を変えられます。リンクは標準のページ移動を行い、選択のイベントを発火しません。",
    "選んだ項目は `dropdown-menu:select` の `detail` で受け取ります。`action` に `dropdown-menu:select->editor#apply` のようなStimulusのactionを渡すと、ルートの `data-action` になり、利用側のcontrollerへつなげます。選んだ後の処理（保存・通信・画面の更新）は利用側が行います。",
    "メニューは白いパネル（1px #bbb の枠、角丸5px、外への柔らかい影）に黒い12pxの文字で、Popover APIのトップレイヤーに出します。開閉はその場で切り替え、アニメーションはしません。項目は28pxの間隔で並べます。ホバーした項目と矢印キーで選んでいる項目は、行の幅いっぱいの角の無い淡い青（`--rx-option-active`、#ddeefe）に黒い文字にし、ピルで囲みません。まとまりの見出しは灰色の小さな太字（11px）、区切りは1px #dedede の罫線です。使えない項目は文字だけを灰色にします。開く操作の下に出し、下に空きが無ければ上に出します。サブメニューは行の末尾側に開き、空きが無ければ反対側に開きます。どちらも画面の端から8pxの内側に収め、幅は20rem、高さは384pxを上限にして、あふれる分はスクロールします。",
    "メニューの背後には透明な層を置き、層を押すとメニューを閉じます。背後のボタンやリンクは押されません。メニューの外へフォーカスが移った時と、別の `DropdownMenu` を開いた時も閉じます。",
    "項目は上揃えです。一行の時は対称な上下の余白で中央に見え、説明が付いて複数行になると、同じ上端から下へ伸びます。項目の中身全体を `align-items: center` で中央へ寄せないでください。指で操作する環境では、一行の高さを2.75remにします。",
    "`items` が空の時は「利用できる操作はありません」と出します。JavaScriptなしではメニューは開きません。",
  ],
  keyboard: [
    ["↓ / Enter / Space（開く操作）", "メニューを開き、最初の有効な項目へ移ります。"],
    ["↑（開く操作）", "メニューを開き、最後の有効な項目へ移ります。"],
    ["↓ / ↑", "次・前の有効な項目へ移ります。端では反対の端へ戻ります。"],
    ["Home / End", "最初・最後の有効な項目へ移ります。"],
    ["→（右から左では←）", "サブメニューの項目では、サブメニューを開いて最初の項目へ移ります。"],
    ["←（右から左では→）", "サブメニューを閉じ、親の項目へ戻ります。"],
    ["Enter / Space", "項目を選びます。リンクは移動し、サブメニューの項目は下の階層を開きます。"],
    ["Escape", "一段戻ります。一番上の階層では閉じて、開く操作へフォーカスを戻します。"],
    ["Tab", "メニューを全て閉じ、開く操作から次（Shift+Tabなら前）の要素へ進みます。"],
    [
      "文字",
      "項目名がその文字で始まる次の項目へ移ります。続けて打った文字（0.6秒以内）は一続きの語として探します。",
    ],
  ],
  accessibility: [
    '開く操作は `aria-haspopup="menu"`・`aria-expanded`・`aria-controls` を持ち、メニューは `role="menu"` で開く操作の文言を名前にします。`iconOnly` の時は `label` を開く操作の `aria-label` にします。',
    "項目は `menuitem`・`menuitemcheckbox`・`menuitemradio` で、チェックと単一選択は `aria-checked`（`mixed` を含む）で状態を伝えます。サブメニューの項目は `aria-haspopup`・`aria-expanded`・`aria-controls` を持ちます。",
    '項目名は `aria-label`、`description` は `aria-description` として読み上げます。選べない項目は `aria-disabled="true"` にし、矢印の移動で飛ばします。',
    '`group` は見出しを名前にした `role="group"`、`separator` は `role="separator"` です。',
    "`shortcut` の表記は読み上げから外します（`aria-hidden`）。",
    "日本語の変換中のキーと、Ctrl・Alt・Commandを押しながらのキーは奪いません。サブメニューをマウスで開くのは、項目にホバーして150ms後です。",
  ],
  events: [
    ["dropdown-menu:open", "一番上のメニューを開いた時。`detail` は空です。"],
    ["dropdown-menu:close", "メニューを閉じた時。`detail` は空です。"],
    [
      "dropdown-menu:beforeselect",
      "項目を選ぶ直前。取り消せます（`preventDefault()` でチェックを変えず、閉じません）。`detail` は `value`・`kind`、チェックと単一選択では選んだ後の `checked`、単一選択では `name` です。",
    ],
    [
      "dropdown-menu:select",
      "項目を選んだ後。`detail` は `dropdown-menu:beforeselect` と同じです。リンクとサブメニューの項目では出しません。",
    ],
  ],
  propNotes: {
    DropdownMenu: {
      disabled: "開く操作を押せなくする。",
    },
  },
} satisfies ComponentDoc;
