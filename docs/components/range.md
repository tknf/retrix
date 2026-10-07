<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Range

スライダーで、数値や範囲を調整します。

## 使いどころ

- 表示倍率や音量のように、正確な数よりも位置の感覚で決める数値に使います。`value` に[下限, 上限]を渡すと、予算のような範囲を選べます。
- 正確な数を打ち込ませる時は `NumberField`、3〜8個の決まった値から選ぶ時は `Dial` を使います。

## 使い方

`value` に数値を渡すと単一値、[下限, 上限]を渡すと範囲指定になります。`min`・`max` はスライダーの両端に灰色の小さな数で出します。溝は4pxの淡い灰色（`#ececec`）の平らな線で、進んだ側（範囲指定では下限から上限まで）を青緑で塗ります。つまみは控えめなボタンと同じ作りの小さな円で、平らな白に1px `#cccccc` の枠と、下にぼかしの無い1px `#dddddd` の影を付けます。フォーカスするとつまみの縁を青にし、外に淡い青の輪を広げます。`disabled` では溝・つまみ・塗りをそのままにし、文字だけを灰色にします。`step` などの残りの属性は標準の `range` 入力へ渡します。

単一値は `name` で値を送信し、名前の行の終わりに現在値を `unit` を添えて出します。範囲指定は `<name>-start`・`<name>-end` の二つの名前で送信し、スライダーの下に下限・上限の数の入力を `unit` を添えて並べます。数の入力は送信しません。

範囲指定では、下限が上限を越えないように、動かした側をもう一方の値で止めます。数の入力で確定した値も同じように止めてスライダーへ移します。

`RangeController` を `range` として登録します。上流の `SliderController` の状態管理と上下限の制約に、現在値の表示と数の入力の同期を加えたものです。値はcontrollerの `value`（単一値）、`start`・`end`（範囲指定）で読み書きでき、書いた値は表示にも移します。範囲指定の数の入力は `NumberField` で、`NumberFieldController` を `number-field` として登録すると PageUp・PageDown でも動かせます。

操作で値が確定すると `slider:beforechange` と `slider:change` を出します。標準の `input`・`change` もそのまま受け取れます。数の入力の確定は、その入力の標準の `change` で受け取れます。フォームのリセットでは表示も初期値に戻します。

JavaScriptが無い時は、単一値は現在値の表示の無いスライダーになります。範囲指定は「下限」「上限」のラベルが付いた独立した2本のスライダーになり、下限が上限を越えても止めません。受け取った値の前後関係は送信先でも確かめます。

## キーボード

| キー       | 動作                                  |
| ---------- | ------------------------------------- |
| 矢印キー   | stepだけ増減します（標準の操作）。    |
| Home / End | `min`・`max` にします（標準の操作）。 |

## アクセシビリティ

- 単一値のスライダーはラベルを読み上げ名にします。範囲指定は `fieldset` の `legend` に `label` を置き、2本のスライダーと数の入力を「予算（円） 下限」のように名前と下限・上限で読み上げます。
- スライダーは数だけを読み上げ、`unit` や両端の数は読み上げません。単位は `label` にも「表示倍率（%）」のように含めます。範囲指定の数の入力では、`unit` を入力の説明として読み上げます。
- 現在値の表示は `aria-live="off"` で、動かすたびに重ねて読み上げません。値はスライダー自体が伝えます。

## イベント

| イベント              | 内容                                                                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `slider:beforechange` | ポインターかキーボードの操作で値が確定する前に出します。取り消すと値を操作の前に戻します。detailは `value`・`previousValue`・`reason`（`pointer` か `keyboard`）と、範囲指定では `thumb`（`start` か `end`）です。 |
| `slider:change`       | 値が確定した後に出します。detailは `slider:beforechange` と同じです。                                                                                                                                              |

## API

### Range

連続する数値を調整するスライダー。範囲指定は2本のスライダーと数の入力で下限と上限を選ぶ。残りの属性（stepなど）はスライダーのinputへ渡す。

