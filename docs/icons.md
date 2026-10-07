# アイコン

Retrixは[Phosphor Icons](https://github.com/phosphor-icons/core)（MIT）のregularを共通で使います。縦並びの一覧のように塗りつぶしのアイコンで項目を見分ける場所では、同じ絵柄の塗りつぶしの版（`fill`）を使います。

## 大きさ

- 標準は1em、小型（`data-size="small"`）は6em/7です。14pxの文字なら14px・12pxのSVG枠になります。
- アイコン名によるサイズ・ウェイトの分岐はありません。大きなショートカットや空状態の図は、その役割を持つ親要素が大きさを決めます。
- Checkbox・TaskListのチェックマーク、Selectの矢印は、同じ素材の単独SVGをCSSのmask・背景として使います。

## 使い方

Honoでは`Icon`を使います。

```tsx
import { Icon } from "@tknf/retrix/hono";

const Label = () => (
  <span>
    <Icon name="pencil" /> 編集する
  </span>
);
const Filled = () => <Icon name="calendar" fill />;
```

`Icon`は外部SVGスプライトを`<use>`で参照します。各出現箇所にpathを埋め込まないので、HTMLが重複せず、スプライトは共通のリソースとしてキャッシュできます。アイコン用のJavaScriptは不要で、JavaScriptが無効でも表示されます。

CSSだけで使う場合も同じ構造を書きます。

```html
<svg class="rx-icon" viewBox="0 0 256 256" aria-hidden="true" focusable="false">
  <use href="/assets/rx-icons.svg#rx-pencil"></use>
</svg>
```

塗りつぶしの版は`#rx-pencil-fill`です。

## 配置

- パッケージの`@tknf/retrix/icons.svg`（`dist/icons.svg`）を、利用するアプリと同じオリジンへ配置します。既定のURLは`/assets/rx-icons.svg`です。
- 配置先が異なる場合は`<Icon name="pencil" sprite="/static/icons.svg" />`のように指定します。
- キャッシュ期間は利用側のHTTPヘッダーで設定します。
- スプライトの中と`dist/PHOSPHOR-LICENSE`にMITの著作権・許諾文を同梱しています。

## アクセシビリティ

`Icon`は装飾として読み上げから外します。アイコンだけで意味を伝えず、操作名を隣に置いてください。アイコンだけのボタンを作る場合は、利用側でアクセシブルな名前を付けます。

## 使えるアイコン

使えるアイコンは[icon-manifest.json](../src/internal/icon-manifest.json)で決まっています。キーが`name`に渡す名前、値がPhosphor Iconsの元の名前です。追加する場合はこのファイルに追記し、`vp run icons:build`でスプライト、CSS用の単独SVG、`IconName`型を生成し直します。
