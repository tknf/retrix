# Retrix

Retrixは、管理画面・業務システム・一般利用者向けのサービスで再利用するデザインシステムです。メール、CRM、プロジェクト管理、文書、財務、チャットのような仕事の画面を、共通の文字・余白・操作の作法で組み立てます。

- **中央に作業面を置く画面構成**：上部中央のCommandMenuと中央の作業面。サイドバーを持たず、必要な時だけ左右に補助メニュー（Wing）を開きます。
- **パネルとボタンの手触り**：パネルやカードは影で浮かび、ボタンは普段は平らで、押すと内側へへこみます。操作や状態が変わった瞬間だけ短く動きます。
- **フレームワークに依存しない基盤**：CSSとセマンティックHTMLが基盤です。同じHTMLを出力するHono JSXのSSRコンポーネントと、必要な動作を担うStimulus controllerも提供します。

ButtonやInputなどの基本コンポーネントに加え、Toolbar・DangerZone・Board・Calendarなど、特定の用途で情報と操作をまとめるコンポーネントを含めて約90種類を提供します。業務データ・権限・通信・永続化は利用するアプリが持ち、Retrixは情報の読み順・配置・操作を共通化します。

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

## カタログ

```sh
vp install
vp run dev
```

`http://127.0.0.1:5173`にカタログを表示します。DB・認証・外部サービスは不要です。

- `/`：全コンポーネントを分類ごとに並べます。上部中央のコマンドメニューから名前で探せます。
- `/components/<名前>`：見本、使い方、同じ見本のHTMLとHonoのコード。
- `/apps/project`など：コンポーネントだけで組んだ利用例のアプリ「つむぐ」（プロジェクト・受信トレイ・予定・文書・資料・売上・検索・メンバー・設定）。

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
- [デザインの原則](docs/principles.md)：形・面・色・状態・余白・動きの決まり
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
