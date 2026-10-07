# Retrix

Retrixは、マスタ管理・顧客管理・案件管理・設定のような業務の画面を組み立てるためのデザインシステムです。手本は2012年前後の37signalsの画面（Basecamp 2・Highrise）です。クリーム色の机の上に白いシートを置き、そこに表や一覧や文章を並べる見た目で、情報を多く並べても読み順が崩れないようにします。

- **表を中心にしたマスタ画面が得意**：並べ替え・列の幅の変更・行の選択と一括操作を持つ`Table`を中心に、一覧・詳細・編集の画面を組めます。文書・予定・連絡・ボードの画面も同じ作法で組めます。
- **中央に揃えた画面構成**：`AppShell`は、ヘッダー（アプリの名前・主な移動先・検索）と白いシートを画面の中央に揃えます。上の階層はシートの背後に重ねたシートで、分類ごとの移動先はシートの外の先頭側の列で示します。画面の端に固定するサイドバーは持ちません。
- **平らな塗りと罫線と枠**：シートとカードは枠を持たず、四方へのぼかしの影で机から浮かせた白い面です。一覧と表の行は罫線で区切り、欄とボタンは1pxの枠を持ちます。控えめなボタンは高さ22px・角丸5pxの平らな白、主操作は平らな緑です。グラデーションとアニメーションは使いません。リンクは青緑の文字に下線を引き、今日・選んだ行・更新した行は黄色のハイライトで示します。
- **フレームワークに依存しない基盤**：CSSとセマンティックHTMLが基盤です。同じHTMLを出力するHono JSXのSSRコンポーネントと、必要な動作を担うStimulus controllerも提供します。

ButtonやInputなどの基本コンポーネントに加え、Table・Board・Calendar・DangerZoneなど、特定の用途で情報と操作をまとめるコンポーネントを含めて約90種類を提供します。業務データ・権限・通信・永続化は利用するアプリが持ち、Retrixは情報の読み順・配置・操作を共通化します。

## コンポーネントの選び方

| 画面の要素                     | 使うコンポーネント                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| アプリの画面構成               | `AppShell`（ヘッダー・シート・`trail`・`aside`）。`AppShell`を使わない時は`Surface` |
| 名前で探す移動と操作           | `CommandMenu`（`AppShell`の`commands`に置く検索）                                   |
| 同じ列で項目を見比べる一覧     | `Table`。セルを矢印キーで移動するなら`Grid`、親子の階層があるなら`Treegrid`         |
| 題名と補足で読ませる一覧       | `DataList`。一つの対象の属性は`ValueList`                                           |
| ページの見出しと操作           | `PageHeader`、まとまりの見出しは`Section`                                           |
| 入力のフォーム                 | `Field`・`FieldGroup`・`Input`など。修正先の一覧は`ErrorSummary`                    |
| 対象に対する操作               | `Button`・`ButtonGroup`・`SplitButton`・`DropdownMenu`                              |
| 判断が必要な処理と近くの補足   | `Dialog`、`Popover`                                                                 |
| 案内・結果・空の状態           | `Notice`、`Toast`、`EmptyState`                                                     |
| 作業面に付属する開閉式のパネル | `Wing`（`AppShell`の`wings`）                                                       |

全てのコンポーネントの使いどころは[コンポーネントのリファレンス](docs/components/README.md)にあります。

## インストール

```sh
pnpm add @tknf/retrix
```

`hono`・`@hotwired/stimulus`・`@tknf/stimulus-ui`はpeer dependencyです。Hono JSXのコンポーネントを使う場合は`hono`、controllerを使う場合は`@hotwired/stimulus`と`@tknf/stimulus-ui`を追加します。CSSだけで使う場合は追加しません。ESMのみを提供しています。詳しくは[導入](docs/getting-started.md)を参照してください。

## 使ってみる

```tsx
import { Button, Field, Input } from "@tknf/retrix/hono";

const EditForm = () => (
  <form method="post" action="/items">
    <Field id="title" label="名前" help="一覧に表示する名前です。">
      {(attributes) => <Input {...attributes} name="title" required />}
    </Field>
    <Button type="submit" variant="primary">
      保存する
    </Button>
  </form>
);
```

