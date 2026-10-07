<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Statistic

集計値と単位をまとめて表示します。

## 使いどころ

- 売上や件数などの集計値を、何の値か・単位・集計の条件と一緒に大きく見せる時に使います。
- 期限までの日数や残りを丸いマークで目立たせる時は `Countdown` を使います。
- 値の推移や内訳を見せる時は `ChartFrame`、項目と現在値を並べる時は `ValueList` を使います。

## 使い方

`label` に何の値か、`value` に値、`unit` に単位、`note` に集計の条件（期間・税込かどうかなど）を渡します。値はシートの見出しと同じ大きさ（18px）の黒い太字で書き、名前は灰色の小さな（11px）太字、単位は灰色の12px、条件は茶色の小さな（11px）文字で添えます。

`value` は文字列で受け取ります。数値の算出・桁区切り・符号の付け方と、増減が良いか悪いかの意味は利用側で決めます。数字は桁のそろう字形で書き、長い値は折り返します。

複数の値を並べる時は、置く側のレイアウト（`rx-split` など）で並べます。JavaScriptは使いません。

## アクセシビリティ

- `dl` の `dt` に名前、`dd` に値と条件を置くので、名前と値を組にして読み上げます。
- 単位は値と同じ `dd` の中に置くので、「128,400円」と続けて読みます。

## API

### Statistic

| 名前            | 型       | 既定値 | 説明                                                     |
| --------------- | -------- | ------ | -------------------------------------------------------- |
| `label`（必須） | `string` |        | 何の値か（「今月の売上」など）。値の上に淡く小さく書く。 |
| `value`（必須） | `string` |        | 表示する値。桁区切りや符号は利用側で整えた文字列で渡す。 |
| `unit`          | `string` |        | 値の後に小さく添える単位（「円」「件」など）。           |
| `note`          | `string` |        | 値の下に添える集計の条件（期間・税込かどうかなど）。     |

ほかに、`<dl>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/statistic.css`

## コード

```tsx
import { Statistic } from "@tknf/retrix/hono";
export default () => (
  <div class="rx-split">
    <Statistic
      label="今月の売上"
      value="128,400"
      unit="円"
      note="9月1日〜15日 · 税込"
    />
    <Statistic label="予約" value="0" unit="件" note="今日の受付分" />
    <Statistic label="先月との差額" value="-12,800" unit="円" note="同じ期間との比較" />
    <Statistic
      label="これまでに受付したすべての予約の合計"
      value="123,456,789"
      unit="件"
    />
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-split">
  <dl class="rx-statistic">
    <dt>今月の売上</dt>
    <dd class="value">128,400<small>円</small></dd>
    <dd class="note">9月1日〜15日 · 税込</dd>
  </dl>
  <dl class="rx-statistic">
    <dt>予約</dt>
    <dd class="value">0<small>件</small></dd>
    <dd class="note">今日の受付分</dd>
  </dl>
  <dl class="rx-statistic">
    <dt>先月との差額</dt>
    <dd class="value">-12,800<small>円</small></dd>
    <dd class="note">同じ期間との比較</dd>
  </dl>
  <dl class="rx-statistic">
    <dt>これまでに受付したすべての予約の合計</dt>
    <dd class="value">123,456,789<small>件</small></dd>
  </dl>
</div>
```

</details>
