# 開発ガイド

Retrix自体を開発するための手順と決まりです。使い方は[README](README.md)と[docs](docs/)を参照してください。

## 準備

Node.js 22.18以降または24.11以降と、Vite+（`vp`）を使います。

```sh
vp install
vp run dev
```

`vp install`は、コミットの前にステージしたファイルを`vp check`で検査するフック（`.vite-hooks/pre-commit`）も入れます。

`vp run dev`はCSSの検査とアイコンの生成を行ってから、`http://127.0.0.1:5173`でカタログを起動します。ポートは`vp run dev --port 5178`のように変えられます。

## ソースの構成

| パス              | 内容                                                                 | エントリーポイント         |
| ----------------- | -------------------------------------------------------------------- | -------------------------- |
| `src/css`         | フレームワークに依存しないCSS                                        | `@tknf/retrix/css/*`       |
| `src/hono`        | HonoのSSRコンポーネントと型                                          | `@tknf/retrix/hono`        |
| `src/controllers` | Stimulus controllerのエントリーポイント                              | `@tknf/retrix/controllers` |
| `src/internal`    | アイコンの一覧や計算など、内部で共有する処理                         | —                          |
| `catalog`         | カタログのHonoアプリと利用例のアプリ                                 | 配布に含めない             |
| `public`          | カタログが配信するアイコンのスプライトと見本の画像                   | 配布に含めない             |
| `scripts`         | ビルド・検査・アイコン生成のスクリプト                               | —                          |
| `test`            | 単体テスト（`test/*.test.ts`）と表示・操作のテスト（`test/browser`） | —                          |

- `index.ts`は再exportだけを持ちます。
- Honoのコンポーネントはブラウザ用のコードをimportしません。
- controllerは自動で起動・登録しません。`@tknf/stimulus-ui`の機能を利用・継承し、Retrix固有の配置と操作は追加のcontrollerが持ちます。
- カタログはコンポーネントだけで組みます。コンポーネントの説明は`catalog/component-docs/<id>.ts`、見本は`catalog/hono-examples/<id>.tsx`、分類は`catalog/component-groups.ts`です。見本のファイルがそのままカタログのHonoのコードとして掲載されます。
- 利用例のアプリの保存処理はカタログの中のデモ（`catalog/controllers`）で、配布物に含めません。

## コンポーネントを追加する

