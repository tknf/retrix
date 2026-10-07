import type { ComponentDoc } from "../reference";

export default {
  id: "error-summary",
  name: "ErrorSummary",
  description: "送信時のエラーと、修正する欄へのリンクをまとめます。",
  api: ["ErrorSummary"],
  guidance: [
    "フォームの送信に失敗した時、直すところをフォームの上にまとめ、各欄へ移れるようにする時に使います。",
    "一つの欄のエラーは、その欄の `Field` の `error` で示します。ErrorSummaryはその一覧で、欄のエラーの代わりにはしません。",
    "送信以外の注意や失敗を知らせる時は `Notice` や `Toast` を使います。",
  ],
  usage: [
    "送信に失敗した時だけ描き、`errors` に直すところを並べます。`label` は直し方の文、`href` は直す欄のidを指す `#id` です。`errors` が空の時は何も描きません。",
    "見た目は `Notice` の `danger` の役割（淡い赤の面に、1pxで下だけ3pxの淡い赤の枠、角丸4px、一行目に赤いアイコンと赤い太字の見出し）で、ErrorSummaryは直す欄へのリンクの一覧だけを持ちます。リンクは赤い文字に下線を引き、先頭に赤い小さな点を置きます。ホバーすると濃い赤にします。",
    '表示した時にErrorSummaryへフォーカスを移します。`tabindex="-1"` を持つので、送信の後にサーバーで描き直すページでは `autofocus` を渡すと、JavaScriptなしでも読み込んだ時に移ります。読み込んだ後にスクリプトで出す時は、`autofocus` は働かないので `focus()` で移します。各入力にも `Field` の `error` でエラーを関連付けます。',
    "入力の検証と、サーバーから返ったエラーを欄へ対応させるのは利用側です。JavaScriptは使いません。",
  ],
  accessibility: [
    "`aside` で、`title` を読み上げ名と見出し（`h2`）にします。アイコンは読み上げから外します。",
    "表示した時にフォーカスを移すと、題名と一覧を読み上げます。移さないと気付かれにくいので、`autofocus` か `focus()` で必ず移します。",
    "リンクの文は欄の名前が分かる直し方にします（「記事名を入力してください」など）。",
  ],
} satisfies ComponentDoc;
