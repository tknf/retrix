import type { ComponentDoc } from "../reference";

export default {
  id: "dialog",
  name: "Dialog",
  description: "今の画面を離れずに、操作の影響や内容を確認します。",
  api: ["Dialog"],
  guidance: [
    "削除や公開の前の確認、短いフォームの入力のように、答えるまで背後の画面を操作させない時に使います。",
    "背後の操作を妨げない補足や小さな操作は `Popover`、リンクや対象の概要を近くに見せる時は `HoverCard` を使います。",
    "影響のある操作を設定画面に並べる時は `DangerZone` に置き、確認にこの `Dialog` を渡します。",
    "長い手順や、ほかの画面と行き来する作業は、ダイアログに詰めず作業面のページにします。",
  ],
  usage: [
    "`DialogController` を `dialog` として登録します。`id` は画面内で一意にします。閉じたネイティブの `dialog` と開く操作を出力し、開く操作を押すとモーダルで開きます。",
    "パネルは輪郭と影を持つ白いパネル（角丸4px）で、見出し・本文・操作欄に分け、長い本文は本文だけをスクロールします。見出しは `Section` と同じ赤茶の通常の太さの18pxの文字で、その下に罫線を一本引いて本文と分けます。操作欄は末尾側に揃えます。見出しの行の末尾に閉じる操作を置き、`closeLabel` はその名前です。`actions` を渡すと、操作欄の先頭に `closeLabel` の文言の閉じる操作を置き、その後ろに `actions` を並べます。",
    '操作欄の操作で閉じるには `data-dialog-target="close"` を付けます。確認の後の保存・削除・通信は利用側が行い、`dialog:close` などのイベントや、操作の `onclick` で受け取ります。',
    'フォームを載せる時は、`form` に `method="dialog"` を付けると、入力が有効な時だけ送信で閉じます。送信で閉じる時も `dialog:beforeclose`・`dialog:close` を発火し、`dialog:beforeclose` を取り消すと開いたままにします。`initialFocus` を `content` にし、最初に入力する欄に `autofocus` を付けます。本文の外の操作欄から送る時は、送信の `Button` に `form` でフォームのidを渡します。',
    "`size` はパネルの幅の上限で、`compact` は26rem、`default` は32rem、`wide` は52remです。画面が狭い時は、画面の幅から余白を引いた幅に収めます。",
    "幅40rem以下のタッチ画面では、下端に付くシートとして下から滑り上げて出し、上端に灰色の短いハンドルを置きます。上端のハンドルと見出しを下へ引くと閉じます（少し動かしただけでは閉じません）。",
    "開いている間は背後を半透明の濃い灰色で覆って暗くし、Escape・閉じる操作・背景を押すと閉じ、フォーカスを開いた操作へ戻します。JavaScriptなしでは開きません。",
  ],
  keyboard: [
    [
      "Enter / Space（開く操作）",
      "ダイアログを開き、見出し（`initialFocus` が `content` なら本文の `autofocus` の欄）へ移ります。",
    ],
    ["Tab / Shift+Tab", "ダイアログの中の操作だけを巡ります。"],
    ["Escape", "ダイアログを閉じ、開いた操作へフォーカスを戻します。"],
  ],
  accessibility: [
    "パネルはネイティブのモーダル `dialog` で、見出しを名前（`aria-labelledby`）、`description` を説明（`aria-describedby`）にします。背後の画面は操作できず、読み上げからも外れます。",
    '開く操作は `aria-haspopup="dialog"`・`aria-controls`・`aria-expanded` を持ちます。',
    '既定では見出しへフォーカスを移し、読み上げが題名から始まるようにします。見出しは `tabindex="-1"` で、Tabの巡回には入りません。',
    "見出しの横の閉じる操作はアイコンだけなので、`closeLabel` を `aria-label` にします。",
  ],
  events: [
    [
      "dialog:beforeopen",
      "開く操作を押した直後、開く前。取り消せます。`detail.reason` は `pointer` または `keyboard` です。",
    ],
    ["dialog:open", "開いた後。`detail.reason` は `dialog:beforeopen` と同じです。"],
    [
      "dialog:beforeclose",
      '閉じる前。取り消せます（`preventDefault()` で開いたままにします）。`detail.reason` は `pointer`（閉じる操作や背景を押した時）・`keyboard`（Escapeや、キーで閉じる操作を押した時）・`swipe`（シートを下へ引いた時）・`submit`（`method="dialog"` のフォームを送信した時）、`detail.returnValue` は閉じた時の値（送信で閉じた時は送信した操作の `value`）です。背景を押した時は、ブラウザが `closedby` に対応しているかによらず `pointer` です。',
    ],
    ["dialog:close", "閉じた後。`detail` は `reason` と `returnValue` です。"],
  ],
  propNotes: {
    Dialog: {
      children: "本文。長い時は本文だけをスクロールする。",
    },
  },
} satisfies ComponentDoc;
