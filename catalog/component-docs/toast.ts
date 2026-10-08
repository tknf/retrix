import type { ComponentDoc } from "../reference";

export default {
  id: "toast",
  name: "Toast",
  description: "操作の結果を、閉じるまで読める通知として表示します。",
  api: ["Toast", "ToastStack"],
  guidance: [
    "保存・送信・コピーなど、今した操作の結果を、作業を止めずに短く知らせる時に使います。",
    "読み続けてほしい事実や注意は、本文のそばに置く `Notice` を使います。",
    "送信で直すところがある時は、入力の近くのエラーと `ErrorSummary` で示します。Toastだけに残しません。",
    "確認や判断を求める時は `Dialog` を使います。",
  ],
  usage: [
    'Toastはページに置いておき、閉じた状態（`popover="manual"`）で描きます。開くのは、`popovertarget` にToastの `id` を指したボタンか、スクリプトからの `showPopover()` です。開いてもフォーカスは移しません。閉じるボタンも、Toastを指した `popovertarget` のボタンです。`ToastController` を `toast` として登録すると、`duration` と開閉のイベントが働きます。',
    "ToastはBasecamp 2の黄色の案内と同じく、黄色（`--rx-mark`）の平らな面に1pxの濃い黄色（#eac73b）の枠を付け、下の枠だけを3pxにし、角丸4pxで、影は付けません。文は黒で、一行目を太字にします。`tone` で通知の種類を選びます。`info`（既定）と `success` は黄色の面のままで、`success` はアイコンを緑にします。`warning` と `danger` は面をそれぞれの役割の淡い色にし、枠とアイコンを琥珀色・赤にします。アイコンは `success` でチェック、`danger` で丸の中のバツ、他はiです。文と操作は一行に並べ、入らなければ文を先に折り返します。`actions` を渡すと、通知の文の後に操作を置きます。",
    '既定では閉じるボタンを押すまで残します。`duration` にミリ秒を渡すと、開いてからその時間で閉じます。フォーカスがToastの中にある間は数えず、外へ出てから数え直します。失敗の通知は `live="assertive"` にして自動で閉じず、重要なエラーは入力の近くや `ErrorSummary` にも残します。',
    "単独のToastは、画面下部の末尾側（左から右に読む画面では右下）に浮かべます。開閉はその場で切り替え、動きは付けません。",
    "複数のToastは `ToastStack` で囲み、`ToastStackController` を `toast-stack` として登録します。開いた順に、新しいものを手前にして重ねます。奥のToastは上へ少しずつずらして小さくし、上端へ向かって薄れる縁だけを見せます。二つ以上の時、スタックを押すと上へ広がり、外を押すかEscapeで畳みます。キーボードでフォーカスがスタックの中へ入った時も広がります。Toastの中のボタンやリンクを押しても、スタックは開閉しません。`placement` で置き場所を選びます。",
    "Toastを指した `popovertarget` のボタン（閉じるボタンを含む）を押して開閉した時は、`Dialog` と同じく、取り消せる `toast:beforeshow`・`toast:beforehide` と、`toast:show`・`toast:hide` を発火します。スクリプトからの `showPopover()`・`hidePopover()` と `duration` で開閉した時は発火しません。開き方に関わらず開閉を受け取る時は、標準の `toggle` を使います。",
    "JavaScriptが無い時も、`popovertarget` のボタンと閉じるボタンでToastを開閉できます。`duration`、開閉のイベント、重ねる動きは働きません。",
  ],
  keyboard: [
    ["Tab", "`ToastStack` の中へフォーカスが入ると、スタックを広げます。"],
    ["Escape", "広げた `ToastStack` を畳みます。Toastそのものは閉じません。"],
  ],
  accessibility: [
    '`live` に合わせて、`polite` は `role="status"`、`assertive` は `role="alert"` と `aria-live` を付けます。',
    "開いてもフォーカスを移さないので、作業を続けたまま読み上げで結果を伝えます。",
    "閉じるボタンは `closeLabel` を読み上げ名にします。",
    "操作を持つToastに `duration` を付ける時は、読んで操作するまでに閉じない長さにします。フォーカスが中にある間は閉じません。",
    "通知の色は見分けの補助です。成功か失敗かは文言で伝えます。",
  ],
  events: [
    [
      "toast:beforeshow",
      "取り消せます。`popovertarget` のボタンで開く前に発火し、`preventDefault()` で開きません。`detail` は `{ reason }` で、`reason` は `pointer` か `keyboard` です。",
    ],
    [
      "toast:show",
      "`popovertarget` のボタンで開いた後に発火します。`detail` は `toast:beforeshow` と同じです。",
    ],
    [
      "toast:beforehide",
      "取り消せます。閉じるボタンか `popovertarget` のボタンで閉じる前に発火し、`preventDefault()` で閉じません。`detail` は `toast:beforeshow` と同じです。",
    ],
    [
      "toast:hide",
      "閉じるボタンか `popovertarget` のボタンで閉じた後に発火します。`detail` は `toast:beforeshow` と同じです。",
    ],
  ],
  propNotes: {
    Toast: { children: "通知の文。アイコンの隣に表示します。" },
    ToastStack: { children: "重ねる `Toast`。Toastだけを置きます。" },
  },
} satisfies ComponentDoc;
