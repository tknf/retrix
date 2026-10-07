import type { ComponentDoc } from "../reference";

export default {
  id: "filter-menu",
  name: "FilterMenu",
  description: "文字を入力して候補を絞り込み、選択する小さなパネルです。",
  api: ["FilterMenu"],
  guidance: [
    "ラベル付けや担当の割り当てのように、多めの候補から打って絞り込みながら選ぶ時に使います。",
    "候補が少なく、打って探す必要が無い操作は `DropdownMenu` を使います。",
    "フォームの欄として値を入力・選択する時は、`Select`・`Suggestion`・`Picker` など入力欄のコンポーネントを使います。",
  ],
  usage: [
    "`FilterMenuController` を `filter-menu` として登録します。`id` は画面内で一意にし、`label` に開く操作の文言、`title` にパネルの見出し、`options` に候補を渡します。",
    "見た目は `DropdownMenu` と同じ白いパネルに黒い文字で、上に枠のある絞り込みの欄、その下に小さな灰色の太字の見出しと候補を並べます。選んだ候補は太字にしてチェックを置き、ホバーした候補と矢印キーで選んでいる候補は青緑で塗って白い文字にします。中に文字の欄を持つため、メニューではなく、コンボボックス（絞り込みの欄）とリストボックス（候補）を載せたパネルにしています。パネルは標準のPopover APIで開き、開く操作に揃えて置きます。Escapeとパネルの外側を押すと閉じます。",
    "開くと前に打った文字を消し、絞り込みの欄へ移ります。打った文字を名前に含む候補だけを残し（大文字と小文字は区別しません）、残った最初の候補を選ぶ位置にします。当てはまる候補が無い時は `emptyLabel` を出します。",
    "`multiple` なら開いたまま選択のチェックを切り替え、そうでなければ選んだ一つにチェックを付けて閉じます。一つだけの時は、選んだ候補を選び直しても外れません。候補には `icon`・`shortcut`・`disabled` を添えられます。`shortcut` は表示だけで、キーの登録は利用側が行います。",
    "選ぶたびに `filter-menu:select` を出します。`name` を渡すと、候補ごとに隠し入力を置き、選んだ候補の値だけをフォームで送ります。",
    "`createLabel` を渡すと絞り込みの欄の隣に作る操作を置き、押すと `filter-menu:create` を発火し、打った文字を渡します。候補を作ってパネルの候補に加える処理と、選んだ結果の保存は利用側が行います。",
    "JavaScriptなしでもパネルは標準のPopover APIで開閉し、初めから選んだ候補の値は送信されますが、絞り込みと選択はできません。",
  ],
  keyboard: [
    ["Enter / Space（開く操作）", "パネルを開き、絞り込みの欄へ移ります。"],
    ["文字", "候補を名前で絞り込みます。"],
    ["↓ / ↑", "次・前の選べる候補へ移ります。端では反対の端へ戻ります。"],
    ["Enter", "選ぶ位置の候補を選びます。"],
    ["Escape", "パネルを閉じます。"],
  ],
  accessibility: [
    '開く操作は `aria-haspopup="dialog"`・`aria-controls` を持ち、パネルは `title` を名前にした `role="dialog"` です。`iconOnly` の時は `label` を開く操作の `aria-label` にし、`icon` が無ければ▾のマークを出します。',
    "開く操作の `aria-expanded` は、controllerがパネルの開閉に合わせて切り替えます。JavaScriptなしでは初期HTMLに書かず、標準のPopover APIの開閉状態をブラウザが伝えます。",
    '絞り込みの欄は `role="combobox"` で、`placeholder` を `aria-label` にし、選ぶ位置の候補を `aria-activedescendant` で伝えます。',
    '候補は `role="listbox"` の `option` で、選んだ状態を `aria-selected`、選べない候補を `aria-disabled` で伝えます。`multiple` の時は `aria-multiselectable="true"` を付けます。',
    "日本語の変換中の矢印とEnterは、候補の移動や選択に使いません。",
    "`shortcut` の表記は読み上げから外します（`aria-hidden`）。",
  ],
  events: [
    [
      "filter-menu:select",
      "候補を選んだ時。`detail` は `value`（候補の値）と `selected`（選んだ後の状態）です。`multiple` では外した時に `selected` が `false` になります。",
    ],
    [
      "filter-menu:create",
      "作る操作を押した時。`detail.query` に絞り込みの欄の文字（前後の空白を除く）を渡します。",
    ],
  ],
} satisfies ComponentDoc;
