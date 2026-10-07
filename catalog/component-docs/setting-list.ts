import type { ComponentDoc } from "../reference";

export default {
  id: "setting-list",
  name: "SettingList",
  description: "設定の名前と、行の末尾の操作を点線でつないだ一覧です。",
  api: ["SettingList"],
  guidance: [
    "公開範囲・通知・人の役割のように、名前ごとに一つの操作が付く設定を並べる時に使います。",
    "値を読ませるだけの属性は `ValueList`、操作が名前ではなく一件の項目に付く一覧は `DataList` を使います。",
  ],
  usage: [
    "`items` に `label` と `control` を渡します。名前（太字）と淡い `description` を先頭側に、`control` の操作（`Switch`・チェックマーク・`Button` など）を末尾側に置き、その間を淡い点線でつなぎます。`leading` にアバターやアイコンを渡すと名前の前に置きます。",
    "点線は余った幅いっぱいに引き、狭くても1.5remは残します。点線と操作が入らない時は、操作を次の行の末尾側へ回します。行の間に罫線は引きません。",
    "SettingListは並べ方だけを持ち、設定の値・送信・保存は `control` に渡したコンポーネントと利用側が持ちます。controllerを持たないので、JavaScriptなしでも渡した操作の振る舞いのまま表示されます。",
  ],
  accessibility: [
    "ルートは `label` を名前に持つ `ul` です。点線は読み上げから外します。",
    "`control` の操作には、どの名前の設定か分かる名前を付けてください（例：`Switch` の `label`、アイコンだけの `Button` の `aria-label`）。行の名前は操作に自動では結び付きません。",
    "チェックマークのように状態を形だけで示す `control` は読み上げでは伝わらないので、必要なら読み上げ用の文を添えてください。",
  ],
} satisfies ComponentDoc;
