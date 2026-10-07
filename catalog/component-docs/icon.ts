import type { ComponentDoc } from "../reference";

export default {
  id: "icon",
  name: "Icon",
  description: "操作や用途を表す文言に添えるアイコンです。",
  api: ["Icon"],
  guidance: [
    "操作名や項目名の前に置き、文言を補う時に使います。アイコンだけで意味を伝えません。",
    "縦に並ぶ一覧のように、塗ったアイコンで項目を見分ける場所では `fill` の塗りつぶしの版を使います。",
    "アイコンだけのボタンは、`Button` に `aria-label` を付けて作ります。",
    "`Button`・`ActionLink` の中では、`Icon` を文言の前にそのまま置きます。アイコンと文言の間隔と縦の配置は `Button` が持つので、クラスは要りません。",
  ],
  usage: [
    "`name` にアイコンの名前を渡します。Phosphor Icons（MIT）のregularを共通で使い、`fill` で同じ絵柄の塗りつぶしの版にします。",
    '大きさは文字に合わせた1em、`data-size="small"` は6em/7です。14pxの文字なら14px・12pxの枠になります。名前による大きさや太さの分岐はありません。大きなショートカットや空状態の図は、その役割を持つ親要素が大きさを決めます。色は文字の色を継ぎます。',
    "`Icon` は外部のSVGスプライトを `<use>` で参照します。pathを出現箇所ごとに埋め込まないので、HTMLが重複せず、スプライトは共通のリソースとしてキャッシュできます。パッケージの `@tknf/retrix/icons.svg`（`dist/icons.svg`）を、アプリと同じオリジンに置きます。既定のURLは `/assets/rx-icons.svg` で、別の場所に置いた時は `sprite` で指定します。キャッシュ期間は利用側のHTTPヘッダーで決めます。",
    'JavaScriptは使いません。CSSだけで使う時も、`class="rx-icon"`・`viewBox="0 0 256 256"`・`aria-hidden="true"`・`focusable="false"` の `svg` に `<use href="/assets/rx-icons.svg#rx-pencil">` を書きます。塗りつぶしの版は `#rx-pencil-fill` です。',
    "Checkbox・TaskListのチェックマークとSelectの矢印は、同じ素材から作った単独のSVGをCSSのmaskや背景として使います。",
    "使える名前は `src/internal/icon-manifest.json` で決まります。キーが `name` に渡す名前、値がPhosphor Iconsの元の名前です。追加する時はこのファイルに書き、`vp run icons:build` でスプライト・CSS用の単独SVG・`IconName` 型を作り直します。スプライトの中と `dist/PHOSPHOR-LICENSE` に、MITの著作権・許諾文を同梱しています。",
  ],
  accessibility: [
    '`Icon` は `aria-hidden="true"`・`focusable="false"` で、読み上げとフォーカスから外れます。',
    "意味は隣の文言か、操作の `aria-label` で伝えます。",
  ],
} satisfies ComponentDoc;
