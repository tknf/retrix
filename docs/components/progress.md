<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Progress

処理の進み具合を示します。終わりが分からない処理にも使えます。

## 使いどころ

- 送信や書き出しなど、時間のかかる処理がどこまで進んだかをバーで示す時に使います。
- 作業量が分からない継続処理も、`value` を省いたProgressで示します。
- 短い読み込みを言葉で示す時は `Loading`、ボタンを押した後の待ちは `Button` の `busy` を使います。
- 手順の中の今の段階を示す時は `Steps` を使います。

## 使い方

`label` に処理の名前、`value` に終えた量、`max` に全体の量を渡します。バーの上に処理の名前と、末尾側に割合を茶色の小さな太字で書きます。バーは淡い灰色の沈んだ細い溝（高さ8px、角2px）に、実際の割合の長さで描きます。

`value` は0〜`max` に収めます。割合は0.1%単位で切り捨てて書き、`max` に達するまでは100%と書かずに99.9%で止めます。0より大きく0.1%に満たない時は「<0.1%」と書きます。

バーはオンの塗りと同じ青緑の縦の塗りにし、`value` が `max` に達すると緑の縦の塗りになります。

`value` を省くと、終わりが分からない表示になり、割合を書かずに、溝いっぱいのバーの中で淡い青緑の濃淡をゆっくり一方向へ流し続けます。経過時間から割合を作りません。

進み具合を変える時は、利用側で新しい `value` で描き直します。JavaScriptは使いません。

## アクセシビリティ

- 標準の `progress` 要素を見えない形で持ち、`label` 要素で処理の名前と結びます。読み上げは `progress` の値で行い、見える割合の文字は読み上げから外します。
- 終わりが分からない時は、`progress` を値の無い状態にします。
- 動きを減らす設定では色を流さず、青緑の濃淡を溝いっぱいに敷いたまま止めます。

## API

### Progress

| 名前            | 型       | 既定値 | 説明                                                                                                                                                                                |
| --------------- | -------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須） | `string` |        | 処理の名前（「添付ファイルを送信しています」など）。バーの上に書き、進捗の読み上げ名にもする。                                                                                      |
| `value`         | `number` |        | 終えた量。0〜maxに収めて描く。省略するか有限でない値を渡すと、進捗が分からない状態の表示になる。 max以上の時だけ完了として100%と書き、それまでは0.1%単位で切り捨てて99.9%で止める。 |
| `max`           | `number` | `100`  | 全体の量。0以下や有限でない値は1として扱う。                                                                                                                                        |

ほかに、`<label>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/progress.css`

## コード

