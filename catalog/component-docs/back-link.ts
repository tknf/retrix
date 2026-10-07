import type { ComponentDoc } from "../reference";

export default {
  id: "back-link",
  name: "BackLink",
  description: "一つ上の階層へ戻るためのリンクです。",
  api: ["BackLink"],
  guidance: [
    "詳細の画面から、一つ上の場所（一覧や設定など）へ戻るだけのリンクを、画面の先頭側の角に置く時に使います。",
    "階層を並べて見せる時は`Breadcrumb`、現在地と操作を一緒に置く時は`ContextBar`を使います。",
  ],
  usage: [
    "`href`と`label`（戻る先の名前）を渡します。戻る向きのアイコンと太字の名前を並べたリンクになります。",
    '`tone="filled"`は淡い青のピル、`tone="plain"`は面を持たない太字の文字です。',
    "`shortcut`は名前の後にショートカットキーの表示を添えるだけです。キーの登録と、押した時の移動は利用側で行います。",
    "長い名前は折り返します。右から左へ書く言語ではアイコンの向きを反転します。",
  ],
  accessibility: [
    "ルートは`a`で、読み上げ名は`label`です。",
    "ショートカットキーの表示は`aria-hidden`で読み上げません。キーを伝える時は、`aria-keyshortcuts`を利用側で渡します。",
  ],
} satisfies ComponentDoc;
