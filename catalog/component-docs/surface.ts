import type { ComponentDoc } from "../reference";

export default {
  id: "surface",
  name: "Surface",
  description:
    "机の上に置く白いシート（作業面）です。AppShellの作業面と同じ見た目で、AppShellを使わない画面で使います。",
  api: ["Surface"],
  guidance: [
    "`AppShell`を使わない画面や`Wing`の中央で、画面の中身を白いシートにまとめる時に使います。見た目は`AppShell`の作業面と同じで、角丸3pxの白い面に枠を引かず、四方へ同じ量（約6px）のぼかしの影を付けます。",
    "一件の内容のカードは`Card`、役割の色を持つ知らせは`Notice`を使います。作業面の中に作業面を重ねません。",
  ],
  usage: [
    "作業面の最小の高さは画面の高さ（100dvh）です。内容が短くても画面の下端まで白い面を伸ばし、長い内容はページのスクロールで読みます。高さを制限した領域に置く場合は、利用側のCSSで`min-block-size`を上書きします。",
    "`children`を本文として、シートの内側の余白（上下24px・左右32px）を取って置きます。本文の段の間は16pxです。",
    "`context`に`ContextBar`を渡すと、シートの上端にパンくずと補助操作のバーを置き、本文をそのすぐ下から始めます。バーは区切り線を持たず、本文と同じ左右の余白に揃います。",
    '`layout="document"`は、本文とパンくずを42remの行長に収め、広いシートでは左右の余白を広げます。記事や資料など、読む画面に使います。',
    "シートの幅が40rem未満では、内側の余白を上下20px・左右16pxに詰めます。",
  ],
  propNotes: {
    Surface: {
      children: "作業面の本文。",
    },
  },
} satisfies ComponentDoc;
