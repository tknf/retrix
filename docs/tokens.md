# トークン

Retrixの見た目は`--rx-*`のCSSカスタムプロパティで決まります。定義と現在の値は[tokens.css](../src/css/tokens.css)にあり、この文書では値を複製せず、種類と使い方を説明します。

基本色（primitive）から用途のトークンを参照し、必要なコンポーネントだけが専用のトークンを持ちます。利用側で色や大きさを変える時は、用途のトークンを上書きします。

## 色

| 種類             | 主なトークン                                                                       | 使い方                                                                   |
| ---------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 地と紙           | `--rx-background`、`--rx-surface`                                                  | 画面の地（クリーム色の机）と、シート・カード・パネル・欄の白             |
| 文字             | `--rx-text`、`--rx-ink`、`--rx-muted`、`--rx-meta`                                 | 本文、題名と現在地の黒、補足の灰色、日付・投稿者の茶色                   |
| 線と枠           | `--rx-border`、`--rx-control-border`                                               | 黄みを帯びた淡い灰色の罫線と、それより濃い欄とボタンの枠                 |
| リンクと見出し   | `--rx-link`、`--rx-link-hover`、`--rx-heading`                                     | 青緑のリンクとホバーの赤茶、まとまりの見出しの赤茶                       |
| 選んでいる状態   | `--rx-teal`、`--rx-cover`、`--rx-menu-active`                                      | オンのボタンの青緑、選んだ値の淡い青緑、メニューで選んでいる項目の青緑   |
| 黄色のハイライト | `--rx-mark`                                                                        | 今日、選んだ行、更新した行、文中の一致した語、Toast                      |
| 黄色の紙         | `--rx-note`、`--rx-note-edge`                                                      | テキスト文書やメモのカードと、その縁                                     |
| 背後のシート     | `--rx-sheet-behind`                                                                | `AppShell`の`trail`で重ねる上の階層のシートの淡い灰色                    |
| 状態             | `--rx-info`、`--rx-success`、`--rx-warning`、`--rx-danger`と各`-soft`              | 情報・成功・注意・危険の文字と、その淡い面。`--rx-info-soft`は件数のピル |
| 分類             | `--rx-blue`、`--rx-green`、`--rx-amber`、`--rx-coral`、`--rx-plum`、`--rx-tan`など | Avatar・Tag・ActionListの`accent`などで、利用側が明示した分類            |

背景・本文・リンク・状態の色は用途のトークンで指定します。コンポーネントの背景を変える場合は、利用側でもコントラストを確認してください。

## 塗りと影

グラデーションは、ボタンの手触り、役割の色の塗り、「ここを見て」の面の三つだけに使います。どれも縦の塗りです。一覧・本文・情報の面は平らにします。

| 種類 | 主なトークン                                                     | 使い方                                                                    |
| ---- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 塗り | `--rx-fill-control`                                              | ボタンの、白から淡い灰色への縦の塗り                                      |
|      | `--rx-fill-primary`、`--rx-fill-danger`、`--rx-fill-success`など | 主操作の緑・危険の赤茶・成功の緑などの縦の塗り                            |
|      | `--rx-emphasis-*`                                                | 「ここを見て」の面のごく淡い縦の塗り（LayerCard・Wingの見出しなど）       |
|      | `--rx-fill-menu`                                                 | DropdownMenu・FilterMenuの白いパネル                                      |
|      | `--rx-hatch`                                                     | 使えない操作・枠の斜線                                                    |
| 影   | `--rx-shadow-sheet`                                              | 作業面（シート）。1pxの輪郭と、下へわずかに落ちる影                       |
|      | `--rx-shadow-paper`、`--rx-shadow-paper-lift`                    | カードの輪郭と浅い影、ドラッグ中やホバー中に持ち上げたカード              |
|      | `--rx-shadow-menu`                                               | 浮かぶパネル（メニュー・ダイアログ・Toastなど）。カードより遠くまで落ちる |
|      | `--rx-shadow-input`、`--rx-shadow-sunken`                        | 入力欄の内側の沈み、Progressなどの溝                                      |
|      | `--rx-shadow-control*`                                           | ボタンの通常時・ホバー時・押下時                                          |
| 輪   | `--rx-focus-ring`                                                | 入力欄・Switch・選択肢のフォーカスで、青い縁の外に広げる淡い青の輪        |

シート・カード・パネルの輪郭は影の一つ目で描くので、コンポーネントは枠線を別に引きません。

## 書体

- 本文は`--rx-font`（Hiragino Sans優先、無い環境はシステムフォント）を使います。
- 操作コンポーネント（Button・Input・InputGroup・DatePickerなど）は`--rx-control-font-family`を共有します。欧文をHelvetica Neue／Arial、和文をHiraginoで表示し、両者の行メトリクスをそろえて、文字が枠の中で上下の中央に見えるようにしています。フォントのダウンロードは行わず、該当するローカル書体が無い環境ではシステムフォントへフォールバックします。
- 文字の大きさは`--rx-small`（12px）・`--rx-label`（13px）・`--rx-body`（14px）・`--rx-section-title`（18px）・`--rx-title`（24〜28px）の5段階です。画面幅で変わるのは`--rx-title`だけです。行高は`--rx-leading`・`--rx-label-leading`・`--rx-small-leading`です。

## 大きさと角丸

- 余白の段階は`--rx-space-1`（4px）〜`--rx-space-18`（72px）で、番号×4pxの大きさです。
- 操作要素の高さは`--rx-control-size`（31px）、詰めた操作は`--rx-control-compact`（26px）です。Buttonと一行のInputは`--rx-button-font`（13px）の文字を基準に、高さを`--rx-button-size`（31px）としてemで追従させます。`size="large"`は文字を14pxにし、高さを`--rx-button-large`（34px）にします。枠を除いた内側の高さと文字の大きさの差を偶数にして、文字の上下の余りを整数pxに保ちます。
- 角丸は`--rx-radius-mark`（2px）・`--rx-radius-control`（3px）・`--rx-radius-field`（4px）・`--rx-radius-surface`（4px）・`--rx-radius-sheet`（3px）・`--rx-radius-pill`です。角は小さくし、丸くするのは件数やメタ情報のピルとアバターだけです。使い分けは[デザインの原則](principles.md#形)を参照してください。
- 作業面（シート）の最大幅は`--rx-page`（61.25rem）、読む本文の行の長さは`--rx-measure`（40rem）です。

## 動き

- `--rx-duration`を基準に、表示・非表示の`--rx-duration-pop`・`--rx-duration-out`・`--rx-duration-fade`が決まります。イージングは`--rx-ease-pop`・`--rx-ease-slide`です。
- 更新した行の黄色のハイライトは`--rx-duration-flash`（1.6秒）で消えます。
- `prefers-reduced-motion: reduce`の環境では`--rx-duration`と`--rx-duration-flash`が0になり、アニメーションを止めます。

## テーマ

現在はライトテーマのみを提供しています。
