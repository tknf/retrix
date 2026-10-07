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
    '文字は操作の段（`--rx-label`、画面幅に応じて13.5〜14px）です。`default` と `compact` の高さは文字の18/7倍（14pxの時36px）で、`compact` は左右の余白だけを1.25emから0.875emに狭めます。`large` は文字を8/7倍（16px）、高さを2.5em（40px）にし、フォーム末尾などの大きな操作に使います。タッチ操作の環境では、高さを2.75rem以上にします（`size="tag"` のアイコンだけの操作は除きます）。`tag` はTagの中の解除操作のための大きさです。',
    "`variant` は塗りの色で役割を分け、形はどれもピルです。`primary` は青、`danger` は赤の塗り、`secondary` は白い面と枠、`link` は面も枠も持たない青い文字です。ホバーすると面が少し濃くなり、押すと内側へへこみます。`disabled` の操作は斜線の面と淡い文字にします。",
    '`Icon` は文字の前にも後にも置けます。アイコンだけの操作は `data-icon-only="true"` を付けて正方形にし、`aria-label` で操作名を付けます。`title` はマウス向けの補助で、`aria-label` の代わりにはなりません。',
    '`busy` を渡すと、アイコンを含む内容を `busyLabel` に置き換え、`disabled`・`aria-busy="true"`・`data-busy="true"` を付けます。処理中は斜線にせず、カーソルを待機中の形にします。処理の開始と終了、つまり `busy` の切り替えは利用側が行います。',
    "`ActionLink` は `href` を持つ `a` を `Button` と同じ見た目で出力します。`disabled` は持たないので、移動できない時はリンクを出さないか、`disabled` の `Button` に置き換えます。",
    "`ButtonGroup` は隣り合う `Button` の向き合う角を落とし、枠を重ねて一つにつなげます。最後に `iconOnly` の `DropdownMenu` を置くと、主操作と▾の組み合わせになります。`primary` の▾の前には白い区切りを入れます。",
    "`Button` の文字・太さ・行高・上下の余白・縦配置は `button.css` が持ちます。ほかのコンポーネントのCSSや利用側のCSSから、`font` の一括指定・太さ・行高・上下の余白・文字の移動で上書きしないでください。大きさは `size`、余白の違いは `compact` で選びます。",
  ],
  accessibility: [
    "`Button` はネイティブの `button`、`ActionLink` は `a` なので、EnterとSpace（リンクはEnter）で押せ、フォーカスした時は青いフォーカスリングを出します。",
    "アイコンだけの操作には必ず `aria-label` を付けます。",
    "`disabled` と `busy` の操作はフォーカスできなくなります。押せない理由を伝える時は、画面に理由の文を置き、`aria-describedby` で結び付けます。",
    '`ButtonGroup` は `role="group"` で、`label` をまとまりの名前として読み上げます。',
    '強制カラーモードでは塗りと影を外し、`data-current="true"` の操作だけを強調色で示します。',
  ],
  propNotes: {
    Button: {
      disabled: "押せなくする。斜線の面と淡い文字になり、フォーカスできなくなる。",
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
