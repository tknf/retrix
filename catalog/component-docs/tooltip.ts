import type { ComponentDoc } from "../reference";

export default {
  id: "tooltip",
  name: "Tooltip",
  description: "操作に添える短い補足を、ホバーとフォーカスで表示します。",
  api: ["Tooltip"],
  guidance: [
    "操作の意味を一言で補う時や、アイコンだけの操作に名前を見せる時に使います。",
    "リンクや操作を含む補足、読んでから操作する説明は、`Popover` や画面上の文にします。ホバーを外すと消える補足には、欠かせない情報を置きません。",
    "リンクや対象の概要を、操作できるパネルで見せる時は `HoverCard` を使います。",
  ],
  usage: [
    "`trigger` は属性を受け取って操作を描く関数です。受け取った属性を、`Button` や `ActionLink` などフォーカスできる一つの操作へそのまま渡します。`id` は画面内で一意にします。",
    "`TooltipController` を `tooltip` として登録すると、ホバー時とフォーカス時に、`delay` のミリ秒の後で補足を出します。ポインターとフォーカスが操作と補足の両方から離れると閉じます。操作と補足の間の隙間は補足の一部として扱うので、操作から補足の上へポインターを移しても閉じません。",
    "`text` は短い一文にし、リンクや操作を入れません。補足の中にフォーカスできる要素があると、controllerは働かず、コンソールに警告を出します。",
    "補足は1pxの灰色（#bbb）の枠・角丸2px・小さな影を持つ白いパネルに11pxの文字で書き、操作の中央の下に出し、収まらなければ上や反対側へ回り込みます。幅は20remを上限にします。CSSのアンカーに対応しない環境では画面の下の中央に出します。",
    "JavaScriptなしでは補足は出ません。補足の文は `aria-describedby` で操作の説明として読み上げられます。",
  ],
  keyboard: [
    ["Tab（操作へ）", "操作にフォーカスすると、補足を出します。"],
    [
      "Escape",
      "開いている補足を閉じます。ポインターを離すかフォーカスを外すまで、同じ操作では再び出しません。",
    ],
  ],
  accessibility: [
    '補足は `role="tooltip"` で、操作の `aria-describedby` に結び付けます。操作の名前ではなく説明として読み上げます。',
    "補足はフォーカスを受け取りません。操作の名前は、操作自身の文言か `aria-label` で付けます。",
  ],
  events: [
    [
      "tooltip:beforetoggle",
      "補足を出す・閉じる直前。取り消せます。`detail` は `open`（次の状態）・`previousOpen`・`reason`（`pointer` または `keyboard`）です。",
    ],
    ["tooltip:toggle", "補足を出した・閉じた後。`detail` は `tooltip:beforetoggle` と同じです。"],
  ],
} satisfies ComponentDoc;
