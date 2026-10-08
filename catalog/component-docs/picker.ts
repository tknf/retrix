import type { ComponentDoc } from "../reference";

export default {
  id: "picker",
  name: "Picker",
  description: "検索して、候補から値を選びます。",
  api: ["Picker"],
  guidance: [
    "担当者や確認する人のように、候補が多く、名前で探して選ぶ時に使います。`multiple` で複数を選べます。",
    "候補が少なく探す必要が無い時は `Select`、候補に無い値も入力させる時は `Suggestion` を使います。",
    "自由な語を付け足していく時は `TagInput` を使います。",
  ],
  usage: [
    "送信する値は、見えない標準の `select` が `name` で送ります。上の検索欄は候補を探すためだけのもので、送信しません。`options` の `value` が空白だけの候補と、重なった値の二つ目以降は出しません。",
    "検索欄に移ると候補の一覧を開きます。打った文字で候補の名前を絞り込み、全角と半角、大文字と小文字は区別しません。選べる候補が一つも無い時は「一致する候補はありません。」と出します。候補を選ぶと検索欄を空にして一覧を閉じ、検索欄へフォーカスを戻します。",
    "候補の一覧は検索欄のすぐ下に、選んだ値と補足の上へ重ねて開く白いパネル（1px `#bbbbbb` の枠、角丸5px、柔らかい影）で、12pxの候補の行を隙間なく並べます。ホバーした候補とキーボードで移った候補は、角の無い淡い青（`#ddeefe`）に黒い文字で塗ります。ピルで囲みません。選び済みの候補は太字、選べない候補は灰色の文字にします。",
    "選んだ候補は、検索欄の下に解除の操作付きの `Tag` で並べます。一つを選ぶ時は、別の候補を選ぶと置き換え、選び済みの候補を選び直しても変更として扱いません。`multiple` では選ぶたびに加え、同じ候補をもう一度選ぶと外します。どちらも `Tag` の解除の操作で外せます。",
    "`required` で未選択のまま送信すると、検索欄へフォーカスを移して「候補を選択してください。」と出します。フォームのリセットでは標準の `select` の初期値に戻し、表示も合わせます。",
    "`ComboboxController` を `combobox`、`PickerController` を `picker` として登録します。選択を変えると `picker:change` を出し、標準の `select` でも `input`・`change` を発火します。`Tag` の見た目に `components/tag.css`、候補の一覧に `components/field.css` も読み込みます。",
    "候補を取得し直した時は、`PickerController` の `replaceOptions(options)` へ新しい候補を渡します。新しい候補にも残る選択は保ち、選択が変わった時は標準の `select` で `input`・`change` を発火します。候補の取得と通信は利用側が行います。",
    "JavaScriptが無い時は、検索欄を出さず、標準の `select` をそのまま使います。一つを選ぶ時は先頭に「選択してください」の空の選択肢を置きます。",
  ],
  keyboard: [
    ["↓ / ↑", "一覧を開き、次・前の候補へ移ります。"],
    ["Home / End（一覧が開いている時）", "最初・最後の候補へ移ります。"],
    [
      "Enter（一覧が開いている時）",
      "移った候補を選びます。`multiple` で選び済みの候補なら外します。",
    ],
    ["Escape（一覧が開いている時）", "一覧を閉じます。"],
    ["Tab", "検索欄の次に、選んだ `Tag` の解除の操作へ移ります。"],
  ],
  accessibility: [
    'controllerが動くと、ラベルの `for` を標準の `select` から検索欄へ移します。検索欄は `role="combobox"` と `aria-autocomplete="list"` で、`aria-expanded` と `aria-activedescendant` で開閉と移った候補を伝えます。',
    "候補の一覧は「（`label`）の候補」、選んだ値の並びは「選択中」、`Tag` の解除の操作は「（候補の名前）を解除」という読み上げ名にします。",
    '候補が無い時や未選択の時の知らせは `role="status"` の領域で読み上げます。',
    "`help`・`error` は標準の `select` と検索欄の両方へ説明として関連付け、`error` がある時は両方を `aria-invalid` にします。",
  ],
  events: [
    [
      "picker:change",
      "選択を変えた後に出します。detailは `selected`（選んでいる値の配列）・`value`（標準の `select` の値）です。取り消せません。",
    ],
    [
      "combobox:beforechange",
      "候補を選ぶ前に出します。取り消すとその候補を選びません。detailは `value`（押した候補の値）・`selected`（選んだ後の値の配列。一つを選ぶ時は押した候補だけ）・`previousSelected`（選ぶ前の値の配列）・`reason` です。選んだ結果は `picker:change` で受け取ります。",
    ],
  ],
} satisfies ComponentDoc;
