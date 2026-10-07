import type { ComponentDoc } from "../reference";

export default {
  id: "tabs",
  name: "Tabs",
  description: "同じ場所で、関連するパネルを切り替えます。",
  api: ["Tabs"],
  guidance: [
    "同じ対象についての関連するパネル（内容・設定・履歴など）を、同じ場所で切り替える時に使います。",
    "別のページへ移る切り替えは`Navigation`、一覧の絞り込みの切り替えは`FilterBar`、長い資料の節への移動は`TableOfContents`を使います。",
    "JavaScriptがないと選んだパネルしか見えないので、利用者が必ず見る情報をタブの中だけに置きません。",
  ],
  usage: [
    "`id`・`label`・`items`を渡し、`TabsController`を`tabs`として登録します。`id`と各`value`は一意にします。",
    "初めは`selected`のタブを選びます。省略した時や、見つからない・無効なタブの時は、最初の選べるタブを選びます。選べるタブが一つもない時は、タブを出さず「利用可能な項目はありません。」を出します。",
    "タブを押すか矢印キーで移ると、すぐにそのパネルへ切り替えます。無効なタブは表示しますが、選べず、矢印キーでも飛ばします。",
    "切り替えると`tabs:beforechange`・`tabs:change`を発火します。選んだタブをURLなどに残す時は、利用側で行います。",
    "JavaScriptなしでは選んだタブのパネルだけを表示し、タブを押しても切り替わりません。",
  ],
  keyboard: [
    [
      "← / →",
      "前・次の選べるタブへ移り、そのパネルを表示します。端では反対の端へ回ります。右から左へ書く言語では向きが逆になります。",
    ],
    ["Home / End", "最初・最後の選べるタブへ移り、そのパネルを表示します。"],
    ["Tab", "選んでいるタブから、表示中のパネルへ移ります。"],
  ],
  accessibility: [
    'タブの並びは`label`を読み上げ名に持つ`role="tablist"`、各タブは`role="tab"`のボタン、パネルは`role="tabpanel"`です。タブとパネルを`aria-controls`・`aria-labelledby`で結びます。',
    '選んだタブは`aria-selected="true"`で、Tabで入るのは選んだタブだけです。パネルは`tabindex="0"`でフォーカスできます。',
  ],
  events: [
    [
      "tabs:beforechange",
      "利用者がタブを切り替える直前に発火します。`detail`は`value`・`previousValue`・`reason`（`pointer`または`keyboard`）です。取り消すと切り替えません。",
    ],
    ["tabs:change", "切り替えた後に発火します。`detail`は`tabs:beforechange`と同じです。"],
  ],
} satisfies ComponentDoc;
