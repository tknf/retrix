import type { ComponentDoc } from "../reference";

export default {
  id: "button",
  name: "Button",
  description: "操作の主従、無効、処理中を表します。",
  api: ["Button", "ActionLink", "ButtonGroup"],
  guidance: [
    "その場で何かを実行する操作（保存・送信・開く・削除）に `Button` を使います。",
    "別のページへ移る操作は、同じ見た目の `ActionLink` を使います。移動を `Button` の `onclick` で行いません。",
    "画面の主操作は一つだけ `primary` にし、ほかは `secondary` にします。取り返しのつかない操作は `danger`、文中や一覧の軽い操作は `link` にします。",
    "続けて使う関連の操作を一つのまとまりに見せる時は `ButtonGroup`、主操作にほかのやり方を▾で添える時は `SplitButton` を使います。",
    "格子に並べるアイコンと名前のタイルは `ActionTile`、対象への操作を矢印キーで移動できる一つの並びにする時は `Toolbar` を使います。",
  ],
  usage: [
    '`Button` は既定で `type="button"` の `button` を出力します。フォームを送る時は `type="submit"`、戻す時は `type="reset"` を渡します。`name`・`value`・`form`・`onclick`・`data-*` などの標準の属性は、そのまま `button` に渡ります。',
    '文字は操作の段（`--rx-label`、12px）で、行高は17pxです。`default` と `compact` の高さは22pxで、`compact` は左右の余白だけを11pxから7pxに狭めます。`large` は文字を14px・行高を20px・高さを32pxにし、フォーム末尾などの大きな操作に使います。タッチ操作の環境では、高さを2.75rem以上にします（`size="tag"` のアイコンだけの操作は除きます）。`tag` はTagの中の解除操作のための大きさです。',
    "形はどれも角の小さな長方形で、`variant` は平らな塗りの色で役割を分けます。グラデーションは使いません。`secondary` は白い面に1px `#ccc` の枠、下にぼかしの無い1px `#ddd` の影を付け、角丸は5px（`--rx-radius-control`）です。`primary` は緑の面に白い太字、`danger` は赤の面に白い文字で、どちらも枠と下の1pxの影を塗りより濃い同じ色にし、角丸は4pxです。`data-current` を付けた選んでいる操作は、チェックボックスの選んだ状態と同じ淡い青の縦の塗りに紺の縁と紺の文字にします。`link` は面も枠も持たず、本文のリンクと同じ青緑の文字に1pxの下線を引き、ホバーすると赤になります。ホバーすると面がわずかに灰色になって枠が濃くなり（塗りのある操作は塗りが濃くなり）、押すと内側へへこみます。`disabled` の操作は形・枠・塗りをそのままにして文字だけを灰色にします。白い文字の `primary`・`danger` は、`secondary` と同じ白い面に灰色の文字にします。",
    '`Icon` は文字の前にも後にも置けます。アイコンだけの操作は `data-icon-only="true"` を付けて正方形にし、`aria-label` で操作名を付けます。`title` はマウス向けの補助で、`aria-label` の代わりにはなりません。',
    '`busy` を渡すと、アイコンを含む内容を `busyLabel` に置き換え、`disabled`・`aria-busy="true"`・`data-busy="true"` を付けます。処理中は、控えめな操作の面を淡い灰色にし、カーソルを待機中の形にします。動きは付けません。処理の開始と終了、つまり `busy` の切り替えは利用側が行います。',
    "`ActionLink` は `href` を持つ `a` を `Button` と同じ見た目で出力します。`disabled` は持たないので、移動できない時はリンクを出さないか、`disabled` の `Button` に置き換えます。",
    "`ButtonGroup` は隣り合う `Button` の向き合う角を落とし、枠を重ねて一つにつなげます。最後に `iconOnly` の `DropdownMenu` を置くと、主操作と▾の組み合わせになります。`primary` の▾の前には白く透かした区切りを入れます。",
    "`Button` の文字・太さ・行高・上下の余白・縦配置は `button.css` が持ちます。ほかのコンポーネントのCSSや利用側のCSSから、`font` の一括指定・太さ・行高・上下の余白・文字の移動で上書きしないでください。大きさは `size`、余白の違いは `compact` で選びます。",
  ],
  accessibility: [
    "`Button` はネイティブの `button`、`ActionLink` は `a` なので、EnterとSpace（リンクはEnter）で押せ、フォーカスした時は入力欄と同じ青い縁と外側の淡い青の輪を出します。",
    "アイコンだけの操作には必ず `aria-label` を付けます。",
    "`disabled` と `busy` の操作はフォーカスできなくなります。押せない理由を伝える時は、画面に理由の文を置き、`aria-describedby` で結び付けます。",
    '`ButtonGroup` は `role="group"` で、`label` をまとまりの名前として読み上げます。',
    '強制カラーモードでは塗りと影を外し、`data-current="true"` の操作だけを強調色で示します。',
  ],
  propNotes: {
    Button: {
      disabled: "押せなくする。形と枠はそのままで文字だけが灰色になり、フォーカスできなくなる。",
      type: "`button` の種類。フォームを送る時は `submit`、戻す時は `reset` にする。",
      children: "操作の文言。`Icon` を文字の前後に置ける。`busy` の時は `busyLabel` に置き換わる。",
    },
    ActionLink: {
      children: "リンクの文言。`Icon` を文字の前後に置ける。",
    },
    ButtonGroup: {
      children: "つなげる `Button`。最後に `iconOnly` の `DropdownMenu` を置ける。",
    },
  },
} satisfies ComponentDoc;
