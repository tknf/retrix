<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# ChartFrame

グラフと数値の表を並べて表示します。

## 使いどころ

- 利用側で描いたグラフに、要点・凡例・同じ値の表・出典を添えて見せる時に使います。
- 一つの集計値を大きく見せる時は `Statistic`、数値そのものを並べて比べる時は `Table` を使います。

## 使い方

`title` と、図の要点を一文で書いた `description` を渡します。`graphic` に利用側で描いた図、`table` に同じ値の `table` 要素を渡します。描画ライブラリや集計の処理は含みません。

題名は本文の大きさ（13px）の太字、要点の説明と出典は11pxの灰色の文字で書きます。図は1pxの淡い罫線で囲んだ白い面（角丸3px）の上に置きます。SVGは幅に合わせて縮め、はみ出す図はその面の中でスクロールします。

`table` は `tableLabel` の見出しで開く `Disclosure` に畳み、`Table` と同じ見た目で書きます。

`legend` に系列の名前と `tone`（`blue`・`green`・`amber`・`coral`）を渡すと、図の下に凡例を並べます。凡例のマークは10pxの角の小さな平らな四角で、`blue` は青緑、`green` は緑、`amber` は黄土色、`coral` は赤茶です。図の系列の色は利用側で凡例に合わせます。`source` は図の最後に「出典：」を付けて書きます。

幅は `size="measure"` で36remまで、`size="wide"` で置き場所いっぱいに広げます。表の開閉は `details` で動くので、JavaScriptは要りません。

## アクセシビリティ

- ルートは `figure` で、`title` と `description` は `figcaption` になります。
- `graphic` は `aria-hidden="true"` で読み上げから外します。図の中の文字も読まれないので、値は必ず `table` で渡します。
- 表の見出しのセルと `scope` は、利用側で `table` に書きます。
- 凡例は「凡例」を名前に持つ一覧で、色のマークは読み上げず系列の名前を読みます。

## API

### ChartFrame

グラフ描画は利用側が持ち、同じ値を表で読めるようにする。

| 名前                 | 型                           | 既定値      | 説明                                                                     |
| -------------------- | ---------------------------- | ----------- | ------------------------------------------------------------------------ |
| `title`（必須）      | `string`                     |             | 図の題名。figcaptionに太字で書く。                                       |
| `description`        | `string`                     |             | 題名の下に淡い文字で書く図の要点。図を見なくても結論が分かる一文にする。 |
| `graphic`（必須）    | `Child`                      |             | 利用側で描いた図（SVGなど）。読み上げから外すので、同じ値をtableで渡す。 |
| `table`（必須）      | `Child`                      |             | graphicと同じ値の表。table要素を渡す。Disclosureに畳んで置く。           |
| `tableLabel`（必須） | `string`                     |             | 数値の表を開く見出し。                                                   |
| `size`               | `"measure" \| "wide"`        | `"measure"` | measureは幅36remまで、wideは置き場所の幅いっぱいに広げる。               |
| `legend`             | `readonly ChartLegendItem[]` | `[]`        | 図の下に並べる凡例。空なら置かない。                                     |
| `source`             | `string`                     |             | 図の最後に「出典：」を付けて書く出典。                                   |

ほかに、`<figure>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/overlay.css`、`components/disclosure.css`、`components/icon.css`、`components/table.css`、`components/chart-frame.css`

#### `ChartLegendItem`

凡例の一件。

| 名前            | 型                                        | 既定値 | 説明                                 |
| --------------- | ----------------------------------------- | ------ | ------------------------------------ |
| `label`（必須） | `string`                                  |        | 系列の名前。                         |
| `tone`（必須）  | `"blue" \| "green" \| "amber" \| "coral"` |        | マークの色。図の系列の色と合わせる。 |

## コード