| 名前            | 型                                    | 既定値 | 説明                                                                                                               |
| --------------- | ------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------ |
| `label`（必須） | `string`                              |        | 名前。単一値ではラベル、範囲指定ではfieldsetのlegendになる。単位はここにも含める。                                 |
| `min`（必須）   | `number`                              |        | 下限。スライダーの先頭側の端に数として出す。                                                                       |
| `max`（必須）   | `number`                              |        | 上限。スライダーの末尾側の端に数として出す。                                                                       |
| `value`         | `number \| readonly [number, number]` |        | 数値なら単一値、[下限, 上限]なら範囲指定になる。省略すると単一値で、位置はブラウザの既定（minとmaxの中間）になる。 |
| `unit`          | `string`                              | `""`   | 単位。単一値では現在値の表示に、範囲指定では下限・上限の数の入力の後に添える。                                     |

ほかに、`<input>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/field.css`、`components/input-group.css`、`components/range.css`

## コード

```tsx
import { Disclosure, Button, Range } from "@tknf/retrix/hono";

export default () => (
  <form class="rx-stack" aria-label="表示と予算の設定">
    <Range
      id="hono-range-zoom"
      label="表示倍率（%）"
      name="zoom"
      min={50}
      max={200}
      step={10}
      value={100}
      unit="%"
    />
    <Range
      id="hono-range-budget"
      label="予算（円）"
      name="budget"
      min={0}
      max={10000}
      step={500}
      value={[1000, 5000]}
      unit="円"
    />
    <Disclosure summary="最小・最大・小数・利用不可">
      <div class="rx-stack">
        <Range label="音量（最小）" min={0} max={100} value={0} unit="%" />
        <Range label="画質（最大）" min={1} max={5} value={5} />
        <Range
          label="拡大率（小数）"
          min={0.5}
          max={2}
          step={0.1}
          value={1.2}
          unit="倍"
        />
        <Range label="変更できない範囲" min={0} max={10} value={3} disabled />
        <Range
          label="予算（変更不可）"
          min={0}
          max={10000}
          step={500}
          value={[2000, 8000]}
          disabled
        />
      </div>
    </Disclosure>
    <Button type="reset">初期値に戻す</Button>
  </form>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<form class="rx-stack" aria-label="表示と予算の設定">
  <div class="rx-range" data-controller="range" data-mode="single">
    <div class="heading">
      <label class="label" for="hono-range-zoom" id="hono-range-zoom-label"
        >表示倍率（%）</label
      ><output
        class="value"
        for="hono-range-zoom"
        data-range-unit="%"
        aria-live="off"
        hidden=""
      ></output>
    </div>
    <div class="controls">
      <div class="native">
        <input
          step="10"
          id="hono-range-zoom"
          class="input"
          type="range"
          min="50"
          max="200"
          name="zoom"
          value="100"
          aria-labelledby="hono-range-zoom-label"
          data-range-target="input"
        />
      </div>
    </div>
    <div class="limits" aria-hidden="true"><span>50</span><span>200</span></div>
  </div>
  <fieldset class="rx-range" data-controller="range" data-mode="interval">
    <legend class="label" id="hono-range-budget-label">予算（円）</legend>
    <div class="controls">
      <div class="native">
        <label
          class="label"
          id="hono-range-budget-start-label"
          for="hono-range-budget-start"
          >下限</label
        ><input
          step="500"
          id="hono-range-budget-start"
          class="input"
          type="range"
          min="0"
          max="10000"
          name="budget-start"
          value="1000"
          aria-labelledby="hono-range-budget-label hono-range-budget-start-label"
          data-range-target="input"
        />
      </div>
      <div class="native">
        <label
          class="label"
          id="hono-range-budget-end-label"
          for="hono-range-budget-end"
          >上限</label
        ><input
          step="500"
          id="hono-range-budget-end"
          class="input"
          type="range"
          min="0"
          max="10000"
          name="budget-end"
          value="5000"
          aria-labelledby="hono-range-budget-label hono-range-budget-end-label"
          data-range-target="input"
        />
      </div>
    </div>
    <div class="limits" aria-hidden="true"><span>0</span><span>10000</span></div>
    <div class="values" hidden="">
      <label class="rx-field" for="hono-range-budget-start-number"
        ><span class="label" id="hono-range-budget-start-number-label">下限</span>
        <div class="rx-input-group">
          <div class="control" data-size="default">
            <input
              type="number"
              aria-labelledby="hono-range-budget-label hono-range-budget-start-number-label"
              min="0"
              max="10000"
              step="500"
              value="1000"
              data-range-bound="start"
              id="hono-range-budget-start-number"
              data-size="default"
              aria-describedby="hono-range-budget-start-number-suffix"
              data-controller="number-field"
              data-number-field-page-step-value="10"
              class="rx-input"
            /><span class="affix" id="hono-range-budget-start-number-suffix">円</span>
          </div>
        </div></label
      ><label class="rx-field" for="hono-range-budget-end-number"
        ><span class="label" id="hono-range-budget-end-number-label">上限</span>
        <div class="rx-input-group">
          <div class="control" data-size="default">
            <input
              type="number"
              aria-labelledby="hono-range-budget-label hono-range-budget-end-number-label"
              min="0"
              max="10000"
              step="500"
              value="5000"
              data-range-bound="end"
              id="hono-range-budget-end-number"
              data-size="default"
              aria-describedby="hono-range-budget-end-number-suffix"
              data-controller="number-field"
              data-number-field-page-step-value="10"
              class="rx-input"
            /><span class="affix" id="hono-range-budget-end-number-suffix">円</span>
          </div>
        </div></label
      >
    </div>
  </fieldset>
  <details class="rx-disclosure">
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
      ><span class="label"><span class="title">最小・最大・小数・利用不可</span></span>
    </summary>
    <div class="body">
      <div class="rx-stack">
        <div class="rx-range" data-controller="range" data-mode="single">
          <div class="heading">
            <label class="label" for="rx-range-:rk:" id="rx-range-:rk:-label"
              >音量（最小）</label
            ><output
              class="value"
              for="rx-range-:rk:"
              data-range-unit="%"
              aria-live="off"
              hidden=""
            ></output>
          </div>
          <div class="controls">
            <div class="native">
              <input
                id="rx-range-:rk:"
                class="input"
                type="range"
                min="0"
                max="100"
                value="0"
                aria-labelledby="rx-range-:rk:-label"
                data-range-target="input"
              />
            </div>
          </div>
          <div class="limits" aria-hidden="true"><span>0</span><span>100</span></div>
        </div>
        <div class="rx-range" data-controller="range" data-mode="single">
          <div class="heading">
            <label class="label" for="rx-range-:rl:" id="rx-range-:rl:-label"
              >画質（最大）</label
            ><output
              class="value"
              for="rx-range-:rl:"
              data-range-unit=""
              aria-live="off"
              hidden=""
            ></output>
          </div>
          <div class="controls">
            <div class="native">
              <input
                id="rx-range-:rl:"
                class="input"
                type="range"
                min="1"
                max="5"
                value="5"
                aria-labelledby="rx-range-:rl:-label"
                data-range-target="input"
              />
            </div>
          </div>
          <div class="limits" aria-hidden="true"><span>1</span><span>5</span></div>
        </div>
        <div class="rx-range" data-controller="range" data-mode="single">
          <div class="heading">
            <label class="label" for="rx-range-:rm:" id="rx-range-:rm:-label"
              >拡大率（小数）</label
            ><output
              class="value"
              for="rx-range-:rm:"
              data-range-unit="倍"
              aria-live="off"
              hidden=""
            ></output>
          </div>
          <div class="controls">
            <div class="native">
              <input
                step="0.1"
                id="rx-range-:rm:"
                class="input"
                type="range"
                min="0.5"
                max="2"
                value="1.2"
                aria-labelledby="rx-range-:rm:-label"
                data-range-target="input"
              />
            </div>
          </div>
          <div class="limits" aria-hidden="true"><span>0.5</span><span>2</span></div>
        </div>
        <div class="rx-range" data-controller="range" data-mode="single">
          <div class="heading">
            <label class="label" for="rx-range-:rn:" id="rx-range-:rn:-label"
              >変更できない範囲</label
            ><output
              class="value"
              for="rx-range-:rn:"
              data-range-unit=""
              aria-live="off"
              hidden=""
            ></output>
          </div>
          <div class="controls">
            <div class="native">
              <input
                id="rx-range-:rn:"
                class="input"
                type="range"
                min="0"
                max="10"
                value="3"
                disabled=""
                aria-labelledby="rx-range-:rn:-label"
                data-range-target="input"
              />
            </div>
          </div>
          <div class="limits" aria-hidden="true"><span>0</span><span>10</span></div>
        </div>
        <fieldset
          class="rx-range"
          data-controller="range"
          data-mode="interval"
          disabled=""
        >
          <legend class="label" id="rx-range-:ro:-label">予算（変更不可）</legend>
          <div class="controls">
            <div class="native">
              <label
                class="label"
                id="rx-range-:ro:-start-label"
                for="rx-range-:ro:-start"
                >下限</label
              ><input
                step="500"
                id="rx-range-:ro:-start"
                class="input"
                type="range"
                min="0"
                max="10000"
                value="2000"
                disabled=""
                aria-labelledby="rx-range-:ro:-label rx-range-:ro:-start-label"
                data-range-target="input"
              />
            </div>
            <div class="native">
              <label class="label" id="rx-range-:ro:-end-label" for="rx-range-:ro:-end"
                >上限</label
              ><input
                step="500"
                id="rx-range-:ro:-end"
                class="input"
                type="range"
                min="0"
                max="10000"
                value="8000"
                disabled=""
                aria-labelledby="rx-range-:ro:-label rx-range-:ro:-end-label"
                data-range-target="input"
              />
            </div>
          </div>
          <div class="limits" aria-hidden="true"><span>0</span><span>10000</span></div>
          <div class="values" hidden="">
            <label class="rx-field" for="rx-range-:ro:-start-number"
              ><span class="label" id="rx-range-:ro:-start-number-label">下限</span>
              <div class="rx-input-group">
                <div class="control" data-size="default">
                  <input
                    type="number"
                    aria-labelledby="rx-range-:ro:-label rx-range-:ro:-start-number-label"
                    min="0"
                    max="10000"
                    step="500"
                    value="2000"
                    disabled=""
                    data-range-bound="start"
                    id="rx-range-:ro:-start-number"
                    data-size="default"
                    data-controller="number-field"
                    data-number-field-page-step-value="10"
                    class="rx-input"
                  />
                </div></div></label
            ><label class="rx-field" for="rx-range-:ro:-end-number"
              ><span class="label" id="rx-range-:ro:-end-number-label">上限</span>
              <div class="rx-input-group">
                <div class="control" data-size="default">
                  <input
                    type="number"
                    aria-labelledby="rx-range-:ro:-label rx-range-:ro:-end-number-label"
                    min="0"
                    max="10000"
                    step="500"
                    value="8000"
                    disabled=""
                    data-range-bound="end"
                    id="rx-range-:ro:-end-number"
                    data-size="default"
                    data-controller="number-field"
                    data-number-field-page-step-value="10"
                    class="rx-input"
                  />
                </div></div
            ></label>
          </div>
        </fieldset>
      </div>
    </div>
  </details>
  <button class="rx-button" type="reset" data-variant="secondary" data-size="default">
    初期値に戻す
  </button>
</form>
```

</details>
