<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# ImageCropper

画像の切り抜く範囲を、画像の上の操作と数値の両方で調整します。

## 使いどころ

- 表紙やアイコンなど、画像のどこを使うかを利用者に決めてもらう時に使います。
- 画像を決まった比率で見せるだけなら `ImageFrame`、画像ファイルを選んで送るだけなら `FileInput` を使います。

## 使い方

`label`・`alt`・`src` と、元画像の実寸 `imageWidth`・`imageHeight` を渡します。表示面を元画像と同じ縦横比にし、その上に切り抜く枠を重ねます。枠はドラッグで移動し、下端のハンドルで大きさを変えます。拡大率のスライダーと、「位置と大きさを細かく調整」の中の横・縦の位置、幅・高さのスライダーも同じ値に合わせて動きます。

`value` の位置と大きさは表示面に対するパーセント（`x`・`y`・`width`・`height`）、`zoom` は1〜5の拡大率、`offsetX`・`offsetY` は拡大した画像のずれです。範囲外の値は端に丸めます。有限でない数、正の整数でない実寸を渡すと `RangeError` を投げます。

`src` を渡さなければ画像なしの枠と `emptyLabel` を出し、controllerは付けません。`disabled` は枠とスライダーを全て止めます。

送信する値は持ちません。枠を動かすと `image-cropper:change` を発火して新しい範囲を渡すので、利用側がこれを受けて隠し欄に入れるか、保存の処理へ渡します。detailの `sourceRect` は元画像の幅と高さを1とした範囲（左上が原点、書く向きによらない）で、そのまま切り抜きに使えます。切り抜いた画像の生成・保存は利用側で行います。

`ImageCropperController` が接続するまで、ハンドルと調整の欄は出さず、初めの範囲で切り抜いた画像だけを見せます。JavaScriptが無い時は、この見本のままで範囲は変えられません。

## キーボード

| キー                                            | 動作                                                   |
| ----------------------------------------------- | ------------------------------------------------------ |
| ←・→・↑・↓（枠）                                | 枠を1%ずつ動かします。右から左に読む時は左右が逆です。 |
| Shift＋矢印（枠）                               | 枠の幅・高さを1%ずつ変えます。                         |
| 矢印（ハンドル）                                | 枠の幅・高さを1%ずつ変えます。                         |
| +・=・-（枠・ハンドル）                         | 拡大率を0.1ずつ上げ・下げます。                        |
| Esc                                             | ドラッグ中の変更を取り消し、元の範囲に戻します。       |
| 矢印・Home・End・PageUp・PageDown（スライダー） | ブラウザの標準のスライダーの動きで、その値を変えます。 |

## アクセシビリティ

- 全体は `role="group"` で、`label` の見出し（`h3`）を名前にします。
- 枠は「選択範囲を移動」、ハンドルは「選択範囲の大きさを変更」の名前を持つボタンで、操作の仕方の文を `aria-describedby` に関連付け、`aria-controls` で対応するスライダーを指します。
- 画像には `alt` を付けます。切り抜いた結果を画像だけで伝えないよう、スライダーの名前と値でも伝えます。

## イベント

