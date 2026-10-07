---
name: retrix
description: "@tknf/retrix（Retrix）を使って、管理画面・業務システム・サービスの画面を作る時、または直す時に使う。コンポーネントの選び方、アプリの画面構成（AppShell・CommandMenu・作業面）、CSSの読み込み順と上書き、Hono JSXのコンポーネント、Stimulus controllerの登録とイベント、アイコンの配置、ButtonとInputの文字位置の注意点を扱う。"
---

# Retrixで画面を作る（`@tknf/retrix`）

Retrixは、管理画面・業務システム・一般利用者向けのサービスで使うデザインシステムです。CSSとセマンティックHTMLに、同じHTMLを出力するHono JSXのSSRコンポーネントと、開閉・選択・キーボード操作を行うStimulus controllerを加えて提供します。

コードを書く前に、インストールした版の型定義（`node_modules/@tknf/retrix`）と[コンポーネントのリファレンス](https://github.com/tknf/retrix/blob/main/docs/components/README.md)で、props・登録名・イベントを確認します。APIを推測で書きません。

## 提供する機能とimport先

| 機能                | import先                   | 使う場面                                       |
| ------------------- | -------------------------- | ---------------------------------------------- |
| CSS                 | `@tknf/retrix/css/*`       | フレームワークを問わず使う。HTMLは利用側で書く |
| Hono JSX            | `@tknf/retrix/hono`        | HonoでSSRする。CSSと同じHTMLを出力する         |
| Stimulus controller | `@tknf/retrix/controllers` | 開閉・選択・キーボード操作があるコンポーネント |
| アイコン            | `@tknf/retrix/icons.svg`   | `Icon`が参照するSVGスプライト                  |

peer dependencyは、使う機能に必要なものだけをインストールします。Hono JSXには`hono`、controllerには`@hotwired/stimulus`と`@tknf/stimulus-ui`が必要です。TypeScriptでは`jsx: "react-jsx"`と`jsxImportSource: "hono/jsx"`を指定します。

## 最初にRetrixのコンポーネントを探す

画面の要素ごとに、**Retrixのコンポーネント → Retrixのコンポーネントの組み合わせ → 独自の実装**の順に検討します。

- [references/components.md](references/components.md)の分類ごとの一覧と説明から、候補を探します。
- 候補のリファレンスの「使いどころ」で、似たコンポーネントとの違いを確認します。
- 独自に実装するのは、Retrixのコンポーネントとその組み合わせで満たせない要件がある時だけです。その要件と、確認したコンポーネントの制約を説明できるようにします。
- ボタン・入力欄・バッジなどを独自に作り直しません。既存のコンポーネントを組み合わせ、まとまった部分は別のコンポーネントとして切り出します。
- 業務データ・権限・通信・保存は、利用するアプリが担当します。Retrixが担当するのは表示と操作だけです。

## アプリの画面構成

アプリの画面は`AppShell`で作ります。

- 上部中央に`CommandMenu`を一つ置き、中央に作業面を置きます。
- 常に表示するサイドバーは置きません。
  - 作業面を補助する内容は、`Wing`（作業面の左右に開閉するパネル）に置きます。
  - 同じ領域のページの切り替えには、作業面の中に置いた`Navigation`や`Tabs`を使います。
- 作業面の幅は`AppShell`の`size`で、画面の中身に合わせて選びます。
  - 設定画面など入力が中心の画面は`compact`にします。
  - `Board`や年の予定など横に広い画面は`wide`にします。
  - それ以外は`default`のままにします。
- `AppShell`を使わない画面では、作業面に`Surface`を使います。

## CSSの読み込みと上書き

- 次の順に読み込みます。CSSの中では`@import`を使いません。
  1. `layers.css`
  2. `reset.css`・`tokens.css`・`base.css`・`layout.css`
  3. 使うコンポーネントの`components/*.css`
- 全てのコンポーネントを使う場合は、`@tknf/retrix/hono`の`stylesheets`の順に`<link>`で読み込みます。
- 一部のコンポーネントだけを使う場合は、リファレンスの「読み込むCSS」を上から順に読み込みます。
- カスケードレイヤーの優先順は`reset, base, tokens, layout, components, utilities, overrides`です。利用側の調整は`@layer overrides`に書きます。
- 色・大きさ・角丸・影は値を直接書かず、`--rx-*`のトークンを参照します。
- 余白や位置は論理プロパティで書きます。
- CSSだけで使う場合も、Honoのコンポーネントが出力するHTML構造と状態の属性（`data-*`・`aria-*`）をそのまま書きます。
- クラス名の決まりは次のとおりです。
  - ルートのクラス名は、`rx-`を付けたkebab-caseにする。
  - 内部の要素には役割を表すクラス名を付け、ルートの子セレクターで指定する（例：`.rx-card > .title`）。
  - バリエーションと状態は、クラスではなく属性で表す。

## ButtonとInputの文字位置

ButtonとInputの文字・行の高さ・上下の余白は、それぞれのコンポーネントのCSSで指定しています。

- 外側から`font`・`line-height`・上下の`padding`を上書きしたり、文字の位置を調整したりしません。上書きすると、文字が枠の中で上にずれます。
- 大きさを変える時は、`data-size`などコンポーネントの指定を使います。
- ネイティブの`button`を追加する場合は、その文字の指定をどのCSSで行うかを先に決めます。
- DropdownMenuの項目は上揃えです。`align-items: center`で内容全体を中央に揃えません。

## controllerを登録する

- controllerは自動では起動・登録されません。使うコンポーネントのcontrollerだけを、決められた登録名で登録します。
  - Honoのコンポーネントは、その登録名を`data-controller`に出力します。別の名前で登録すると動きません。
  - 一つのコンポーネントが複数のcontrollerを使う場合があります（Tableは`table`・`table-sort`・`table-select`）。全て登録します。
  - 登録名の一覧は、[references/components.md](references/components.md)の最後の表にあります。

```ts
import { Application } from "@hotwired/stimulus";
import { DialogController, DropdownMenuController } from "@tknf/retrix/controllers";

const application = Application.start(); // 既存のApplicationがあればそれを使う
application.register("dialog", DialogController);
application.register("dropdown-menu", DropdownMenuController);
```

- controllerは、選択・移動・変更のたびに`<登録名>:<動作>`という名前のカスタムイベントを発火します（`dropdown-menu:select`、`board:move`など）。
- `before`で始まるイベントと、リファレンスに取り消せると書いてあるイベントは、`preventDefault()`で取り消せます。
- 保存・通信・権限の確認は、利用側でイベントを受け取って行います。イベントの`detail`の値は、サーバー側でも検証します。
- 通常のフォーム、リンク、`details`は、JavaScriptなしでも動きます。JavaScriptなしの動作は、リファレンスの「使い方」に書いてあります。

## アイコン

- `Icon`は外部のSVGスプライトを参照します。
- `@tknf/retrix/icons.svg`を、利用するアプリと同じオリジンの`/assets/rx-icons.svg`に置きます。
- アイコンだけで意味を伝えず、表示する名前か読み上げ用の名前を付けます。

## 確認すること

- 狭い幅（375px前後）と文字サイズ200%で、はみ出しや重なりがないか。
- 右から左に読む言語（`dir="rtl"`）で、配置と矢印キーの向きが逆になるか。
- 強制カラーモードと、アニメーションを減らす設定でも、状態と操作が分かるか。
- ブラウザはPopover APIへの対応が必要です。Popover・Toast・DropdownMenu・CommandMenuが使います。

## 参照

- [references/components.md](references/components.md)：分類ごとのコンポーネントの一覧と、controllerの登録名。
- [導入](https://github.com/tknf/retrix/blob/main/docs/getting-started.md)：CSSだけで使う方法、Honoで使う方法、controllerの登録。
- [デザインの原則](https://github.com/tknf/retrix/blob/main/docs/principles.md)：形・面・色・状態・余白・動きの決まり。
- [トークン](https://github.com/tknf/retrix/blob/main/docs/tokens.md)：`--rx-*`の種類。
- [CSSの構造](https://github.com/tknf/retrix/blob/main/docs/css.md)：読み込み順、レイヤー、クラス名。
- [controller](https://github.com/tknf/retrix/blob/main/docs/controllers.md)：登録の決まりとイベントの規約。
- [アイコン](https://github.com/tknf/retrix/blob/main/docs/icons.md)：大きさ、配置、ライセンス。
