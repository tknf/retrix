import type { ComponentDoc } from "../reference";

export default {
  id: "toggle-group",
  name: "ToggleGroup",
  description: "関連する状態を、一つまたは複数切り替えます。",
  api: ["ToggleGroup"],
  guidance: [
    "表示密度や表示する項目のように、同じ画面の見え方を切り替えるボタンのグループに使います。一つだけを選ぶ時は既定のまま、複数を選ぶ時は `multiple` を付けます。",
    "URLで一覧の条件を切り替える時は `FilterBar`、パネルを切り替える時は `Tabs` を使います。",
    "フォームで送信する値を選ぶ時は、ラジオボタンの `Choice` か `CheckboxGroup` を使います。`ToggleGroup` は値を送信しません。",
  ],
  usage: [
    "`items` を押せるボタンとして並べ、`selected` の値をオンにします。ボタンは隙間なくつなげ、間を1本の線にして外側の角だけを丸めます。オンのボタンは青緑の縦の塗りに白い文字で、内側へ沈めて示します。`value` が空白だけの項目と、重なった値の二つ目以降は出しません。",
    "既定では一つだけをオンにし、別のボタンを押すと切り替わります。オンのボタンを押してもオンのままで、`toggle-group:beforechange`・`toggle-group:change` は発火しません。`multiple` では押したボタンだけを切り替え、全てオフにもできます。",
    '`orientation="vertical"` は縦に並べ、ボタンの幅を一番長い名前にそろえます。',
    "`ToggleGroupController` を `toggle-group` として登録します。選んだ結果は `toggle-group:change` で受け取り、画面への反映や保存は利用側が行います。",
    "JavaScriptが無い時は、初期の状態を見せるだけで、押しても切り替わりません。",
  ],
  keyboard: [
    [
      "Tab",
      "グループの中の一つのボタンへ入ります。前に移ったボタン、オンのボタン、最初のボタンの順に選びます。",
    ],
    [
      "← / →（`horizontal`）",
      "前・次のボタンへ移ります。端では反対の端へ回ります。右から左へ書く時は左右が逆になります。",
    ],
    ["↑ / ↓（`vertical`）", "前・次のボタンへ移ります。端では反対の端へ回ります。"],
    ["Home / End", "最初・最後のボタンへ移ります。"],
    [
      "Enter / Space",
      "移ったボタンを切り替えます。一つだけを選ぶ時は、オンのボタンではオンのままです。",
    ],
  ],
  accessibility: [
    'グループは `role="group"` で、`label` を読み上げ名にします。',
    "各ボタンは `aria-pressed` でオン・オフを伝えます。`disabled` のボタンには移りません。",
  ],
  events: [
    [
      "toggle-group:beforechange",
      "ボタンを押して選択が変わる前に発火します。取り消せます。detailは `selected`（変わった後の値）・`previousSelected`・`reason`（`pointer` か `keyboard`）です。",
    ],
    [
      "toggle-group:change",
      "選択が変わった後に発火します。detailは `toggle-group:beforechange` と同じです。",
    ],
  ],
} satisfies ComponentDoc;
