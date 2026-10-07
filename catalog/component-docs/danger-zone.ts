import type { ComponentDoc } from "../reference";

export default {
  id: "danger-zone",
  name: "DangerZone",
  description: "削除や公開の取り消しなど、影響の大きい操作を説明と一緒にまとめます。",
  api: ["DangerZone"],
  guidance: [
    "設定画面の末尾などに、削除・公開の停止・所有者の変更のような影響の大きい操作を、通常の保存と分けて置く時に使います。",
    "押した後の確認は `Dialog` を `actions` に渡して挟みます。取り消せない操作では、確認に対象の名前や件数を書きます。",
    "影響のある操作が並ぶ時は、一つの操作に一つの `DangerZone` を使い、影響の小さい順に並べます。",
    "操作を伴わない注意の文は `Notice` を使います。",
  ],
  usage: [
    "`title` で操作名、`description` で影響、`actions` で `Button`・`ActionLink`・`Dialog` を渡します。`children` には追加の説明やフォームを入れ、説明と操作の間に置きます。",
    "先頭側の罫線で通常の設定と分け、背景は塗りません。題名は濃い色の太字にし、赤は危険の色で塗った操作の一か所だけにします。操作は説明の下に並べ、幅が足りなければ折り返します。`children` や `actions` が無い時は、その段を詰めます。",
    "`DangerZone` 自体にcontrollerの登録は要りません。確認に `Dialog` を使う時は `DialogController` を登録します。",
    "削除などの処理・権限の判定・状態の更新は利用側が行います。処理中は操作に `busy` を渡し、失敗した時は `Notice` を `children` に入れて伝えます。",
  ],
  accessibility: [
    "題名は `h2` です。置く場所の見出しの階層に合わせて、画面の構成を確かめます。",
    "権限などで押せない時は、理由の文を `children` に置き、操作の `aria-describedby` で結び付けます。",
    "強制カラーモードでは、全体を枠で囲みます。",
  ],
  propNotes: {
    DangerZone: {
      children: "説明と操作の間に置く、追加の説明やフォーム。",
    },
  },
} satisfies ComponentDoc;