1. `src/css/components/<名前>.css`を書き、`src/hono/stylesheets.ts`に加えます。
2. `src/hono/<名前>.tsx`を書き、`src/hono/index.ts`から再exportします。
3. 動作が要る場合は`src/controllers`に書き、`src/controllers/index.ts`から再exportします。
4. `catalog/component-docs/<id>.ts`に説明、`catalog/hono-examples/<id>.tsx`に見本、`catalog/component-groups.ts`に分類を加えます。propsには全てJSDocを書きます（[リファレンス](#リファレンス)）。
5. 既存のコンポーネント（Button・Keycap・Badgeなど）を組み合わせ、ボタンや入力欄を作り直しません。まとまった部分は別のコンポーネントに切り出します。
6. [デザインの原則](docs/principles.md)に沿っているか、状態・長い文字列・狭い幅・無効時・右から左に読む言語を見本に並べて確かめます。

## リファレンス

各コンポーネントのページ（カタログの`/components/<id>`と`docs/components/<id>.md`）は、二つの一次情報から作ります。

| 内容                                                                 | 一次情報                                                  |
| -------------------------------------------------------------------- | --------------------------------------------------------- |
| 使いどころ・使い方・キーボード・アクセシビリティ・イベント           | `catalog/component-docs/<id>.ts`                          |
| propsの型・既定値・必須、参照する型、登録するcontroller、読み込むCSS | `src/hono`の型とJSDoc（`scripts/component-api.ts`が読む） |

- propsと、propsが参照する型の項目には、全てJSDocを書きます。標準のHTML属性や`children`のようにJSDocを書けないものは、`propNotes`に書きます。
- 公開する全てのコンポーネントは、いずれか一つのページの`api`に載せます。
- `docs/components/`と`skills/retrix/references/components.md`は生成物です。説明や型を変えたら`vp run docs:components`で生成し直します。
- `vp run test`は、載っていないコンポーネント、説明の無いprops、古い`docs/components/`を検出して失敗します。

## 検証

```sh
vp run check          # 型・lint・format・CSSの規約
vp run test           # 単体テスト
vp run build          # 配布物とカタログの生成
vp run check:package  # 配布物の型で見本をコンパイル
```

- `check:css`（`check`に含む）は、論理プロパティ、ネスト、レイヤー、禁止記法、未定義のトークン、コンポーネントのクラス名、操作コンポーネントの文字指定を検査します。
- `check:package`はカタログの見本を`@tknf/retrix/hono`の配布型でもコンパイルし、ソースと公開型の食い違いを検出します。
- 表示と操作のテストはPlaywrightで、Chromium・Firefox・WebKitを使います。合否の基準はChromiumです。FirefoxとWebKitは補助の確認で、そこだけの失敗は報告したうえで、直すかどうかを別に決めます。
- ブラウザテストはコンポーネント単位にします。カタログのサイトや利用例のアプリ（`/apps/*`）の流れ、画面の移動は配布物ではないのでテストしません。各コンポーネントの責任範囲は、そのコンポーネントのページで確かめます。

```sh
vp run browsers:install
vp exec playwright test test/browser/<コンポーネント>.spec.ts --project=chromium  # 変えたコンポーネントだけ
vp exec playwright test --last-failed                                    # 失敗したテストだけ
vp run test:visual                                                       # 3ブラウザ（@sweepを除く）
vp run test:visual:full                                                  # 3ブラウザの全件
```

- 普段は変えたコンポーネントのspecを1ブラウザで流し、3ブラウザの`test:visual`と全件の`test:visual:full`は区切りで流します。
- `@sweep`は、全コンポーネントを回すテストと幅を細かく刻むテストに付けるタグです。時間がかかるので`test:visual`では外します。
- `vp run test:visual -- <引数>`では引数が渡らないので、対象を絞る時は`vp exec playwright test`を使います。
- 並列は2までです。WebKitは長時間実行するとページ遷移が止まることがあるため（[microsoft/playwright#42385](https://github.com/microsoft/playwright/issues/42385)）、失敗したテストを一度だけやり直し、やり直して通ったテストはflakyとして報告します。traceはやり直した時だけ記録します。

どの実行も専用の5178番のサーバーを起動・終了し、スクリーンショット・trace・結果を`test-results`に出力します。

### 確認の範囲

- 静的検査、実ブラウザでの寸法・操作、字形のピクセル検査、目での確認は別の証拠として扱います。静的検査の成功を、見た目の確認と言い換えません。
- WebKitのテスト結果は、実機のSafariの確認を代替しません。文字200%の試験はCSSの文字サイズの拡大で、OSの設定やブラウザのズームを代替しません。
- 他のOSのフォント、スクリーンリーダー、実機での確認は、それぞれ別に行います。

## 配布物

```sh
vp run build
vp run preview
```

`dist/hono`・`dist/controllers`・`dist/css`・`dist/icons.svg`がライブラリ、`dist/catalog`が静的なカタログです。配布するCSSとカタログは同じファイルを使います。

アイコンを追加する場合は`src/internal/icon-manifest.json`に加え、`vp run icons:build`でスプライト・CSS用のSVG・`IconName`型を生成し直します。

## 操作コンポーネントの文字位置

Button・Input・DatePickerなどの操作コンポーネントでは、文字が枠の中央より上に見える「上付き」を既知の不具合として扱います。UIを変える前にこの節を読み、再発させないでください。

### 原因

CSSの行ボックスが枠の中央にあっても、字形の見た目の中心が一致するとは限りません。行の上下の位置は、フォントのascent・descentと行間の情報で決まります（[CSSの行高の計算](https://www.w3.org/TR/CSS2/visudet.html#line-height)）。macOSのWebKitには、Hiraginoのdescentを増やしてlineGapを減らす補正があり（[WebKitの実装](https://github.com/WebKit/WebKit/blob/main/Source/WebCore/platform/graphics/coretext/FontCoreText.cpp#L155)）、これが字形と行ボックスの中心をずらします。高さや行高を変えるだけでは直りません。

### 対策

操作コンポーネントは[tokens.css](src/css/tokens.css)の共通フォント定義を使います。

```css
--rx-control-font-family:
  "Retrix UI Latin", "Retrix UI Japanese", "Helvetica Neue", Arial, var(--rx-font);
```

- ローカルのHelvetica NeueとHiragino Sansに別名を付け、両方の行メトリクスをascent 89%・descent 11%・line gap 0%にそろえます（[フォントの行メトリクスの指定](https://drafts.csswg.org/css-fonts-4/#font-metrics-override-desc)）。90%以上では16pxで下へ寄るため、89%にしています。
- 太さ400と600〜900を別のローカル書体へ対応付けます。InputとInputGroupは太さ400を持ち、親の太字を継承しません。
- フォントのダウンロードは行いません。該当する書体が無い環境はシステムフォントへフォールバックします。
- 本文用の`--rx-font`はHiragino優先のままです。
- Buttonの文字は通常14px・largeは16pxです。largeの文字を大きくすると中心が1px下へずれるため、この大きさを保ちます。

### 検査

- [control-text.mjs](scripts/control-text.mjs)は、共通Buttonのフォント・太さ・行高・中央揃え・上下余白を検査します。派生コンポーネントからの上書き、ラベルの子要素だけの移動、状態別・メディア条件内の変更、操作用フォントのトークンを本文用に戻す変更、`font: inherit`、共通コンポーネントを迂回する生のbuttonも検出します。既存の専用操作の例外は、このファイルで宣言単位に管理します。
- `vp run check`・`vp run dev`・`vp run build`の開始時に検査します。[Viteプラグイン](scripts/control-text-plugin.ts)は起動中のサーバーでの変更もエラーにします。
- [回帰テスト](test/control-text.test.ts)は既知の崩れ方を混入させ、拒否されることを確かめます。文字の指定を変えたら`vp run test test/control-text.test.ts`を実行します。
- [描画の回帰テスト](test/browser/control-text.spec.ts)は、2倍密度の描画から字形の上下端を求め、枠の中心との差が0.5px以内であることを確かめます。Hiraginoを読み込める環境だけが対象で、無い環境ではスキップします。

静的な検査は、既知のソース上の退行を検出するものです。実際のフォールバックフォントやブラウザが描く字形のピクセルまでは再現しません。

### 守ること

- Buttonの文字・縦配置は`src/css/components/button.css`が持ちます。コンポーネント固有のCSSからfont shorthand・太さ・行高・上下余白・文字の移動で上書きしません。
- 新しいコンポーネントでボタンや入力欄を作り直さず、共通のコンポーネントと操作用フォントを使います。ネイティブのbuttonを追加する場合は、文字の指定をどこが持つかを明示します。
- `font: inherit`はfont-familyも上書きします。親が本文用フォントの場合に基準を失わないか確かめます。
- `text-box`、非対称なpadding、負の余白、文字の`translate`による個別の補正を追加しません。枠・余白・行高をどこが持つかを確かめ、二重に指定しません。
- DropdownMenuの項目は上揃えです。上下の余白は「一行時の高さ − 行高 − 上下の枠線」の半分ずつにし、一行なら中央に見え、複数行なら同じ上端から下へ伸びるようにします。`align-items: center`で内容全体を中央へ寄せません。
- 検査に失敗したら実装を直します。検査を通すために基準や例外を増やしません。基準を変える必要がある場合は、影響するコンポーネント、変更の理由、既知の崩れ方を検出し続ける回帰テストをそろえます。
- 再発した時は、共通フォントの適用・上書き・フォールバックを先に調べ、次に高さ・行高・上下余白・枠線の組み合わせを確かめます。

## プルリクエスト

- 一つのプルリクエストには、一つの論理的な変更だけを入れます。
- 変更を確かめるテストを足します。
- `vp run check`・`vp run test`・`vp run build`・`vp run check:package`が通ることを確かめます。CIでも同じ検査を流します。ブラウザテストはCIでは流さないので、見た目や操作を変えた場合は、変えたコンポーネントのspecをChromiumで流した結果を書いてください。
- 利用者に関わる変更は、`CHANGELOG.md`の`[Unreleased]`に書きます。
- 公開の面（props・HTML構造・クラス名・登録名・イベントなど）を変えた場合は、リファレンス・ガイド・Agent Skill（`skills/retrix`）も同じ変更で直します。

### ブランチ

- 最新の`origin/main`から作ります。
- 名前は`{prefix}/{issue番号|yyyymmdd}_{name}`にします（例：`feat/85_file-input-drop`、`docs/20260929_controller-guide`）。
- `prefix`は`feat`・`fix`・`docs`・`refactor`・`test`・`chore`・`ci`・`release`から選びます。
- メンテナーが求めない限り、force pushしません。

### コミット

- 一つのコミットには一つの論理的な変更だけを入れ、明示したパスをステージします。
- 件名は日本語の1行で、末尾に句点を付けず、原則20〜72文字にします。
- 自明でない変更は、本文に何を・なぜ変えたかを書きます。
- コードや設定を変えた場合は、`検証:`に流したコマンドと結果を書きます。流していない確認は`未確認:`と書きます。
- issueとの関係は、分かっている時だけ`Refs #<番号>`か`Closes #<番号>`で書きます。
- ツールに固有のtrailerや、貢献していないco-authorを足しません。

## 版と公開

Semantic VersioningとKeep a Changelogに従います。互換性のない公開APIやHTML構造の変更は`major`、互換性を保った追加は`minor`、互換性を保った修正は`patch`です。ドキュメントだけ、リポジトリだけの変更では版を上げません。

公開の準備では、`vp pm version X.Y.Z -- --no-git-tag-version`の後に`vp run check`・`vp run test`・`vp run build`・`vp run check:package`を流します。公開のコミットの件名は`vX.Y.Zを公開する`にし、同じコミットに注釈付きタグ`vX.Y.Z`を付けます。タグをpushするとGitHub Actionsがnpmへ公開するので、手動では公開しません。公開のコミット・タグ・pushには、メンテナーの明示的な許可が要ります。

## AIエージェントで作業する

CodexやClaude Codeで作業する場合は、[AGENTS.md](AGENTS.md)の決まりに従います。

- 開発用のスキル（`issue`・`plan`・`impl`・`release`）は`.agents/skills/`にあり、Claude Codeは`.claude/skills/`から読みます。
- Codexのサブエージェントの定義は`.codex/agents/`にあります。
- スキルやエージェントの定義を変えたら、`vp run check:workflow-safety`で構成を確かめます。
- 利用者に配る`skills/retrix`は、Retrixを使って画面を組むためのスキルです。開発用のスキルとは別物です。

## セキュリティ

脆弱性は公開のissueではなく、[SECURITY.md](SECURITY.md)の手順で非公開で報告してください。
