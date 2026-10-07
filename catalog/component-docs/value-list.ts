import type { ComponentDoc } from "../reference";

export default {
  id: "value-list",
  name: "ValueList",
  description: "項目の現在の値を、項目名より目立たせて表示します。",
  api: ["ValueList"],
  guidance: [
    "予約の内容や記事の公開状態のように、一つの対象の属性を「項目名と値」の組で見せる時に使います。",
    "複数の項目を同じ列で見比べる時は `Table`、値をその場で書き換えさせる時は `EditableProperty` を使います。",
    "名前ごとに一つの操作が付く設定は `SettingList` を使います。",
  ],
  usage: [
    "`items` に `label` と `value` を渡します。項目名は淡いMediumの文字、値は濃い色の文字にし、各行の下に細い線を引きます。幅が22rem以上では項目名と値を横に並べ、狭い時は項目名の下に値を置きます。",
    "`value` が `null`・`undefined` の時は淡い「未登録」を出し、`0` や空文字はそのまま出して、値の0と未登録を区別します。数値・日時の書式は利用側で決め、日時は `time` 要素で渡せます。`value` には段落やリンクなどの要素も渡せ、`description` は値の下に淡く添えます。",
    "`icon` にアイコン（塗りつぶしの `Icon` など）を渡すと、項目名の前に淡い色の丸に入れて添えます。丸の色は `accent`（`blue`・`green`・`amber`・`coral`）で選びます。",
    "controllerを持たないので、JavaScriptなしでも同じように表示されます。",
  ],
  accessibility: [
    "ルートは `dl` で、項目名は `dt`、値は `dd` として読み上げます。",
    "`icon` の丸は読み上げから外します。アイコンに項目名以外の意味を持たせないでください。",
  ],
} satisfies ComponentDoc;
