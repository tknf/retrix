import type { ComponentDoc } from "../reference";

export default {
  id: "card",
  name: "Card",
  description: "関連する内容と操作を一つにまとめます。",
  api: ["Card"],
  guidance: [
    "予定・記事・依頼のように、一件の項目を題名・本文・補足で一枚のカードにまとめて表示する時に使います。",
    "見出しをカードの外の層に置き、一覧や属性のまとまりを載せる時は `LayerCard`、作業面の中を区切るだけの時は `Section` を使います。",
    "一覧の中の一件を行で見せる時は `DataList` を使います。",
  ],
  usage: [
    "`title` は見出しの `h3` になります。`href` を渡すと見出しだけをリンクにし、カード全体をクリック対象にはしません。本文や `footer` に置いたリンク・ボタン・フォームは、見出しのリンクと独立して操作できます。見出しのリンクにホバーすると、カードの影が少し強くなります。",
    '中身は上から `preview`（画像や図）、`eyebrow`（小さな補足）、`title`、本文（`children`）、`footer` の順に積みます。`preview`・`eyebrow`・`footer` は渡した時だけ表示します。`footer` に並べた子は縦の罫線で区切り、`class="end"` を付けた子は末尾側へ寄せます。',
    'ルートの `article` に `data-density="compact"` を付けるとカードの余白を詰めます。`data-state="complete"` は完了を淡い成功色の背景で示し、`data-state="new"` は現れた時に黄色の枠線を一度だけ表示して消します（動きを減らす設定では表示しません）。',
    "長い題名や URL はカードの幅で折り返し、カードからはみ出しません。controllerを持たないので、JavaScriptなしでも同じように表示・操作できます。",
  ],
  accessibility: [
    "ルートは `article`、題名は `h3` です。ページの見出しの階層に合わない場合は、配置する側で見出しの構成を調整してください。",
    "リンクは見出しだけに付くので、読み上げではリンクの名前が題名になります。",
    "`preview` に画像を渡す時は、意味のある画像なら `alt` を、飾りなら空の `alt` を利用側で付けてください。",
  ],
  propNotes: {
    Card: {
      children: "本文。段落・Badge・ボタンなど任意の内容を渡せ、題名の下に積む。",
    },
  },
} satisfies ComponentDoc;
