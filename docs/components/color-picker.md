<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# ColorPicker

色相・彩度・明度・不透明度を、見本を確認しながら選びます。

## 使いどころ

- 分類のラベルやマーカーなど、利用者が自由に色を決める時に使います。
- 決まった数色から選ぶだけなら、色の名前を並べた `Choice` や `Select` を使います。

## 使い方

`label` と送信する名前の接頭辞 `name`、初めの色 `value`（`colorSpace`・`hue`・`saturation`・`brightness`・`alpha`）を渡します。1px `#dedede` の枠で囲んだ淡い灰色（`#f9f9f9`、角丸8px）の面に、彩度と明度を決める色の面と選んでいる色の見本、色相・彩度・明度・不透明度の四本のスライダーを縦に並べます。見本は1pxの灰色の枠を付けた26pxの四角（角丸2px）で、透明な部分は市松模様で示します。欄の幅が28rem以上ではスライダーを二列にし、38rem以上では色の面とスライダーを左右に並べます。色の面とスライダーは同じ値に合わせて動きます。

送信する値：`name="brandColor"` なら、`brandColor[hue]`（0〜360）・`brandColor[saturation]`（0〜100）・`brandColor[brightness]`（0〜100）・`brandColor[alpha]`（0〜1）と、`brandColor[colorSpace]`（`srgb` か `display-p3`）を送ります。色空間は画面からは変えられず、`value` のまま送ります。

`help` と `error` は欄の下に出し、まとまりに関連付けます。`error` は表示するだけで、色の検証（背景とのコントラストなど）は利用側で行います。`disabled` は全ての操作を止め、形と面はそのままで文字だけを灰色にし、値を送りません。

値を変更すると、取り消せる `color-picker:beforechange` と、確定した後の `color-picker:change` を発火します。detailの `color` は `color(srgb r g b / a)`（広色域では `color(display-p3 …)`）の形のCSSの色で、そのまま表示に使えます。

JavaScriptが無い時は色の面を隠し、四本の標準のスライダーで値を決めて送れます。見本は初めの色のまま動きません。

## キーボード

| キー                                            | 動作                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| ←・→（色の面）                                  | 彩度を `step` ずつ下げ・上げます。右から左に読む時は逆です。 |
| ↑・↓（色の面）                                  | 明度を `step` ずつ上げ・下げます。                           |
| Shift＋矢印（色の面）                           | `step` の10倍ずつ動かします。                                |
| 矢印・Home・End・PageUp・PageDown（スライダー） | ブラウザの標準のスライダーの動きで、その値を変えます。       |
| Esc                                             | 操作中の変更を取り消し、操作を始める前の色に戻します。       |

## アクセシビリティ

- まとまりは `fieldset` で、`label` を名前にします。色の面は「〜の彩度と明度」の名前を持ち、操作の仕方の説明を読み上げ用に関連付け、`aria-controls` で彩度と明度のスライダーを指します。
- 色は見本の色だけに頼らず、四本のスライダーの名前と値でも伝えます。
- `error` を渡すと、まとまりに `aria-invalid` を付け、誤りの文を `aria-describedby` に加えます。

## イベント

| イベント                    | 内容                                                                                                                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `color-picker:beforechange` | 色を変える前に発火します。取り消せます。detailは `{ value, previousValue, color, reason, source }` で、`reason` は `pointer` か `keyboard`、`source` は操作した箇所（`area`・`hue`・`saturation`・`brightness`・`alpha`）です。 |
| `color-picker:change`       | 色を変えた後に発火します。detailは `color-picker:beforechange` と同じです。                                                                                                                                                     |

## API

### ColorPicker

標準rangeがフォーム値を保持し、上流のcolor-pickerが操作面と値を同期する。

