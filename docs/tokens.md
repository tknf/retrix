# トークン

Retrixの見た目は`--rx-*`のCSSカスタムプロパティで決まります。定義と現在の値は[tokens.css](../src/css/tokens.css)にあり、この文書では値を複製せず、種類と使い方を説明します。

基本色（primitive）から用途のトークンを参照し、必要なコンポーネントだけが専用のトークンを持ちます。利用側で色や大きさを変える時は、用途のトークンを上書きします。

## 色

| 種類     | 主なトークン                                                                            | 使い方                                              |
| -------- | --------------------------------------------------------------------------------------- | --------------------------------------------------- |
| 地と文字 | `--rx-background`、`--rx-surface`、`--rx-text`、`--rx-muted`、`--rx-ink`、`--rx-border` | 画面の地、カード、本文、淡い補足、太字の黒、罫線    |
| 主操作   | `--rx-brand`、`--rx-link`、`--rx-cover`                                                 | 主操作とリンクの青、見出しの層などの淡い青          |
| 状態     | `--rx-info`、`--rx-success`、`--rx-warning`、`--rx-danger`と各`-soft`                   | 情報・成功・注意・危険の文字と、その淡い面          |
| マーカー | `--rx-mark`                                                                             | 「今日」と文中の一致した語だけに使う蛍光ペンの黄    |
| 分類     | `--rx-blue`、`--rx-green`、`--rx-amber`、`--rx-coral`など                               | Avatar・Tag・ActionListの`accent`などで明示した分類 |

背景・本文・リンク・状態の色は用途のトークンで指定します。コンポーネントの背景を変える場合は、利用側でもコントラストを確認してください。

## 塗りと影

| 種類 | 主なトークン                                                     | 使い方                                          |
| ---- | ---------------------------------------------------------------- | ----------------------------------------------- |
| 塗り | `--rx-fill-control`                                              | ボタンの縦の淡い陰影                            |
|      | `--rx-fill-primary`、`--rx-fill-danger`、`--rx-fill-success`など | 主操作・危険などの135度の塗り                   |
|      | `--rx-emphasis-*`                                                | 「ここを見て」の面とマーク                      |
|      | `--rx-fill-menu`                                                 | 操作のメニューとToastの青の面                   |
| 影   | `--rx-shadow-paper`、`--rx-shadow-paper-lift`                    | カード、持ち上げたカード                        |
|      | `--rx-shadow-menu`                                               | 浮かぶパネル（メニュー・ダイアログ・Toastなど） |
|      | `--rx-shadow-sheet`                                              | 作業面                                          |
|      | `--rx-shadow-input`、`--rx-shadow-sunken`                        | 入力欄の内側の沈み、溝や層の沈んだ背景          |
|      | `--rx-shadow-control*`                                           | ボタンの通常時・ホバー時・押下時                |
| 輪   | `--rx-focus-ring`                                                | 入力欄・Switch・選択肢のフォーカス              |

## 書体

- 本文は`--rx-font`（Hiragino Sans優先、無い環境はシステムフォント）を使います。
- 操作コンポーネント（Button・Input・InputGroup・DatePickerなど）は`--rx-control-font-family`を共有します。欧文をHelvetica Neue／Arial、和文をHiraginoで表示し、両者の行メトリクスをそろえて、文字が枠の中で上下の中央に見えるようにしています。フォントのダウンロードは行わず、該当するローカル書体が無い環境ではシステムフォントへフォールバックします。
- 文字の大きさは`--rx-small`・`--rx-label`・`--rx-body`・`--rx-section-title`・`--rx-title`の5段階です。画面幅に合わせて範囲の中で連続して変わります。行高は`--rx-leading`・`--rx-label-leading`・`--rx-small-leading`です。

## 大きさと角丸

- 余白の段階は`--rx-space-1`（4px）〜`--rx-space-18`（72px）で、番号×4pxの大きさです。
- 操作要素の高さは`--rx-control-size`（36px）です。Buttonは`--rx-button-font`の文字の大きさを基準に、高さと余白をemで追従させます（通常36px、`size="large"`は40px）。
- 角丸は`--rx-radius-mark`（4px）・`--rx-radius-control`（8px）・`--rx-radius-field`（12px）・`--rx-radius-surface`（16px）・`--rx-radius-sheet`（30px）・`--rx-radius-pill`です。使い分けは[デザインの原則](principles.md#形)を参照してください。
- 作業面の最大幅は`--rx-page`、読む本文の行の長さは`--rx-measure`です。

## 動き

- `--rx-duration`を基準に、表示・非表示の`--rx-duration-pop`・`--rx-duration-out`・`--rx-duration-fade`が決まります。イージングは`--rx-ease-pop`・`--rx-ease-slide`です。
- `prefers-reduced-motion: reduce`の環境では`--rx-duration`が0になり、アニメーションを止めます。

## テーマ

現在はライトテーマのみを提供しています。
