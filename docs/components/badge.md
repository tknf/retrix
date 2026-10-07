<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Badge

短い状態を、文言と役割の色で示します。

## 使いどころ

- 公開中・確認待ち・送信失敗など、対象の今の状態を短い言葉で示す時に使います。
- 分類や選んだ条件を示す時は、縁で示す `Tag` を使います。
- 状態の理由や次の操作まで伝える時は `Notice` を使います。
- 期限までの日数などの数を目立たせる時は `Countdown` を使います。

## 使い方

childrenに短い文言を渡し、`tone` で役割を選びます。役割の色を淡く混ぜた地に、役割の色で文字を書きます。枠線・影・アイコンは付けず、色だけで分けます。

審査や予約などの業務の状態は、アプリ側で文言と `tone` の役割へ変換します。

`draft` は下書きなどのまだ確定していない状態で、`tone` を渡しても役割の色を持たせず、中立の灰色で示します。

一行ではピルの形で、長い文言は文節の切れ目で折り返し、角をカードと同じ角丸にします。`size="small"` はタイルのアイコンの上などに重ねる小さなバッジです。JavaScriptは使いません。

## アクセシビリティ

- 文言をそのまま読み上げます。色は補助なので、状態の意味は文言で伝えます。
- 「0件」のように文言だけでは何の状態か伝わらない時は、隣の文で何の数かを書きます。Badgeは役割の無い `span` で、`aria-label` の名前は読み上げで無視されることがあるので、`aria-label` では補いません。
- 強制カラーモードでは地が消えるので、縁を表示します。

## API

### Badge

短い状態を文言と色の役割で示す。役割の無いspanなので、意味はaria-labelではなく文言か隣の文で伝える。

| 名前       | 型                     | 既定値      | 説明                                                                                                 |
| ---------- | ---------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `tone`     | `Tone`                 | `"neutral"` | 状態の役割。地と文字をその色にする。業務の状態（審査中・予約済みなど）は利用側でこの役割へ変換する。 |
| `draft`    | `boolean`              | `false`     | 下書きなど、まだ確定していない状態。役割の色を持たせず、中立の見た目で示す。                         |
| `size`     | `"default" \| "small"` | `"default"` | smallはタイルのアイコンの上などに重ねる小さなバッジ。                                                |
| `children` | `Child`                |             | 状態の短い文言。                                                                                     |

ほかに、`<span>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/badge.css`

#### `Tone`

値：`"neutral" | "info" | "success" | "warning" | "danger"`

## コード

```tsx
import { Badge, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack" data-space="small">
    <div class="rx-cluster">
      <Badge draft>下書き</Badge>
      <Badge>保留</Badge>
      <Badge tone="info">確認待ち</Badge>
      <Badge tone="success">公開中</Badge>
      <Badge tone="warning">期限が近づいています</Badge>
      <Badge tone="danger">送信失敗</Badge>
    </div>
    <p>
      今月の予約 <Badge>0件</Badge>
    </p>
    <Badge tone="info">担当者と管理者による公開前の最終確認を待っています</Badge>
    <DisclosureGroup label="役割と状態の組み合わせ">
      <Disclosure summary="役割ごと" open>
        <div class="rx-cluster">
          <Badge>保留</Badge>
          <Badge tone="info">確認待ち</Badge>
          <Badge tone="success">公開中</Badge>
          <Badge tone="warning">残りわずか</Badge>
          <Badge tone="danger">送信失敗</Badge>
        </div>
      </Disclosure>
      <Disclosure summary="下書き：役割の色を持たせない">
        <div class="rx-cluster">
          <Badge draft>下書き</Badge>
          <Badge tone="info" draft>
            予約の仮押さえ
          </Badge>
          <Badge tone="success" draft>
            公開予定
          </Badge>
          <Badge tone="warning" draft>
            要確認の下書き
          </Badge>
          <Badge tone="danger" draft>
            取り下げ予定
          </Badge>
        </div>
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div class="rx-stack" data-space="small" style="max-inline-size: 12rem">
          <Badge tone="warning">期限が近づいています。今週中に提出してください</Badge>
          <Badge draft>公開前に担当者の確認を待つ下書き</Badge>
          <Badge tone="success">担当者と管理者が承認済み</Badge>
          <Badge>https://example.com/articles/autumn-reading-club-2026</Badge>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div class="rx-cluster" dir="rtl" lang="ar">
          <Badge draft>مسودة</Badge>
          <Badge>معلق</Badge>
          <Badge tone="info">قيد المراجعة</Badge>
          <Badge tone="success">تمت الموافقة</Badge>
          <Badge tone="danger">فشل الإرسال</Badge>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack" data-space="small">
  <div class="rx-cluster">
    <span class="rx-badge" data-tone="neutral" data-draft="true">下書き</span
    ><span class="rx-badge" data-tone="neutral">保留</span
    ><span class="rx-badge" data-tone="info">確認待ち</span
    ><span class="rx-badge" data-tone="success">公開中</span
    ><span class="rx-badge" data-tone="warning">期限が近づいています</span
    ><span class="rx-badge" data-tone="danger">送信失敗</span>
  </div>
  <p>今月の予約 <span class="rx-badge" data-tone="neutral">0件</span></p>
  <span class="rx-badge" data-tone="info"
    >担当者と管理者による公開前の最終確認を待っています</span
  >
  <div class="rx-disclosure-group" role="group" aria-label="役割と状態の組み合わせ">
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
        ><span class="label"><span class="title">役割ごと</span></span>
      </summary>
      <div class="body">
        <div class="rx-cluster">
          <span class="rx-badge" data-tone="neutral">保留</span
          ><span class="rx-badge" data-tone="info">確認待ち</span
          ><span class="rx-badge" data-tone="success">公開中</span
          ><span class="rx-badge" data-tone="warning">残りわずか</span
          ><span class="rx-badge" data-tone="danger">送信失敗</span>
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
        ><span class="label"
          ><span class="title">下書き：役割の色を持たせない</span></span
        >
      </summary>
      <div class="body">
        <div class="rx-cluster">
          <span class="rx-badge" data-tone="neutral" data-draft="true">下書き</span
          ><span class="rx-badge" data-tone="info" data-draft="true"
            >予約の仮押さえ</span
          ><span class="rx-badge" data-tone="success" data-draft="true">公開予定</span
          ><span class="rx-badge" data-tone="warning" data-draft="true"
            >要確認の下書き</span
          ><span class="rx-badge" data-tone="danger" data-draft="true"
            >取り下げ予定</span
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
        ><span class="label"><span class="title">狭い場所で折り返す</span></span>
      </summary>
      <div class="body">
        <div class="rx-stack" data-space="small" style="max-inline-size: 12rem">
          <span class="rx-badge" data-tone="warning"
            >期限が近づいています。今週中に提出してください</span
          ><span class="rx-badge" data-tone="neutral" data-draft="true"
            >公開前に担当者の確認を待つ下書き</span
          ><span class="rx-badge" data-tone="success">担当者と管理者が承認済み</span
          ><span class="rx-badge" data-tone="neutral"
            >https://example.com/articles/autumn-reading-club-2026</span
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
        <div class="rx-cluster" dir="rtl" lang="ar">
          <span class="rx-badge" data-tone="neutral" data-draft="true">مسودة</span
          ><span class="rx-badge" data-tone="neutral">معلق</span
          ><span class="rx-badge" data-tone="info">قيد المراجعة</span
          ><span class="rx-badge" data-tone="success">تمت الموافقة</span
          ><span class="rx-badge" data-tone="danger">فشل الإرسال</span>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