CSSだけでも同じHTMLで使えます。

```html
<button class="rx-button" type="submit" data-variant="primary">保存する</button>
```

開閉・選択・キーボード操作が必要なコンポーネントは、`@tknf/retrix/controllers`のcontrollerを決められた登録名で登録します。controllerは自動では登録しません。次はTableの並べ替え・行の選択・列の幅の変更を使う場合です。

```ts
import { Application } from "@hotwired/stimulus";
import {
  TableController,
  TableResizeController,
  TableSelectController,
  TableSortController,
} from "@tknf/retrix/controllers";

const application = Application.start(); // 既存のApplicationがあればそれを使う
application.register("table", TableController);
application.register("table-sort", TableSortController);
application.register("table-select", TableSelectController);
application.register("table-resize", TableResizeController);
```

登録名の一覧は[controllerの登録名](docs/components/README.md#controllerの登録名)にあります。

## カタログ

```sh
vp install
vp run dev
```

`http://127.0.0.1:5173`にカタログを表示します。DB・認証・外部サービスは不要です。

- `/`：全コンポーネントを分類ごとに並べます。ヘッダーの末尾側の検索（CommandMenu）から名前で探せます。
- `/components/<名前>`：見本、使い方、同じ見本のHTMLとHonoのコード。
- `/apps/customers`など：コンポーネントだけで組んだ利用例のアプリ「つむぐ」（取引先のマスタ・プロジェクト・受信トレイ・予定・文書・資料・売上・検索・メンバー・設定）。

## パッケージ

| エントリーポイント         | 内容                                      |
| -------------------------- | ----------------------------------------- |
| `@tknf/retrix/css/*`       | フレームワークに依存しないCSS             |
| `@tknf/retrix/hono`        | HonoのSSRコンポーネントと型               |
| `@tknf/retrix/controllers` | Stimulus controller（自動では登録しない） |
| `@tknf/retrix/icons.svg`   | アイコンのSVGスプライト                   |

テーマはライトテーマだけを提供しています。

## ドキュメント

- [導入](docs/getting-started.md)：CSSだけで使う、Honoで使う、controllerを登録する
- [デザインの原則](docs/principles.md)：画面構成・色・形・文字・状態・余白の決まり
- [トークン](docs/tokens.md)：`--rx-*`の種類と使い方
- [CSSの構造](docs/css.md)：読み込み順、レイヤー、クラス名の決まり
- [コンポーネント](docs/components/README.md)：全コンポーネントのリファレンス。使いどころ、使い方、キーボード、props、controller、読み込むCSS、コード
- [controller](docs/controllers.md)：登録の決まりとイベントの規約
- [アイコン](docs/icons.md)：大きさ、配置、ライセンス

- [変更履歴](CHANGELOG.md)

## Agent Skill

Retrixを使って画面を組むためのAgent Skillを[`skills/retrix`](skills/retrix/SKILL.md)に同梱しています。コンポーネントの選び方、CSSの読み込み、controllerの登録、文字位置などの注意点をまとめています。

Codexでは、組み込みのskill installerでこのリポジトリから入れます。

```text
$skill-installer Install the retrix skill from https://github.com/tknf/retrix/tree/main/skills/retrix
```

Claude Codeでは、`skills/retrix`ディレクトリを利用するプロジェクトの`.claude/skills/retrix/`に置きます。Codexでプロジェクトだけに置く場合は`.agents/skills/retrix/`に置きます。

## 開発に参加する

Retrixの開発に参加する場合は[開発ガイド](CONTRIBUTING.md)を参照してください。脆弱性は公開のissueではなく、[セキュリティポリシー](SECURITY.md)の手順で報告してください。

## ライセンス

Retrixは[MITライセンス](LICENSE)で公開しています。

アイコンには[Phosphor Icons](https://github.com/phosphor-icons/core)（MIT）を使っています。著作権・許諾文はスプライトと`dist/PHOSPHOR-LICENSE`に同梱しています。
