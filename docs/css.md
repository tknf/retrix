# CSSの構造

## ファイル

| ファイル           | 内容                                                                |
| ------------------ | ------------------------------------------------------------------- |
| `layers.css`       | カスケードレイヤーの順序。必ず最初に読み込む                        |
| `reset.css`        | ブラウザの既定のスタイルの整理                                      |
| `tokens.css`       | `--rx-*`のトークン（[トークン](tokens.md)）                         |
| `base.css`         | 地・本文・リンクなど、ページ全体の基礎                              |
| `layout.css`       | シートの中の配置（`.rx-workspace`・`.rx-stack`・`.rx-cluster`など） |
| `components/*.css` | コンポーネントごとのCSS。ファイル名はコンポーネント名のkebab-case   |
| `assets/*.svg`     | CSSの背景・maskに使うアイコン                                       |

レイヤーの優先順は`reset, base, tokens, layout, components, utilities, overrides`です。利用側の調整は`@layer overrides`に書くと、コンポーネントの詳細度に関係なく優先されます。

## クラス名

- コンポーネントのルートは`rx-`を付けたkebab-caseのクラスです（`.rx-button`、`.rx-date-picker`）。
- 内部の部分はルートからの直下の関係で役割名を付けます（`.rx-card > .title`、`.rx-field > .messages > .help`）。`rx-コンポーネント名-部分名`のように名前を繰り返しません。
- 役割名（`.body`・`.icon`など）だけをグローバルに書いたCSSはありません。利用側でも、役割名は必ずルートと組み合わせて指定してください。
- 部分に別のコンポーネントを使う場合は、そのコンポーネントのルートクラスを持ちます（内部のIconは`.rx-icon`、Buttonは`.rx-button`）。入れ子になるDropdownMenuの一覧も`.rx-menu`を独立したルートとして持ちます。
- バリエーションと状態はクラスではなく属性で表します（`data-variant="primary"`、`data-size="large"`、`data-invalid`、`aria-current`、`aria-expanded`など）。
- controllerとの接続にはクラスではなく`data-*-target`を使います。

## 主な構造

| コンポーネント   | 構造                                                                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AppShell         | `.rx-app-shell > header.bar`（`.account`・`.start`・`nav.navigation`・`.commands`）と `.body > .aside / .main`。mainの中に`nav.trail`・`.workspace`（シート）・`footer.footer` |
| Surface          | `.rx-surface > .body`                                                                                                                                                          |
| PageHeader       | `.rx-page-header > .icon`、`.heading > h1 + p`、`.actions`                                                                                                                     |
| Breadcrumb       | `nav.rx-breadcrumb > ol > li`。最後の項目だけが現在地                                                                                                                          |
| ContextBar       | `div.rx-context-bar > nav.rx-breadcrumb` と `.actions`                                                                                                                         |
| Field            | `.rx-field > .heading`、入力コンポーネント、`.messages > .help / .error`                                                                                                       |
| FieldGroup       | `.rx-field-group > legend + .layout`。layoutの中にdescriptionとfields                                                                                                          |
| InputGroup       | `.rx-input-group > .control > .affix / .rx-input`                                                                                                                              |
| Tabs             | `.rx-tabs > .list` と `.panel`                                                                                                                                                 |
| Dialog / Popover | `.rx-dialog > dialog.panel`、`.rx-popover > .panel`。heading・body・actionsはpanelの直下                                                                                       |
| DropdownMenu     | `.rx-dropdown-menu > .rx-menu`。項目は`.rx-menu > li > .item`。入れ子のgroupも`.rx-menu[data-variant="group"]`                                                                 |
| DatePicker       | `.rx-date-picker > .control / .fallback / .panel`。panelの中にeditors・month・grid・actions                                                                                    |
| Card             | `.rx-card > .preview / .eyebrow / .title / .body / .meta`                                                                                                                      |
| DataList         | `.rx-data-list > li > .start / .body / .end`                                                                                                                                   |
| Table / Calendar | `.rx-table > table`、`.rx-calendar > table`。スクロールする領域がコンポーネントのルート                                                                                        |
| ImageFrame       | `.rx-image-frame > .image > img`                                                                                                                                               |

その他のコンポーネントの構造は、[コンポーネントのリファレンス](components/README.md)の各ページの「コード」にある出力HTMLを参照してください。

## 書き方の決まり

利用側でRetrixのCSSを拡張する場合も、次の決まりに合わせると崩れにくくなります。

- 余白や位置は論理プロパティ（`margin-block-start`、`padding-inline`、`inset-inline-end`など）で書きます。右から左に読む場合も同じCSSで動きます。
- 色・大きさ・角丸・影は値を直接書かず、トークンを参照します。
- 並ぶ子の間隔は親の`gap`、文章の前後関係は`margin-block-start`、要素自身の内側は`padding`で持ちます。
- 操作コンポーネント（Button・Input）の文字・行高・上下の余白は、そのコンポーネントのCSSが持ちます。外側から`font`・`line-height`・上下の`padding`を上書きしないでください。
