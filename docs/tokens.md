# トークン

Retrixの見た目は`--rx-*`のCSSカスタムプロパティで決まります。定義と現在の値は[tokens.css](../src/css/tokens.css)にあり、この文書では種類と使い方を説明します。値の根拠は[見た目の根拠](visual-reference/README.md)にあります。

基本色（primitive）から用途のトークンを参照し、必要なコンポーネントだけが専用のトークンを持ちます。利用側で色や大きさを変える時は、用途のトークンを上書きします。

## 色

| 種類             | 主なトークン                                                                       | 使い方                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 地と面           | `--rx-background`、`--rx-desk-texture`、`--rx-surface`                             | 画面の地（クリーム色の机と細かいノイズ）と、シート・カード・パネル・欄の白                             |
| 文字             | `--rx-text`、`--rx-ink`、`--rx-muted`、`--rx-meta`、`--rx-quiet`                   | 本文、題名と現在地の黒、補足の灰色、日付・投稿者の茶色、机の上の小さな灰色の文字                       |
| 入力と使えない時 | `--rx-placeholder`、`--rx-disabled-text`                                           | 入力欄のプレースホルダーと、使えない操作の灰色の文字                                                   |
| 線と枠           | `--rx-border`、`--rx-control-border`、`--rx-input-border`、`--rx-textarea-border`  | 一覧の行の罫線、控えめなボタンの枠、一行の入力欄の枠、複数行の入力欄の枠                               |
| ヘッダー         | `--rx-logo`、`--rx-header-rule`                                                    | アプリの名前の濃い灰色と、名前と移動先の間の縦の線                                                     |
| リンクと見出し   | `--rx-link`、`--rx-link-hover`、`--rx-heading`                                     | 青緑のリンクとホバーの赤、まとまりの見出しの赤                                                         |
| 選んでいる状態   | `--rx-option-active`、`--rx-option-active-text`、`--rx-menu-active`                | メニュー・候補の一覧で選んでいる項目の、角の無い淡い青と黒い文字                                       |
| オンと選んだ値   | `--rx-teal`、`--rx-cover`                                                          | Switchのオンと選んでいるButtonの青緑の塗り、選んだ選択肢・フォーカスのある行・ドロップ先の淡い青緑の面 |
| ピル             | `--rx-pill-count`、`--rx-pill-count-text`、`--rx-pill-meta`、`--rx-pill-meta-text` | 件数の淡い青と青緑の文字、担当者・期日の灰色の地と灰色の文字                                           |
| 黄色のハイライト | `--rx-mark`                                                                        | 今日、選んだ行、更新した行、文中の一致した語、Toast                                                    |
| 黄色の紙         | `--rx-note`、`--rx-note-edge`                                                      | テキスト文書やメモのカードと、その縁                                                                   |
| 浮かぶパネル     | `--rx-popover-edge`、`--rx-popover-radius`、`--rx-popover-shadow`                  | ポップオーバー・メニューなどの1px `#bbb`の枠、5pxの角丸、外へ約8pxの柔らかい影                         |
| 背後のシート     | `--rx-sheet-behind`、`--rx-sheet-behind-edge`                                      | `AppShell`の`trail`で重ねる上の階層のシートの淡い灰色と、その1pxの枠                                   |
| カレンダー       | `--rx-calendar-rule`                                                               | カレンダーとProgressの暖かい灰色の罫線                                                                 |
| 状態             | `--rx-info`、`--rx-success`、`--rx-warning`、`--rx-danger`と各`-soft`              | 情報・成功・注意・危険の文字と、その淡い面。`--rx-info-soft`は件数のピルと同じ淡い青                   |
| フォーカス       | `--rx-focus-border`、`--rx-focus-glow`、`--rx-focus-ring`                          | 入力欄とボタンのフォーカスの青い縁と、その外側の淡い青の輪                                             |
| 分類             | `--rx-blue`、`--rx-green`、`--rx-amber`、`--rx-coral`、`--rx-plum`、`--rx-tan`など | Avatar・Tag・ActionListの`accent`などで、利用側が明示した分類                                          |

背景・本文・リンク・状態の色は用途のトークンで指定します。コンポーネントの背景を変える場合は、利用側でもコントラストを確認してください。

## 塗りと影

塗りはどれも平らな色です。`--rx-fill-*`は`background-image`に重ねられるよう`linear-gradient`で書いていますが、上下とも同じ色で、色の移り変わりはありません。