| 名前            | 型                 | 既定値         | 説明                                                                                                                                                                                                                             |
| --------------- | ------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`            | `string`           |                | ルートのfieldsetのID。中の欄のIDの接頭辞にも使う。渡さなければ自動で生成する。                                                                                                                                                   |
| `class`         | `string`           |                | ルートのfieldsetに追加するクラス。                                                                                                                                                                                               |
| `label`（必須） | `string`           |                | 欄全体の名前。legendに出し、色の面の読み上げ名にも使う。                                                                                                                                                                         |
| `name`（必須）  | `string`           |                | 送信する名前の接頭辞。`${name}[hue]`・`[saturation]`・`[brightness]`・`[alpha]`・`[colorSpace]`で送信する。                                                                                                                      |
| `value`         | `ColorPickerValue` | `defaultValue` | 初期の色。                                                                                                                                                                                                                       |
| `help`          | `string`           |                | 欄の下に出す補足。fieldsetのaria-describedbyに関連付ける。                                                                                                                                                                       |
| `error`         | `string`           |                | 欄の下に出すエラー文。fieldsetをaria-invalidにする。検証は利用側で行う。                                                                                                                                                         |
| `disabled`      | `boolean`          |                | 色の面とスライダーをすべて使えなくする。値は送信しない。                                                                                                                                                                         |
| `form`          | `string`           |                | 別の場所にあるformのID。送信する全ての欄に付ける。                                                                                                                                                                               |
| `step`          | `number`           | `1`            | 色の面を矢印キーで動かす時の、彩度・明度の幅（0より大きく100以下）。Shiftを押すと10倍。                                                                                                                                          |
| `hueStep`       | `number`           |                | 使わない。互換のために型だけを残し、渡しても何も変わらない。上流のcolor-pickerでは色相環を矢印キーで動かす幅だが、このコンポーネントは色相環を持たず、色相のスライダーは他のスライダーと同じくブラウザの標準の動きで値を変える。 |

登録するcontroller：`color-picker`（`ColorPickerController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/field.css`、`components/icon.css`、`components/range.css`、`components/tag.css`、`components/color-picker.css`

#### `ColorPickerValue`

| 名前                 | 型                       | 既定値 | 説明                                                                            |
| -------------------- | ------------------------ | ------ | ------------------------------------------------------------------------------- |
| `colorSpace`（必須） | `"srgb" \| "display-p3"` |        | 色を解釈する色空間。画面からは変えられず、`${name}[colorSpace]`でそのまま送る。 |
| `hue`（必須）        | `number`                 |        | 色相。0〜360度。範囲外の値は範囲内に収める。                                    |
| `saturation`（必須） | `number`                 |        | HSVの彩度。0〜100パーセント。範囲外の値は範囲内に収める。                       |
| `brightness`（必須） | `number`                 |        | HSVの明度。0〜100パーセント。範囲外の値は範囲内に収める。                       |
| `alpha`（必須）      | `number`                 |        | 不透明度。0〜1。範囲外の値は範囲内に収める。                                    |

## コード

```tsx
import { Button, ColorPicker, Disclosure, Popover } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <ColorPicker
      id="color-picker-brand"
      label="ブランドの色"
      name="brandColor"
      value={{ colorSpace: "srgb", hue: 215, saturation: 68, brightness: 84, alpha: 1 }}
      help="色の面で大まかに選び、スライダーで正確に調整できます。"
    />
    <Disclosure summary="透明度・広色域・無効状態">
      <div class="rx-stack">
        <ColorPicker
          id="color-picker-overlay"
          label="重ねる色"
          name="overlayColor"
          value={{
            colorSpace: "display-p3",
            hue: 18,
            saturation: 83,
            brightness: 96,
            alpha: 0.52,
          }}
        />
        <ColorPicker
          id="color-picker-disabled"
          label="変更できない色"
          name="lockedColor"
          disabled
        />
        <ColorPicker
          id="color-picker-error"
          label="確認が必要な色"
          name="reviewColor"
          error="背景とのコントラストを確認してください。"
        />
      </div>
    </Disclosure>
    <Disclosure summary="Popover 内で色を選ぶ">
      <Popover
        id="color-picker-popover"
        label="色を編集"
        title="マーカーの色"
        size="wide"
        actions={
          <Button type="submit" form="color-picker-popover-form" variant="primary">
            適用する
          </Button>
        }
      >
        <form id="color-picker-popover-form">
          <ColorPicker
            id="color-picker-marker"
            label="マーカー"
            name="markerColor"
            form="color-picker-popover-form"
            value={{
              colorSpace: "srgb",
              hue: 42,
              saturation: 86,
              brightness: 98,
              alpha: 0.8,
            }}
          />
        </form>
      </Popover>
    </Disclosure>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <fieldset
    id="color-picker-brand"
    class="rx-field rx-color-picker"
    role="group"
    aria-labelledby="color-picker-brand-label"
    aria-describedby="color-picker-brand-help"
    data-controller="color-picker"
    data-color-picker-value-value='{"colorSpace":"srgb","hue":215,"saturation":68,"brightness":84,"alpha":1}'
    data-color-picker-step-value="1"
    style="
      --color-picker-hue: 215;
      --color-picker-saturation: 0.68;
      --color-picker-brightness: 0.84;
      --color-picker-alpha: 1;
      --color-picker-color: color(srgb 0.26879999999999993 0.5067999999999996 0.84 / 1);
      --color-picker-hue-color: color(srgb 0 0.4166666666666661 1 / 1);
      --color-picker-fallback: color(
        srgb 0.26879999999999993 0.5067999999999996 0.84 / 1
      );
    "
  >
    <legend id="color-picker-brand-label">ブランドの色</legend>
    <div class="editor">
      <div class="visual">
        <button
          aria-label="ブランドの色の彩度と明度"
          aria-controls="color-picker-brand-saturation color-picker-brand-brightness"
          aria-describedby="color-picker-brand-instructions"
          data-color-picker-target="area"
          data-icon-only="true"
          class="rx-button area"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          <span class="cursor" aria-hidden="true"></span>
        </button>
        <div class="preview">
          <span class="swatch" aria-hidden="true"></span
          ><span class="preview-label">選択中の色</span><span class="rx-tag">sRGB</span>
        </div>
      </div>
      <div class="channels">
        <div class="rx-field">
          <div class="heading"><label for="color-picker-brand-hue">色相</label></div>
          <div class="rx-range" data-channel="hue">
            <div class="controls">
              <div class="native">
                <input
                  id="color-picker-brand-hue"
                  class="input"
                  type="range"
                  name="brandColor[hue]"
                  min="0"
                  max="360"
                  step="any"
                  value="215"
                  data-color-picker-target="hueControl"
                />
              </div>
            </div>
            <div class="limits" aria-hidden="true"><span>0</span><span>360°</span></div>
          </div>
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="color-picker-brand-saturation">彩度</label>
          </div>
          <div class="rx-range" data-channel="saturation">
            <div class="controls">
              <div class="native">
                <input
                  id="color-picker-brand-saturation"
                  class="input"
                  type="range"
                  name="brandColor[saturation]"
                  min="0"
                  max="100"
                  step="any"
                  value="68"
                  data-color-picker-target="saturationControl"
                />
              </div>
            </div>
            <div class="limits" aria-hidden="true"><span>0</span><span>100%</span></div>
          </div>
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="color-picker-brand-brightness">明度</label>
          </div>
          <div class="rx-range" data-channel="brightness">
            <div class="controls">
              <div class="native">
                <input
                  id="color-picker-brand-brightness"
                  class="input"
                  type="range"
                  name="brandColor[brightness]"
                  min="0"
                  max="100"
                  step="any"
                  value="84"
                  data-color-picker-target="brightnessControl"
                />
              </div>
            </div>
            <div class="limits" aria-hidden="true"><span>0</span><span>100%</span></div>
          </div>
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="color-picker-brand-alpha">不透明度</label>
          </div>
          <div class="rx-range" data-channel="alpha">
            <div class="controls">
              <div class="native">
                <input
                  id="color-picker-brand-alpha"
                  class="input"
                  type="range"
                  name="brandColor[alpha]"
                  min="0"
                  max="1"
                  step="any"
                  value="1"
                  data-color-picker-target="alphaControl"
                />
              </div>
            </div>
            <div class="limits" aria-hidden="true"><span>0</span><span>100%</span></div>
          </div>
        </div>
      </div>
    </div>
    <input type="hidden" name="brandColor[colorSpace]" value="srgb" />
    <p
      id="color-picker-brand-instructions"
      class="rx-visually-hidden"
      data-color-picker-target="instructions"
    >
      色の面は左右で彩度、上下で明度を調整します。矢印キーでも操作できます。各スライダーからも調整できます。
    </p>
    <div class="messages">
      <p class="help" id="color-picker-brand-help">
        色の面で大まかに選び、スライダーで正確に調整できます。
      </p>
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
      ><span class="label"><span class="title">透明度・広色域・無効状態</span></span>
    </summary>
    <div class="body">
      <div class="rx-stack">
        <fieldset
          id="color-picker-overlay"
          class="rx-field rx-color-picker"
          role="group"
          aria-labelledby="color-picker-overlay-label"
          data-controller="color-picker"
          data-color-picker-value-value='{"colorSpace":"display-p3","hue":18,"saturation":83,"brightness":96,"alpha":0.52}'
          data-color-picker-step-value="1"
          style="
            --color-picker-hue: 18;
            --color-picker-saturation: 0.83;
            --color-picker-brightness: 0.96;
            --color-picker-alpha: 0.52;
            --color-picker-color: color(
              display-p3 0.96 0.40223999999999993 0.16320000000000004 / 0.52
            );
            --color-picker-hue-color: color(display-p3 1 0.2999999999999998 0 / 1);
            --color-picker-fallback: color(
              srgb 0.96 0.40223999999999993 0.16320000000000004 / 0.52
            );
          "
        >
          <legend id="color-picker-overlay-label">重ねる色</legend>
          <div class="editor">
            <div class="visual">
              <button
                aria-label="重ねる色の彩度と明度"
                aria-controls="color-picker-overlay-saturation color-picker-overlay-brightness"
                aria-describedby="color-picker-overlay-instructions"
                data-color-picker-target="area"
                data-icon-only="true"
                class="rx-button area"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="cursor" aria-hidden="true"></span>
              </button>
              <div class="preview">
                <span class="swatch" aria-hidden="true"></span
                ><span class="preview-label">選択中の色</span
                ><span class="rx-tag">Display P3</span>
              </div>
            </div>
            <div class="channels">
              <div class="rx-field">
                <div class="heading">
                  <label for="color-picker-overlay-hue">色相</label>
                </div>
                <div class="rx-range" data-channel="hue">
                  <div class="controls">
                    <div class="native">
                      <input
                        id="color-picker-overlay-hue"
                        class="input"
                        type="range"
                        name="overlayColor[hue]"
                        min="0"
                        max="360"
                        step="any"
                        value="18"
                        data-color-picker-target="hueControl"
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span><span>360°</span>
                  </div>
                </div>
              </div>
              <div class="rx-field">
                <div class="heading">
                  <label for="color-picker-overlay-saturation">彩度</label>
                </div>
                <div class="rx-range" data-channel="saturation">
                  <div class="controls">
                    <div class="native">
                      <input
                        id="color-picker-overlay-saturation"
                        class="input"
                        type="range"
                        name="overlayColor[saturation]"
                        min="0"
                        max="100"
                        step="any"
                        value="83"
                        data-color-picker-target="saturationControl"
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span><span>100%</span>
                  </div>
                </div>
              </div>
              <div class="rx-field">
                <div class="heading">
                  <label for="color-picker-overlay-brightness">明度</label>
                </div>
                <div class="rx-range" data-channel="brightness">
                  <div class="controls">
                    <div class="native">
                      <input
                        id="color-picker-overlay-brightness"
                        class="input"
                        type="range"
                        name="overlayColor[brightness]"
                        min="0"
                        max="100"
                        step="any"
                        value="96"
                        data-color-picker-target="brightnessControl"
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span><span>100%</span>
                  </div>
                </div>
              </div>
              <div class="rx-field">
                <div class="heading">
                  <label for="color-picker-overlay-alpha">不透明度</label>
                </div>
                <div class="rx-range" data-channel="alpha">
                  <div class="controls">
                    <div class="native">
                      <input
                        id="color-picker-overlay-alpha"
                        class="input"
                        type="range"
                        name="overlayColor[alpha]"
                        min="0"
                        max="1"
                        step="any"
                        value="0.52"
                        data-color-picker-target="alphaControl"
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span><span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input type="hidden" name="overlayColor[colorSpace]" value="display-p3" />
          <p
            id="color-picker-overlay-instructions"
            class="rx-visually-hidden"
            data-color-picker-target="instructions"
          >
            色の面は左右で彩度、上下で明度を調整します。矢印キーでも操作できます。各スライダーからも調整できます。
          </p>
        </fieldset>
        <fieldset
          id="color-picker-disabled"
          class="rx-field rx-color-picker"
          role="group"
          aria-labelledby="color-picker-disabled-label"
          disabled=""
          data-controller="color-picker"
          data-color-picker-value-value='{"colorSpace":"srgb","hue":215,"saturation":68,"brightness":84,"alpha":1}'
          data-color-picker-step-value="1"
          style="
            --color-picker-hue: 215;
            --color-picker-saturation: 0.68;
            --color-picker-brightness: 0.84;
            --color-picker-alpha: 1;
            --color-picker-color: color(
              srgb 0.26879999999999993 0.5067999999999996 0.84 / 1
            );
            --color-picker-hue-color: color(srgb 0 0.4166666666666661 1 / 1);
            --color-picker-fallback: color(
              srgb 0.26879999999999993 0.5067999999999996 0.84 / 1
            );
          "
        >
          <legend id="color-picker-disabled-label">変更できない色</legend>
          <div class="editor">
            <div class="visual">
              <button
                aria-label="変更できない色の彩度と明度"
                aria-controls="color-picker-disabled-saturation color-picker-disabled-brightness"
                aria-describedby="color-picker-disabled-instructions"
                data-color-picker-target="area"
                data-icon-only="true"
                class="rx-button area"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                <span class="cursor" aria-hidden="true"></span>
              </button>
              <div class="preview">
                <span class="swatch" aria-hidden="true"></span
                ><span class="preview-label">選択中の色</span
                ><span class="rx-tag">sRGB</span>
              </div>
            </div>
            <div class="channels">
              <div class="rx-field">
                <div class="heading">
                  <label for="color-picker-disabled-hue">色相</label>
                </div>
                <div class="rx-range" data-channel="hue">
                  <div class="controls">
                    <div class="native">
                      <input
                        id="color-picker-disabled-hue"
                        class="input"
                        type="range"
                        name="lockedColor[hue]"
                        min="0"
                        max="360"
                        step="any"
                        value="215"
                        data-color-picker-target="hueControl"
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span><span>360°</span>
                  </div>
                </div>
              </div>
              <div class="rx-field">
                <div class="heading">
                  <label for="color-picker-disabled-saturation">彩度</label>
                </div>
                <div class="rx-range" data-channel="saturation">
                  <div class="controls">
                    <div class="native">
                      <input
                        id="color-picker-disabled-saturation"
                        class="input"
                        type="range"
                        name="lockedColor[saturation]"
                        min="0"
                        max="100"
                        step="any"
                        value="68"
                        data-color-picker-target="saturationControl"
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span><span>100%</span>
                  </div>
                </div>
              </div>
              <div class="rx-field">
                <div class="heading">
                  <label for="color-picker-disabled-brightness">明度</label>
                </div>
                <div class="rx-range" data-channel="brightness">
                  <div class="controls">
                    <div class="native">
                      <input
                        id="color-picker-disabled-brightness"
                        class="input"
                        type="range"
                        name="lockedColor[brightness]"
                        min="0"
                        max="100"
                        step="any"
                        value="84"
                        data-color-picker-target="brightnessControl"
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span><span>100%</span>
                  </div>
                </div>
              </div>
              <div class="rx-field">
                <div class="heading">
                  <label for="color-picker-disabled-alpha">不透明度</label>
                </div>
                <div class="rx-range" data-channel="alpha">
                  <div class="controls">
                    <div class="native">
                      <input
                        id="color-picker-disabled-alpha"
                        class="input"
                        type="range"
                        name="lockedColor[alpha]"
                        min="0"
                        max="1"
                        step="any"
                        value="1"
                        data-color-picker-target="alphaControl"
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span><span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input type="hidden" name="lockedColor[colorSpace]" value="srgb" />
          <p
            id="color-picker-disabled-instructions"
            class="rx-visually-hidden"
            data-color-picker-target="instructions"
          >
            色の面は左右で彩度、上下で明度を調整します。矢印キーでも操作できます。各スライダーからも調整できます。
          </p>
        </fieldset>
        <fieldset
          id="color-picker-error"
          class="rx-field rx-color-picker"
          role="group"
          aria-labelledby="color-picker-error-label"
          aria-describedby="color-picker-error-error"
          aria-invalid="true"
          data-controller="color-picker"
          data-color-picker-value-value='{"colorSpace":"srgb","hue":215,"saturation":68,"brightness":84,"alpha":1}'
          data-color-picker-step-value="1"
          style="
            --color-picker-hue: 215;
            --color-picker-saturation: 0.68;
            --color-picker-brightness: 0.84;
            --color-picker-alpha: 1;
            --color-picker-color: color(
              srgb 0.26879999999999993 0.5067999999999996 0.84 / 1
            );
            --color-picker-hue-color: color(srgb 0 0.4166666666666661 1 / 1);
            --color-picker-fallback: color(
              srgb 0.26879999999999993 0.5067999999999996 0.84 / 1
            );
          "
        >
          <legend id="color-picker-error-label">確認が必要な色</legend>
          <div class="editor">
            <div class="visual">
              <button
                aria-label="確認が必要な色の彩度と明度"
                aria-controls="color-picker-error-saturation color-picker-error-brightness"
                aria-describedby="color-picker-error-instructions"
                data-color-picker-target="area"
                data-icon-only="true"
                class="rx-button area"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                <span class="cursor" aria-hidden="true"></span>
              </button>
              <div class="preview">
                <span class="swatch" aria-hidden="true"></span
                ><span class="preview-label">選択中の色</span
                ><span class="rx-tag">sRGB</span>
              </div>
            </div>
            <div class="channels">
              <div class="rx-field">
                <div class="heading">
                  <label for="color-picker-error-hue">色相</label>
                </div>
                <div class="rx-range" data-channel="hue">
                  <div class="controls">
                    <div class="native">
                      <input
                        id="color-picker-error-hue"
                        class="input"
                        type="range"
                        name="reviewColor[hue]"
                        min="0"
                        max="360"
                        step="any"
                        value="215"
                        data-color-picker-target="hueControl"
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span><span>360°</span>
                  </div>
                </div>
              </div>
              <div class="rx-field">
                <div class="heading">
                  <label for="color-picker-error-saturation">彩度</label>
                </div>
                <div class="rx-range" data-channel="saturation">
                  <div class="controls">
                    <div class="native">
                      <input
                        id="color-picker-error-saturation"
                        class="input"
                        type="range"
                        name="reviewColor[saturation]"
                        min="0"
                        max="100"
                        step="any"
                        value="68"
                        data-color-picker-target="saturationControl"
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span><span>100%</span>
                  </div>
                </div>
              </div>
              <div class="rx-field">
                <div class="heading">
                  <label for="color-picker-error-brightness">明度</label>
                </div>
                <div class="rx-range" data-channel="brightness">
                  <div class="controls">
                    <div class="native">
                      <input
                        id="color-picker-error-brightness"
                        class="input"
                        type="range"
                        name="reviewColor[brightness]"
                        min="0"
                        max="100"
                        step="any"
                        value="84"
                        data-color-picker-target="brightnessControl"
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span><span>100%</span>
                  </div>
                </div>
              </div>
              <div class="rx-field">
                <div class="heading">
                  <label for="color-picker-error-alpha">不透明度</label>
                </div>
                <div class="rx-range" data-channel="alpha">
                  <div class="controls">
                    <div class="native">
                      <input
                        id="color-picker-error-alpha"
                        class="input"
                        type="range"
                        name="reviewColor[alpha]"
                        min="0"
                        max="1"
                        step="any"
                        value="1"
                        data-color-picker-target="alphaControl"
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span><span>100%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <input type="hidden" name="reviewColor[colorSpace]" value="srgb" />
          <p
            id="color-picker-error-instructions"
            class="rx-visually-hidden"
            data-color-picker-target="instructions"
          >
            色の面は左右で彩度、上下で明度を調整します。矢印キーでも操作できます。各スライダーからも調整できます。
          </p>
          <div class="messages">
            <p class="error" id="color-picker-error-error">
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span>背景とのコントラストを確認してください。</span>
            </p>
          </div>
        </fieldset>
      </div>
    </div>
  </details>
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
      ><span class="label"><span class="title">Popover 内で色を選ぶ</span></span>
    </summary>
    <div class="body">
      <div class="rx-popover" data-controller="popover" data-align="start">
        <button
          popovertarget="color-picker-popover"
          style="
            anchor-name: --rx-popover-63-6f-6c-6f-72-2d-70-69-63-6b-65-72-2d-70-6f-70-6f-76-65-72;
          "
          data-popover-target="trigger"
          aria-haspopup="dialog"
          aria-controls="color-picker-popover"
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="default"
        >
          色を編集
        </button>
        <div
          id="color-picker-popover"
          popover="auto"
          class="panel rx-overlay"
          data-placement="anchor"
          style="
            --rx-overlay-anchor: --rx-popover-63-6f-6c-6f-72-2d-70-69-63-6b-65-72-2d-70-6f-70-6f-76-65-72;
          "
          data-popover-target="panel"
          data-align="start"
          data-size="wide"
          role="dialog"
          aria-labelledby="color-picker-popover-title"
        >
          <header class="heading">
            <div class="heading-row">
              <h3 id="color-picker-popover-title" tabindex="-1" autofocus="">
                マーカーの色
              </h3>
              <span class="close"
                ><button
                  popovertarget="color-picker-popover"
                  popovertargetaction="hide"
                  data-icon-only="true"
                  aria-label="閉じる"
                  class="rx-button"
                  type="button"
                  data-variant="primary"
                  data-size="default"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-x"></use>
                  </svg></button
              ></span>
            </div>
          </header>
          <div class="body">
            <form id="color-picker-popover-form">
              <fieldset
                id="color-picker-marker"
                class="rx-field rx-color-picker"
                role="group"
                aria-labelledby="color-picker-marker-label"
                data-controller="color-picker"
                data-color-picker-value-value='{"colorSpace":"srgb","hue":42,"saturation":86,"brightness":98,"alpha":0.8}'
                data-color-picker-step-value="1"
                style="
                  --color-picker-hue: 42;
                  --color-picker-saturation: 0.86;
                  --color-picker-brightness: 0.98;
                  --color-picker-alpha: 0.8;
                  --color-picker-color: color(
                    srgb 0.98 0.7271600000000003 0.13720000000000002 / 0.8
                  );
                  --color-picker-hue-color: color(srgb 1 0.7000000000000002 0 / 1);
                  --color-picker-fallback: color(
                    srgb 0.98 0.7271600000000003 0.13720000000000002 / 0.8
                  );
                "
              >
                <legend id="color-picker-marker-label">マーカー</legend>
                <div class="editor">
                  <div class="visual">
                    <button
                      aria-label="マーカーの彩度と明度"
                      aria-controls="color-picker-marker-saturation color-picker-marker-brightness"
                      aria-describedby="color-picker-marker-instructions"
                      data-color-picker-target="area"
                      data-icon-only="true"
                      class="rx-button area"
                      type="button"
                      data-variant="secondary"
                      data-size="default"
                    >
                      <span class="cursor" aria-hidden="true"></span>
                    </button>
                    <div class="preview">
                      <span class="swatch" aria-hidden="true"></span
                      ><span class="preview-label">選択中の色</span
                      ><span class="rx-tag">sRGB</span>
                    </div>
                  </div>
                  <div class="channels">
                    <div class="rx-field">
                      <div class="heading">
                        <label for="color-picker-marker-hue">色相</label>
                      </div>
                      <div class="rx-range" data-channel="hue">
                        <div class="controls">
                          <div class="native">
                            <input
                              id="color-picker-marker-hue"
                              class="input"
                              type="range"
                              name="markerColor[hue]"
                              form="color-picker-popover-form"
                              min="0"
                              max="360"
                              step="any"
                              value="42"
                              data-color-picker-target="hueControl"
                            />
                          </div>
                        </div>
                        <div class="limits" aria-hidden="true">
                          <span>0</span><span>360°</span>
                        </div>
                      </div>
                    </div>
                    <div class="rx-field">
                      <div class="heading">
                        <label for="color-picker-marker-saturation">彩度</label>
                      </div>
                      <div class="rx-range" data-channel="saturation">
                        <div class="controls">
                          <div class="native">
                            <input
                              id="color-picker-marker-saturation"
                              class="input"
                              type="range"
                              name="markerColor[saturation]"
                              form="color-picker-popover-form"
                              min="0"
                              max="100"
                              step="any"
                              value="86"
                              data-color-picker-target="saturationControl"
                            />
                          </div>
                        </div>
                        <div class="limits" aria-hidden="true">
                          <span>0</span><span>100%</span>
                        </div>
                      </div>
                    </div>
                    <div class="rx-field">
                      <div class="heading">
                        <label for="color-picker-marker-brightness">明度</label>
                      </div>
                      <div class="rx-range" data-channel="brightness">
                        <div class="controls">
                          <div class="native">
                            <input
                              id="color-picker-marker-brightness"
                              class="input"
                              type="range"
                              name="markerColor[brightness]"
                              form="color-picker-popover-form"
                              min="0"
                              max="100"
                              step="any"
                              value="98"
                              data-color-picker-target="brightnessControl"
                            />
                          </div>
                        </div>
                        <div class="limits" aria-hidden="true">
                          <span>0</span><span>100%</span>
                        </div>
                      </div>
                    </div>
                    <div class="rx-field">
                      <div class="heading">
                        <label for="color-picker-marker-alpha">不透明度</label>
                      </div>
                      <div class="rx-range" data-channel="alpha">
                        <div class="controls">
                          <div class="native">
                            <input
                              id="color-picker-marker-alpha"
                              class="input"
                              type="range"
                              name="markerColor[alpha]"
                              form="color-picker-popover-form"
                              min="0"
                              max="1"
                              step="any"
                              value="0.8"
                              data-color-picker-target="alphaControl"
                            />
                          </div>
                        </div>
                        <div class="limits" aria-hidden="true">
                          <span>0</span><span>100%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <input
                  type="hidden"
                  name="markerColor[colorSpace]"
                  form="color-picker-popover-form"
                  value="srgb"
                />
                <p
                  id="color-picker-marker-instructions"
                  class="rx-visually-hidden"
                  data-color-picker-target="instructions"
                >
                  色の面は左右で彩度、上下で明度を調整します。矢印キーでも操作できます。各スライダーからも調整できます。
                </p>
              </fieldset>
            </form>
          </div>
          <footer class="actions">
            <button
              form="color-picker-popover-form"
              class="rx-button"
              type="submit"
              data-variant="primary"
              data-size="default"
            >
              適用する
            </button>
          </footer>
        </div>
      </div>
    </div>
  </details>
</div>
```

</details>
