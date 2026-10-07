import type { ComponentDoc } from "../reference";

export default {
  id: "copy-field",
  name: "CopyField",
  description: "コピーして使う値を表示する欄と、コピーボタンです。",
  api: ["CopyField"],
  guidance: [
    "公開リンクや招待リンク、APIキーのように、ほかの場所へコピーして使う値を見せる時に使います。",
    "書き換える値は `Field` と `Input`、長いコードの断片をコピーする時は `CodeBlock` を使います。",
  ],
  usage: [
    "`value` を読み取り専用の欄に出し、欄の末尾にコピーボタンを置きます。コピーできるとアイコンが緑の、ペンで描くチェックに変わり、1.8秒ほどで元のアイコンに戻ります。長い値は欄の中で省略します。",
    "`actions` には、リンクを作り直すなどの操作をコピーボタンの後に並べます。作り直した値の取得と保存は利用側が行い、新しい `value` で再描画します。",
    "欄に `name` は無く、フォームで送信しません。",
    "コピーの処理は `ClipboardController`、コピーした時のアイコンと読み上げは `CopyFieldController` が持つので、`clipboard` と `copy-field` の両方を登録します。コピーボタンはcontrollerが接続してから表示し、クリップボードへ書き込めないブラウザでは隠したままにします。コピーできなかった時はアイコンを変えず、欄の下にアイコンと赤茶の文で `failedLabel`（既定は「コピーできませんでした。欄の値を選んでコピーしてください。」）を出し、次にコピーの操作をするまで残します。",
    "欄にフォーカスすると値を全て選ぶので、キーボードではそのままブラウザのコピー機能でもコピーできます。",
    "JavaScriptが無い時は、コピーボタンを表示しません。欄の値を選んで、ブラウザのコピー機能でコピーします。",
  ],
  accessibility: [
    "コピーボタンはアイコンだけのボタンで、`copyLabel` を読み上げ名とツールチップにします。",
    'コピーできた時は `copiedLabel`、コピーできなかった時は `failedLabel` を、見えない `role="status"` の領域で読み上げます。コピーできなかった通知は色だけでなく、アイコンと文でも示します。',
  ],
  events: [
    [
      "clipboard:beforecopy",
      "コピーする前に発火します。取り消せます。detailは `text`（コピーする値）・`source`・`reason`（`pointer` か `keyboard`）です。",
    ],
    [
      "clipboard:copy",
      "コピーを終えた後に発火します。detailは `text`・`source`・`reason`・`ok`（コピーできたか）・`error`（コピーできなかった時の `DOMException`）です。",
    ],
  ],
} satisfies ComponentDoc;