| イベント                     | 内容                                                                                                                                                                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image-cropper:beforechange` | 範囲を変える前に出します。取り消せます（取り消すと元の範囲に戻します）。detailは `image-cropper:change` と同じです。                                                                                                                                  |
| `image-cropper:change`       | 範囲を変えた後に出します。detailは `{ value, previousValue, sourceRect, previousSourceRect, reason }` で、`value` は `ImageCropperValue`、`sourceRect` は元画像に対する `{ x, y, width, height }`（0〜1）、`reason` は `pointer` か `keyboard` です。 |

## API

### ImageCropper

| 名前                      | 型                    | 既定値                       | 説明                                                                                                                                     |
| ------------------------- | --------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                      | `string`              |                              | ルートのID。中のスライダーと見出しのIDの頭にも使う。渡さなければ自動で作る。                                                             |
| `label`（必須）           | `string`              |                              | 見出し（h3）に出し、まとまり全体の読み上げ名にする。                                                                                     |
| `alt`（必須）             | `string`              |                              | 画像の代替テキスト。画像が無い時は代わりの枠に使う。                                                                                     |
| `value`                   | `ImageCropperValue`   | `defaultValue`               | 初期の切り抜き範囲と拡大率。位置と大きさは表示領域に対するパーセント。範囲外の値は範囲内に収め、有限でない数があるとRangeErrorを投げる。 |
| `disabled`                | `boolean`             | `false`                      | 枠の移動・大きさの変更・スライダーをすべて止める。                                                                                       |
| `emptyLabel`              | `string`              | `"編集する画像がありません"` | srcが無い時に出す文。                                                                                                                    |
| `src`（形による）         | `string \| undefined` |                              | 切り抜く画像のURL。渡さなければ画像なしの表示にし、controllerを付けない。                                                                |
| `imageWidth`（形による）  | `number`              |                              | 元画像の実寸。表示領域も同じ縦横比にして選択座標を画像へ正しく対応させる。                                                               |
| `imageHeight`（形による） | `number`              |                              | 元画像の実寸の高さ（px）。imageWidthと同じく正の整数で、違えばRangeErrorを投げる。                                                       |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`image-cropper`（`ImageCropperController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/disclosure.css`、`components/image-frame.css`、`components/icon.css`、`components/range.css`、`components/image-cropper.css`

## コード

```tsx
import { Disclosure, ImageCropper } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <ImageCropper
      id="hono-image-cropper"
      label="表紙の切り抜き"
      src="/assets/sample-cover.svg"
      alt="暮らしの記録の表紙"
      imageWidth={400}
      imageHeight={560}
      value={{ x: 12, y: 18, width: 76, height: 60, zoom: 1, offsetX: 0, offsetY: 0 }}
    />
    <Disclosure summary="画像なし・編集不可">
      <div class="rx-stack">
        <ImageCropper label="画像なし" alt="未登録の表紙" />
        <ImageCropper
          label="編集不可の表紙"
          src="/assets/sample-cover.svg"
          alt="暮らしの記録の表紙"
          imageWidth={400}
          imageHeight={560}
          disabled
        />
      </div>
    </Disclosure>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div
    id="hono-image-cropper"
    class="rx-image-cropper"
    role="group"
    aria-labelledby="hono-image-cropper-heading"
    data-controller="image-cropper"
    data-image-cropper-value-value='{"x":12,"y":18,"width":76,"height":60,"zoom":1,"offsetX":0,"offsetY":0}'
    data-image-cropper-max-zoom-value="5"
    style="
      --rx-cropper-aspect: 0.7142857142857143;
      --image-cropper-x: 12;
      --image-cropper-y: 18;
      --image-cropper-width: 76;
      --image-cropper-height: 60;
      --image-cropper-zoom: 1;
      --image-cropper-offset-x: 0;
      --image-cropper-offset-y: 0;
    "
  >
    <h3 class="title" id="hono-image-cropper-heading">表紙の切り抜き</h3>
    <div class="layout">
      <div class="stage">
        <div
          class="viewport"
          id="hono-image-cropper-viewport"
          data-image-cropper-target="viewport"
        >
          <img
            src="/assets/sample-cover.svg"
            alt="暮らしの記録の表紙"
            width="400"
            height="560"
            draggable="false"
            data-image-cropper-target="image"
          /><button
            aria-label="選択範囲を移動"
            aria-controls="hono-image-cropper-x hono-image-cropper-y"
            aria-describedby="hono-image-cropper-instructions"
            data-image-cropper-target="selection"
            class="rx-button selection"
            type="button"
            data-variant="secondary"
            data-size="default"
          ></button
          ><button
            aria-label="選択範囲の大きさを変更"
            aria-controls="hono-image-cropper-width hono-image-cropper-height"
            aria-describedby="hono-image-cropper-instructions"
            data-image-cropper-target="resize"
            class="rx-button resize"
            type="button"
            data-variant="secondary"
            data-size="default"
          ></button>
        </div>
      </div>
      <div class="settings">
        <div class="rx-range">
          <div class="heading">
            <label class="label" for="hono-image-cropper-zoom">拡大率</label>
          </div>
          <div class="controls">
            <div class="native">
              <input
                id="hono-image-cropper-zoom"
                aria-controls="hono-image-cropper-viewport"
                class="input"
                type="range"
                min="1"
                max="5"
                step="any"
                value="1"
                data-image-cropper-target="zoomControl"
              />
            </div>
          </div>
        </div>
        <details class="rx-disclosure position">
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
            ><span class="label"
              ><span class="title">位置と大きさを細かく調整</span></span
            >
          </summary>
          <div class="body">
            <div class="ranges">
              <div class="rx-range">
                <div class="heading">
                  <label class="label" for="hono-image-cropper-x">横の位置</label>
                </div>
                <div class="controls">
                  <div class="native">
                    <input
                      id="hono-image-cropper-x"
                      aria-controls="hono-image-cropper-viewport"
                      class="input"
                      type="range"
                      min="0"
                      max="24"
                      step="any"
                      value="12"
                      data-image-cropper-target="xControl"
                    />
                  </div>
                </div>
              </div>
              <div class="rx-range">
                <div class="heading">
                  <label class="label" for="hono-image-cropper-y">縦の位置</label>
                </div>
                <div class="controls">
                  <div class="native">
                    <input
                      id="hono-image-cropper-y"
                      aria-controls="hono-image-cropper-viewport"
                      class="input"
                      type="range"
                      min="0"
                      max="40"
                      step="any"
                      value="18"
                      data-image-cropper-target="yControl"
                    />
                  </div>
                </div>
              </div>
              <div class="rx-range">
                <div class="heading">
                  <label class="label" for="hono-image-cropper-width">選択幅</label>
                </div>
                <div class="controls">
                  <div class="native">
                    <input
                      id="hono-image-cropper-width"
                      aria-controls="hono-image-cropper-viewport"
                      class="input"
                      type="range"
                      min="1"
                      max="88"
                      step="any"
                      value="76"
                      data-image-cropper-target="widthControl"
                    />
                  </div>
                </div>
              </div>
              <div class="rx-range">
                <div class="heading">
                  <label class="label" for="hono-image-cropper-height">選択高さ</label>
                </div>
                <div class="controls">
                  <div class="native">
                    <input
                      id="hono-image-cropper-height"
                      aria-controls="hono-image-cropper-viewport"
                      class="input"
                      type="range"
                      min="1"
                      max="82"
                      step="any"
                      value="60"
                      data-image-cropper-target="heightControl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </details>
        <p
          class="instructions"
          id="hono-image-cropper-instructions"
          data-image-cropper-target="instructions"
        >
          枠をドラッグして移動、下端のハンドルで大きさを変更します。矢印キーでも調整できます。
        </p>
      </div>
    </div>
  </div>
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
      ><span class="label"><span class="title">画像なし・編集不可</span></span>
    </summary>
    <div class="body">
      <div class="rx-stack">
        <div
          id="rx-image-cropper-:r27:"
          class="rx-image-cropper"
          data-empty="true"
          aria-labelledby="rx-image-cropper-:r27:-heading"
        >
          <h3 class="title" id="rx-image-cropper-:r27:-heading">画像なし</h3>
          <div class="empty">
            <figure class="rx-image-frame" data-shape="square" data-fit="contain">
              <div class="image">
                <span role="img" aria-label="未登録の表紙：画像なし">画像なし</span>
              </div>
            </figure>
            <p>編集する画像がありません</p>
          </div>
        </div>
        <div
          id="rx-image-cropper-:r28:"
          class="rx-image-cropper"
          role="group"
          aria-labelledby="rx-image-cropper-:r28:-heading"
          data-controller="image-cropper"
          data-image-cropper-value-value='{"x":25,"y":25,"width":50,"height":50,"zoom":1,"offsetX":0,"offsetY":0}'
          data-image-cropper-max-zoom-value="5"
          data-disabled="true"
          style="
            --rx-cropper-aspect: 0.7142857142857143;
            --image-cropper-x: 25;
            --image-cropper-y: 25;
            --image-cropper-width: 50;
            --image-cropper-height: 50;
            --image-cropper-zoom: 1;
            --image-cropper-offset-x: 0;
            --image-cropper-offset-y: 0;
          "
        >
          <h3 class="title" id="rx-image-cropper-:r28:-heading">編集不可の表紙</h3>
          <div class="layout">
            <div class="stage">
              <div
                class="viewport"
                id="rx-image-cropper-:r28:-viewport"
                data-image-cropper-target="viewport"
              >
                <img
                  src="/assets/sample-cover.svg"
                  alt="暮らしの記録の表紙"
                  width="400"
                  height="560"
                  draggable="false"
                  data-image-cropper-target="image"
                /><button
                  aria-label="選択範囲を移動"
                  aria-controls="rx-image-cropper-:r28:-x rx-image-cropper-:r28:-y"
                  aria-describedby="rx-image-cropper-:r28:-instructions"
                  data-image-cropper-target="selection"
                  class="rx-button selection"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                  disabled=""
                ></button
                ><button
                  aria-label="選択範囲の大きさを変更"
                  aria-controls="rx-image-cropper-:r28:-width rx-image-cropper-:r28:-height"
                  aria-describedby="rx-image-cropper-:r28:-instructions"
                  data-image-cropper-target="resize"
                  class="rx-button resize"
                  type="button"
                  data-variant="secondary"
                  data-size="default"
                  disabled=""
                ></button>
              </div>
            </div>
            <div class="settings">
              <div class="rx-range">
                <div class="heading">
                  <label class="label" for="rx-image-cropper-:r28:-zoom">拡大率</label>
                </div>
                <div class="controls">
                  <div class="native">
                    <input
                      id="rx-image-cropper-:r28:-zoom"
                      aria-controls="rx-image-cropper-:r28:-viewport"
                      class="input"
                      type="range"
                      min="1"
                      max="5"
                      step="any"
                      value="1"
                      disabled=""
                      data-image-cropper-target="zoomControl"
                    />
                  </div>
                </div>
              </div>
              <details class="rx-disclosure position">
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
                  ><span class="label"
                    ><span class="title">位置と大きさを細かく調整</span></span
                  >
                </summary>
                <div class="body">
                  <div class="ranges">
                    <div class="rx-range">
                      <div class="heading">
                        <label class="label" for="rx-image-cropper-:r28:-x"
                          >横の位置</label
                        >
                      </div>
                      <div class="controls">
                        <div class="native">
                          <input
                            id="rx-image-cropper-:r28:-x"
                            aria-controls="rx-image-cropper-:r28:-viewport"
                            class="input"
                            type="range"
                            min="0"
                            max="50"
                            step="any"
                            value="25"
                            disabled=""
                            data-image-cropper-target="xControl"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="rx-range">
                      <div class="heading">
                        <label class="label" for="rx-image-cropper-:r28:-y"
                          >縦の位置</label
                        >
                      </div>
                      <div class="controls">
                        <div class="native">
                          <input
                            id="rx-image-cropper-:r28:-y"
                            aria-controls="rx-image-cropper-:r28:-viewport"
                            class="input"
                            type="range"
                            min="0"
                            max="50"
                            step="any"
                            value="25"
                            disabled=""
                            data-image-cropper-target="yControl"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="rx-range">
                      <div class="heading">
                        <label class="label" for="rx-image-cropper-:r28:-width"
                          >選択幅</label
                        >
                      </div>
                      <div class="controls">
                        <div class="native">
                          <input
                            id="rx-image-cropper-:r28:-width"
                            aria-controls="rx-image-cropper-:r28:-viewport"
                            class="input"
                            type="range"
                            min="1"
                            max="75"
                            step="any"
                            value="50"
                            disabled=""
                            data-image-cropper-target="widthControl"
                          />
                        </div>
                      </div>
                    </div>
                    <div class="rx-range">
                      <div class="heading">
                        <label class="label" for="rx-image-cropper-:r28:-height"
                          >選択高さ</label
                        >
                      </div>
                      <div class="controls">
                        <div class="native">
                          <input
                            id="rx-image-cropper-:r28:-height"
                            aria-controls="rx-image-cropper-:r28:-viewport"
                            class="input"
                            type="range"
                            min="1"
                            max="75"
                            step="any"
                            value="50"
                            disabled=""
                            data-image-cropper-target="heightControl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
              <p
                class="instructions"
                id="rx-image-cropper-:r28:-instructions"
                data-image-cropper-target="instructions"
              >
                枠をドラッグして移動、下端のハンドルで大きさを変更します。矢印キーでも調整できます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </details>
</div>
```

</details>
