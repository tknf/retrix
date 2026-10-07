import type { ComponentDoc } from "../reference";

export default {
  id: "surface",
  name: "Surface",
  description:
    "中央の作業面です。作業の内容を1枚の白い面にまとめます。AppShellの作業面と同じ見た目で、AppShellを使わない画面で使います。",
  api: ["Surface"],
  guidance: [
    "`AppShell`を使わない画面や`Wing`の中央で、仕事の中身を一枚の白い作業面にまとめる時に使います。見た目は`AppShell`の作業面と同じです。",
    "一件の内容のカードは`Card`、役割の色を持つ知らせは`Notice`を使います。作業面の中に作業面を重ねません。",
  ],
  usage: [
    "`children`を本文として、一律の余白を取った面に置きます。本文の段の間は16pxです。",
    "`context`に`ContextBar`を渡すと、面の上端にパンくずと補助操作のバーを置き、本文をそのすぐ下から始めます。バーは区切り線を持たず、本文と同じ左右の余白に揃います。",
    '`layout="document"`は、本文とパンくずを42remの行長に収め、広い面では左右の余白を広げます。記事や資料など、読む画面に使います。',
    "面の幅が40rem未満では、左右の余白を詰めます。",
  ],
  propNotes: {
    Surface: {
      children: "作業面の本文。",
    },
  },
} satisfies ComponentDoc;
