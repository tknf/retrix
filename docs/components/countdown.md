<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Countdown

期限や残りの数を、大きな数字の丸いバッジで示します。

## 使いどころ

- 締め切りまでの日数や残りの件数を、カードなどの端で目立たせる時に使います。
- 集計した値を名前・単位・条件と並べて比べる時は `Statistic` を使います。
- 状態を短い言葉で示す時は `Badge` を使います。

## 使い方

白い丸に `value` を大きな太字の数字で置き、`before` を数字の上、`after` を数字の下に小さく添えます。数字の代わりに「完」のような一文字も置けます。

役割の色（`tone`）の細いリングで縁取り、カードと同じ影で浮かせます。期限が迫る時は `danger`、単なる残数は `info` など、意味に合わせて選びます。

残りの数は利用側で数えて渡します。Countdownは時間の経過で数を変えません。

カードの縁にまたがせる時は、置く側で位置（`position` など）を決め、はみ出す分の余白も置く側で取ります。JavaScriptは使いません。

## アクセシビリティ

- 全体を `role="img"` にし、`label` を読み上げ名にします。中の数字と文言は読み上げないので、`label` に「締め切りまであと3日」のような全文を書きます。
- リングの色は補助です。急ぎかどうかは `label` と `before`・`after` の文言で伝えます。

## API

### Countdown

期限や残りを大きな数で示す丸いバッジ。役割の色の細い輪で縁取り、カードと同じ影で浮かせる。カードの縁にまたがせる時は、置く側で位置を決める。

| 名前            | 型                 | 既定値      | 説明                                                                           |
| --------------- | ------------------ | ----------- | ------------------------------------------------------------------------------ |
| `value`（必須） | `string \| number` |             | 大きく表示する数。                                                             |
| `before`        | `string`           |             | 数の上に小さく表示する言葉（「あと」「閉じるまで」など）。                     |
| `after`         | `string`           |             | 数の下に小さく表示する単位（「日」など）。                                     |
| `label`（必須） | `string`           |             | 読み上げの全文（「自動で閉じるまであと70日」など）。                           |
| `tone`          | `Tone`             | `"warning"` | 輪の役割の色。期限が迫る時はdanger、ただの残数はinfoなど、意味に合わせて選ぶ。 |

ほかに、`<span>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/countdown.css`

#### `Tone`

値：`"neutral" | "info" | "success" | "warning" | "danger"`

## コード

```tsx
import { Countdown, Card, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <Countdown
        value={70}
        before="閉じるまで"
        after="日"
        label="自動で閉じるまであと70日"
      />
      <Countdown
        value={3}
        before="あと"
        after="日"
        tone="danger"
        label="締め切りまであと3日"
      />
      <Countdown value={12} before="残り" after="件" tone="info" label="残り12件" />
      <Countdown value="完" tone="success" label="完了" />
    </div>
    <DisclosureGroup label="置き場所の違い">
      <Disclosure summary="カードの縁にまたがせる（置く側で位置を決める）" open>
        <div style="position: relative; max-inline-size: 24rem; padding-inline-end: 1.5rem">
          <Card title="会場を予約する">
            <p>第二会議室を18時から21時まで。</p>
          </Card>
          <Countdown
            value={5}
            before="あと"
            after="日"
            label="締め切りまであと5日"
            style="position: absolute; inset-block-start: 0.75rem; inset-inline-end: 0"
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Countdown
            value={70}
            before="يغلق خلال"
            after="يوم"
            label="يغلق خلال 70 يوم"
          />
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
  <div class="rx-cluster">
    <span
      class="rx-countdown"
      data-tone="warning"
      role="img"
      aria-label="自動で閉じるまであと70日"
      ><span class="before">閉じるまで</span><strong class="value">70</strong
      ><span class="after">日</span></span
    ><span
      class="rx-countdown"
      data-tone="danger"
      role="img"
      aria-label="締め切りまであと3日"
      ><span class="before">あと</span><strong class="value">3</strong
      ><span class="after">日</span></span
    ><span class="rx-countdown" data-tone="info" role="img" aria-label="残り12件"
      ><span class="before">残り</span><strong class="value">12</strong
      ><span class="after">件</span></span
    ><span class="rx-countdown" data-tone="success" role="img" aria-label="完了"
      ><strong class="value">完</strong></span
    >
  </div>
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
        ><span class="label"
          ><span class="title"
            >カードの縁にまたがせる（置く側で位置を決める）</span
          ></span
        >
      </summary>
      <div class="body">
        <div
          style="position: relative; max-inline-size: 24rem; padding-inline-end: 1.5rem"
        >
          <article class="rx-card">
            <h3 class="title">会場を予約する</h3>
            <div class="body"><p>第二会議室を18時から21時まで。</p></div>
          </article>
          <span
            style="position: absolute; inset-block-start: 0.75rem; inset-inline-end: 0"
            class="rx-countdown"
            data-tone="warning"
            role="img"
            aria-label="締め切りまであと5日"
            ><span class="before">あと</span><strong class="value">5</strong
            ><span class="after">日</span></span
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
        <div dir="rtl" lang="ar">
          <span
            class="rx-countdown"
            data-tone="warning"
            role="img"
            aria-label="يغلق خلال 70 يوم"
            ><span class="before">يغلق خلال</span><strong class="value">70</strong
            ><span class="after">يوم</span></span
          >
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
