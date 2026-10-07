import type { ComponentDoc } from "../reference";

export default {
  id: "search-results",
  name: "SearchResults",
  description: "題名・抜粋・補足を並べ、一致した語を強調した検索結果です。",
  api: ["SearchResults"],
  guidance: [
    "検索の結果を、題名・本文の抜粋・置き場所や日付の補足で並べ、一致した語を見つけやすくする時に使います。",
    "検索に限らない一件ずつの一覧は `DataList`、受信した連絡の一覧は `MessageList` を使います。",
    '結果を絞る条件の列は、`OptionalFields` の `layout="stack"` をページの側に並べます。検索の欄そのものは `Field` や `FilterBar` で組みます。',
  ],
  usage: [
    "`results` に `title`・`href` と、任意の `excerpt`・`meta`・`leading` を渡します。結果は罫線を引かずに行間で区切り、題名（濃い色の太字のリンク、ホバー時は青）・抜粋（二行まで）・淡い補足の順に積みます。`leading` にアバターや種類のアイコンを渡すと、先頭側の2.5remの列に置きます。",
    "`query` を渡すと、題名と、文字で渡した `excerpt` の中の一致した語を `mark` で包み、文中の強調と同じ淡い黄の面で示します。大文字と小文字は区別せず、前後の空白は無視します。`excerpt` に要素を渡した時は強調しないので、必要なら利用側で `mark` を書きます。",
    "検索の実行・結果の並び順・件数やページ送りは利用側が持ちます。0件の時は `SearchResults` を出さず、`EmptyState` などで伝えてください。controllerを持たないので、JavaScriptなしでも同じように表示・操作できます。",
  ],
  accessibility: [
    "ルートは `label` を名前に持つ `ol` で、読み上げでは結果の件数と何件目かが伝わります。",
    "一致した語は `mark` 要素なので、対応する読み上げ環境では強調として伝わります。",
    "`leading` は読み上げから外しません。`Avatar` は人の名前を読み上げ、`Icon` は自身で読み上げから外れます。それ以外の飾りを渡す時は、利用側で `aria-hidden` を付けてください。",
  ],
} satisfies ComponentDoc;