```tsx
import { ChartFrame } from "@tknf/retrix/hono";

export default () => (
  <ChartFrame
    title="月別売上"
    description="4月から6月にかけて、売上は毎月15万円ずつ増加"
    tableLabel="月別売上の数値"
    graphic={
      <svg viewBox="0 0 420 142" width="420" height="142">
        {/* 棒は青から紫寄りへの塗り。 */}
        <defs>
          <linearGradient id="chart-frame-bar" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="var(--rx-link)" />
            <stop
              offset="100%"
              stop-color="color-mix(in srgb, var(--rx-link) 70%, var(--rx-plum))"
            />
          </linearGradient>
        </defs>
        <path
          d="M40 20H410M40 65H410M40 110H410"
          stroke="color-mix(in srgb, var(--rx-ink) 10%, transparent)"
        />
        <text x="4" y="24" fill="var(--rx-muted)" font-size="11">
          80
        </text>
        <text x="4" y="69" fill="var(--rx-muted)" font-size="11">
          40
        </text>
        <text x="11" y="114" fill="var(--rx-muted)" font-size="11">
          0
        </text>
        <rect
          x="78"
          y="59"
          width="58"
          height="51"
          rx="6"
          fill="url(#chart-frame-bar)"
        />
        <rect
          x="202"
          y="42"
          width="58"
          height="68"
          rx="6"
          fill="url(#chart-frame-bar)"
        />
        <rect
          x="326"
          y="25"
          width="58"
          height="85"
          rx="6"
          fill="url(#chart-frame-bar)"
        />
        <text x="90" y="133" fill="var(--rx-muted)" font-size="12">
          4月
        </text>
        <text x="214" y="133" fill="var(--rx-muted)" font-size="12">
          5月
        </text>
        <text x="338" y="133" fill="var(--rx-muted)" font-size="12">
          6月
        </text>
      </svg>
    }
    table={
      <table>
        <thead>
          <tr>
            <th scope="col">月</th>
            <th scope="col">売上</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">4月</th>
            <td>45万円</td>
          </tr>
          <tr>
            <th scope="row">5月</th>
            <td>60万円</td>
          </tr>
          <tr>
            <th scope="row">6月</th>
            <td>75万円</td>
          </tr>
        </tbody>
      </table>
    }
    source="集計用サンプル"
  />
);
```

<details>
<summary>出力されるHTML</summary>

```html
<figure class="rx-chart-frame" data-size="measure">
  <figcaption>
    <strong>月別売上</strong><span>4月から6月にかけて、売上は毎月15万円ずつ増加</span>
  </figcaption>
  <div class="graphic" aria-hidden="true">
    <svg viewBox="0 0 420 142" width="420" height="142">
      <defs>
        <linearGradient id="chart-frame-bar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="var(--rx-link)"></stop>
          <stop
            offset="100%"
            stop-color="color-mix(in srgb, var(--rx-link) 70%, var(--rx-plum))"
          ></stop>
        </linearGradient>
      </defs>
      <path
        d="M40 20H410M40 65H410M40 110H410"
        stroke="color-mix(in srgb, var(--rx-ink) 10%, transparent)"
      ></path>
      <text x="4" y="24" fill="var(--rx-muted)" font-size="11">80</text>
      <text x="4" y="69" fill="var(--rx-muted)" font-size="11">40</text>
      <text x="11" y="114" fill="var(--rx-muted)" font-size="11">0</text>
      <rect
        x="78"
        y="59"
        width="58"
        height="51"
        rx="6"
        fill="url(#chart-frame-bar)"
      ></rect>
      <rect
        x="202"
        y="42"
        width="58"
        height="68"
        rx="6"
        fill="url(#chart-frame-bar)"
      ></rect>
      <rect
        x="326"
        y="25"
        width="58"
        height="85"
        rx="6"
        fill="url(#chart-frame-bar)"
      ></rect>
      <text x="90" y="133" fill="var(--rx-muted)" font-size="12">4月</text>
      <text x="214" y="133" fill="var(--rx-muted)" font-size="12">5月</text>
      <text x="338" y="133" fill="var(--rx-muted)" font-size="12">6月</text>
    </svg>
  </div>
  <details class="rx-disclosure data">
    <summary>
      <span class="marker" aria-hidden="true"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span
      ><span class="label"><span class="title">月別売上の数値</span></span>
    </summary>
    <div class="body">
      <div class="rx-table" data-state="ready">
        <table>
          <thead>
            <tr>
              <th scope="col">月</th>
              <th scope="col">売上</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">4月</th>
              <td>45万円</td>
            </tr>
            <tr>
              <th scope="row">5月</th>
              <td>60万円</td>
            </tr>
            <tr>
              <th scope="row">6月</th>
              <td>75万円</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </details>
  <p class="source">出典：集計用サンプル</p>
</figure>
```

</details>