```tsx
import { Progress, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack">
    <Progress label="処理待ち" value={0} />
    <Progress label="添付ファイルを送信しています" value={3} max={5} />
    <Progress label="送信完了直前" value={99.5} max={100} />
    <Progress label="送信が完了しました" value={100} />
    <Progress label="残り時間を確認中" />
    <Progress
      label="すべての添付ファイルと画像の変換が完了するまでお待ちください"
      value={7}
      max={12}
    />
    <DisclosureGroup label="置き場所の違い">
      <Disclosure summary="少しだけ進んだ" open>
        <Progress label="読み込みを始めました" value={1} max={100} />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div class="rx-stack" style="max-inline-size: 14rem">
          <Progress label="秋の読書会の資料と参加者名簿を書き出しています" value={42} />
          <Progress label="確認中" />
          <Progress label="完了" value={8} max={8} />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div class="rx-stack" dir="rtl" lang="ar">
          <Progress label="جارٍ إرسال المرفقات" value={3} max={5} />
          <Progress label="اكتمل الإرسال" value={100} />
          <Progress label="جارٍ التحقق" />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <label class="rx-progress"
    ><span class="heading"
      ><span>処理待ち</span><span class="value" aria-hidden="true">0%</span></span
    ><span class="track" data-state="determinate" aria-hidden="true"
      ><span class="fill" style="inline-size: 0%"></span></span
    ><progress class="rx-visually-hidden" value="0" max="100">0%</progress></label
  ><label class="rx-progress"
    ><span class="heading"
      ><span>添付ファイルを送信しています</span
      ><span class="value" aria-hidden="true">60%</span></span
    ><span class="track" data-state="determinate" aria-hidden="true"
      ><span class="fill" style="inline-size: 60%"></span></span
    ><progress class="rx-visually-hidden" value="3" max="5">60%</progress></label
  ><label class="rx-progress"
    ><span class="heading"
      ><span>送信完了直前</span
      ><span class="value" aria-hidden="true">99.5%</span></span
    ><span class="track" data-state="determinate" aria-hidden="true"
      ><span class="fill" style="inline-size: 99.5%"></span></span
    ><progress class="rx-visually-hidden" value="99.5" max="100">99.5%</progress></label
  ><label class="rx-progress"
    ><span class="heading"
      ><span>送信が完了しました</span
      ><span class="value" aria-hidden="true">100%</span></span
    ><span class="track" data-state="complete" aria-hidden="true"
      ><span class="fill" style="inline-size: 100%"></span></span
    ><progress class="rx-visually-hidden" value="100" max="100">100%</progress></label
  ><label class="rx-progress"
    ><span class="heading"><span>残り時間を確認中</span></span
    ><span class="track" data-state="indeterminate" aria-hidden="true"
      ><span class="fill"></span></span
    ><progress class="rx-visually-hidden" max="100">処理中</progress></label
  ><label class="rx-progress"
    ><span class="heading"
      ><span>すべての添付ファイルと画像の変換が完了するまでお待ちください</span
      ><span class="value" aria-hidden="true">58.3%</span></span
    ><span class="track" data-state="determinate" aria-hidden="true"
      ><span class="fill" style="inline-size: 58.333333333333336%"></span></span
    ><progress class="rx-visually-hidden" value="7" max="12">58.3%</progress></label
  >
  <div class="rx-disclosure-group" role="group" aria-label="置き場所の違い">
    <details open="" class="rx-disclosure">
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
        ><span class="label"><span class="title">少しだけ進んだ</span></span>
      </summary>
      <div class="body">
        <label class="rx-progress"
          ><span class="heading"
            ><span>読み込みを始めました</span
            ><span class="value" aria-hidden="true">1%</span></span
          ><span class="track" data-state="determinate" aria-hidden="true"
            ><span class="fill" style="inline-size: 1%"></span></span
          ><progress class="rx-visually-hidden" value="1" max="100">1%</progress></label
        >
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
        ><span class="label"><span class="title">狭い場所で折り返す</span></span>
      </summary>
      <div class="body">
        <div class="rx-stack" style="max-inline-size: 14rem">
          <label class="rx-progress"
            ><span class="heading"
              ><span>秋の読書会の資料と参加者名簿を書き出しています</span
              ><span class="value" aria-hidden="true">42%</span></span
            ><span class="track" data-state="determinate" aria-hidden="true"
              ><span class="fill" style="inline-size: 42%"></span></span
            ><progress class="rx-visually-hidden" value="42" max="100">
              42%
            </progress></label
          ><label class="rx-progress"
            ><span class="heading"><span>確認中</span></span
            ><span class="track" data-state="indeterminate" aria-hidden="true"
              ><span class="fill"></span></span
            ><progress class="rx-visually-hidden" max="100">処理中</progress></label
          ><label class="rx-progress"
            ><span class="heading"
              ><span>完了</span><span class="value" aria-hidden="true">100%</span></span
            ><span class="track" data-state="complete" aria-hidden="true"
              ><span class="fill" style="inline-size: 100%"></span></span
            ><progress class="rx-visually-hidden" value="8" max="8">
              100%
            </progress></label
          >
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
        ><span class="label"><span class="title">右から左に読む場合</span></span>
      </summary>
      <div class="body">
        <div class="rx-stack" dir="rtl" lang="ar">
          <label class="rx-progress"
            ><span class="heading"
              ><span>جارٍ إرسال المرفقات</span
              ><span class="value" aria-hidden="true">60%</span></span
            ><span class="track" data-state="determinate" aria-hidden="true"
              ><span class="fill" style="inline-size: 60%"></span></span
            ><progress class="rx-visually-hidden" value="3" max="5">
              60%
            </progress></label
          ><label class="rx-progress"
            ><span class="heading"
              ><span>اكتمل الإرسال</span
              ><span class="value" aria-hidden="true">100%</span></span
            ><span class="track" data-state="complete" aria-hidden="true"
              ><span class="fill" style="inline-size: 100%"></span></span
            ><progress class="rx-visually-hidden" value="100" max="100">
              100%
            </progress></label
          ><label class="rx-progress"
            ><span class="heading"><span>جارٍ التحقق</span></span
            ><span class="track" data-state="indeterminate" aria-hidden="true"
              ><span class="fill"></span></span
            ><progress class="rx-visually-hidden" max="100">処理中</progress></label
          >
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