| 種類 | 主なトークン                                                                | 使い方                                                                                       |
| ---- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 塗り | `--rx-fill-control`、`--rx-fill-control-hover`、`--rx-fill-control-pressed` | 控えめなボタンの平らな白と、ホバー・押した時のわずかに灰色の面                               |
|      | `--rx-fill-success`                                                         | 成功の平らな緑                                                                               |
|      | `--rx-fill-menu`                                                            | DropdownMenu・FilterMenuの白いパネル                                                         |
|      | `--rx-hatch`                                                                | 使えない枠や欄の淡い灰色の平らな面。斜線は描きません（名前は以前の実装から引き継いでいます） |
| 影   | `--rx-shadow-sheet`                                                         | シート。枠なしで、四方へ同じ量（約6px）のぼかし                                              |
|      | `--rx-shadow-paper`、`--rx-shadow-paper-lift`                               | カード。枠なしで四方へ約5pxのぼかしと、ドラッグ中に持ち上げたカードの約8pxのぼかし           |
|      | `--rx-popover-shadow`                                                       | 浮かぶパネル（ポップオーバー・メニュー・ダイアログなど）。枠の外への柔らかい影               |
|      | `--rx-shadow-control`、`--rx-shadow-control-hover`                          | 控えめなボタンの下のぼかしの無い1pxの影と、ホバー時の少し濃い影                              |
|      | `--rx-shadow-control-pressed`、`--rx-shadow-control-primary-pressed`        | 押した時に内側へ沈む影（控えめなボタンと、塗りのあるボタン）                                 |
|      | `--rx-shadow-input`                                                         | 一行の入力欄の影。手本どおり内側の影は付けません（`none`）                                   |

シートとカードは枠線を持たず、影だけで机から浮かせます。浮かぶパネルは1px `#bbb`の枠と柔らかい影を持ちます。

## 書体

- 本文は`--rx-font`（Hiragino Sans優先、無い環境はシステムフォント）を使います。
- 操作コンポーネント（Button・Input・InputGroup・DatePickerなど）は`--rx-control-font-family`を共有します。欧文をHelvetica Neue／Arial、和文をHiraginoで表示し、両者の行メトリクスをそろえて、文字が枠の中で上下の中央に見えるようにしています。フォントのダウンロードは行わず、該当するローカル書体が無い環境ではシステムフォントへフォールバックします。
- 文字の大きさは、ベースの本文`--rx-body`（13px）から決めた6段階です。

| トークン             | 大きさ | 使い方                                         |
| -------------------- | ------ | ---------------------------------------------- |
| `--rx-small`         | 11px   | 補足・日時・ピル                               |
| `--rx-label`         | 12px   | ボタン・入力欄・表・ラベル                     |
| `--rx-body`          | 13px   | 本文・一覧の題名                               |
| `--rx-reading`       | 14px   | 続けて読む文章（コメント・カードの説明・文書） |
| `--rx-section-title` | 15px   | まとまりの見出し（赤・通常の太さ）             |
| `--rx-title`         | 18px   | シートの見出し（黒・太字）                     |

- 行高は`--rx-leading`（13pxで18px）・`--rx-label-leading`（12pxで17px）・`--rx-small-leading`（11pxで15px）・`--rx-control-leading`です。
- 項目名の太さは`--rx-label-weight`（600）です。選択肢や値そのものは通常の太さのままにします。
- トークンの値は画面幅で変わりません。PageHeaderの見出しだけは、コンポーネントの幅が狭い時に`--rx-title`から`--rx-section-title`まで小さくなります。

## 大きさと角丸

- 余白の段階は`--rx-space-1`（4px）〜`--rx-space-18`（72px）で、番号×4pxの大きさです。
- 線の太さは`--rx-stroke-width`（1px）、今・編集中を示す太枠は`--rx-frame-width`（2px）です。
- 操作要素の高さは`--rx-control-size`（24px）、詰めた操作は`--rx-control-compact`（22px）です。
- 控えめなButtonは`--rx-button-font`（`--rx-label`、12px）の文字で、高さを`--rx-button-size`（22px）としてemで追従させます。`size="large"`は文字を14pxにし、高さを`--rx-button-large`（32px）にします。一行のInputは12pxの文字で高さ24px、largeは14pxの文字で高さ32pxです。枠を除いた内側の高さと文字の大きさの差を偶数にして、文字の上下の余りを整数pxに保ちます。
- 角丸は`--rx-radius-mark`（2px）・`--rx-radius-field`（3px）・`--rx-radius-surface`（3px）・`--rx-radius-sheet`（3px）・`--rx-radius-primary`（4px）・`--rx-radius-control`（5px）・`--rx-popover-radius`（5px）・`--rx-radius-pill`です。ピルの形は件数・担当者・期日・状態（Badge）・カレンダーの終日の帯だけに使います。使い分けは[デザインの原則](principles.md#形)を参照してください。
- 破線の線と間は`--rx-dash`と`--rx-dash-gap`（Divider・Calendarの現在時刻）、「これから」のStepsやTimelineの破線の色は`--rx-perforation`です。
- 作業面（シート）の最大幅は`--rx-page`（960px）、読む本文の行の長さは`--rx-measure`（40rem）です。

## 動き

Retrixはアニメーションとトランジションを持たず、動きのトークンもありません。開閉や状態の変化は、その場で切り替えます。

## テーマ

現在はライトテーマのみを提供しています。
