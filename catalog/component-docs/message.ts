import type { ComponentDoc } from "../reference";

export default {
  id: "message",
  name: "Message",
  description: "投稿者・時刻・本文を、決まった順序で表示します。",
  api: ["Message"],
  guidance: [
    "コメント・チャット・メールのスレッドのように、誰がいつ何を書いたかを一件ずつ見せる時に使います。",
    "受信した連絡を件名とプレビューで並べて選ばせる時は `MessageList`、出来事を時刻の順に並べる時は `Timeline` を使います。",
    "入力欄は `Composer` を組み合わせます。",
  ],
  usage: [
    "`author`・`time`・`datetime` を渡し、本文を `children` に書きます。見出しの行は名前、時刻（`time` 要素）の順で、名前は本文と同じ大きさ（14px）の黒い太字、時刻は12pxの茶色の文字です。本文は続けて読む文章の大きさ（`--rx-reading`、14px）の黒です。`avatar` は名前の行の横の2remの列に置き、`conversation` では本文・操作・返信をその列の後ろから書きます。",
    '既定の `layout="conversation"` は、本文を吹き出しにせず、作業面の上にそのまま書きます。誰の言葉かはアバターと名前の行で示します。幅は48remまでです。`layout="document"` は一通を白いカード（枠なし、四方へ4〜5pxのぼかしの影、角丸3px）に書き、日付を見出しの行の終わりに寄せ、本文をカードの幅いっぱいに読ませます。`document` の `Message` を続けて置くと、カードの間の角を立てて1px重ね、一枚のカードの続きに見せます。',
    "`actions` は本文の下に、`replies` はさらにその下に置きます。`replies` には返信の `Message` を並べ、親と返信の両方に `avatar` がある時は、親のアバターの下から2pxの淡い灰色の線を下ろし、角を丸めて曲げた線で返信のアバターにつなぎます。",
    "幅が20rem未満の `Message` では、アバターを名前の行の横だけに置き、本文と操作をアバターの下から全幅で表示します。本文の長い URL は本文の幅で折り返します。",
    "送信・既読・返信・リアクションのデータと保存は利用側が持ちます。controllerを持たないので、JavaScriptなしでも同じように表示されます。",
  ],
  accessibility: [
    "ルートは `article` で、名前は `strong`、時刻は `datetime` 付きの `time` 要素です。",
    "`avatar` は読み上げから外します（名前は `author` で読むため）。アバターに名前以外の意味を持たせないでください。",
    "`actions` のボタンには、どの投稿への操作か分かる名前を付けてください。同じ文言のボタンが並ぶ時は `aria-label` で投稿者などを補います。",
  ],
  propNotes: {
    Message: {
      children:
        "本文。段落・FileItemなど任意のHTMLを渡せる。conversationでは名前の行の下に、documentではカードの全幅に入れる。",
    },
  },
} satisfies ComponentDoc;
