import type { ComponentDoc } from "../reference";

export default {
  id: "split-button",
  name: "SplitButton",
  description: "主な操作のボタンと、別の方法を選ぶ▾のボタンをつなげて並べます。",
  api: ["SplitButton"],
  guidance: [
    "「送る」に対する「送る日時を決める」「下書きとして保存」のように、主操作に同じ目的のほかのやり方を添える時に使います。",
    "主操作と関係の薄い補助の操作をまとめる時は、独立した `DropdownMenu` を使います。",
    "やり方に優先の順が無く、どれも同じ重みで選ぶ時は、`SplitButton` にせず操作を並べます。",
  ],
  usage: [
    "主操作は共通の `Button`、▾は共通の `DropdownMenu` のアイコンだけの操作です。`label` が主操作の文言、`items` が▾で開くやり方で、`items` の指定は `DropdownMenu` と同じです。▾のメニューは行の末尾側に揃えて開きます。",
    "`DropdownMenuController` を `dropdown-menu` として登録します。主操作は通常の `button` なので、controllerは要りません。",
    "`type`・`name`・`value`・`form`・`onclick`・`busy`・`busyLabel` など、`Button` へ渡す指定は主操作へそのまま渡ります。`class` だけはルートに付きます。`id` は主操作のボタンに付け、▾のメニューは `<id>-menu`、▾の操作は `<id>-menu-trigger` になります。",
    "`variant`・`size`・`disabled` は両方にかかります。`busy` の間は主操作を `busyLabel` に置き換え、▾も押せなくします。`variant` の既定は `primary` です。",
    "二つの操作は見た目だけを一体にします。向き合う側の角を落とし、間に細い区切りを入れます（塗りの操作では白く透かした線、`secondary` では枠と同じ濃い灰色の線）。ホバーした側、フォーカスのある側を手前に出します。",
    "主操作を押した時の処理は `onclick` やフォームの送信で、▾で選んだやり方は `dropdown-menu:select` の `detail.value` で受け取ります。どちらの処理も利用側が行います。",
  ],
  keyboard: [
    ["Tab", "主操作と▾は別々のTab停止点です。"],
    [
      "↓ / Enter / Space（▾）",
      "やり方のメニューを開きます。メニューの中のキーは `DropdownMenu` と同じです。",
    ],
  ],
  accessibility: [
    "▾はアイコンだけの操作なので、`menuLabel` を `aria-label` として読み上げます。やり方の中身が分かる名前にします。",
  ],
  events: [
    [
      "dropdown-menu:beforeselect",
      "▾のやり方を選ぶ直前。取り消せます。`detail` は `DropdownMenu` と同じです。",
    ],
    ["dropdown-menu:select", "▾のやり方を選んだ後。`detail.value` で選んだやり方を知らせます。"],
  ],
} satisfies ComponentDoc;
