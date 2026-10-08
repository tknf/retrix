<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Notice

事実・影響・次の操作を、画面に残る形で示します。

## 使いどころ

- 公開期限や保存の条件など、その場所で読み続けてほしい事実と、その影響・次の操作を本文のそばに示す時に使います。
- 今した操作の結果を一時的に知らせる時は `Toast` を使います。
- 送信で直すところを欄へのリンクでまとめる時は `ErrorSummary` を使います。
- 対象の状態を短い言葉だけで示す時は `Badge` を使います。

## 使い方

Noticeは1pxの枠で下だけを3pxにした、角丸4pxのカードです。文字は12pxで、一行目にアイコンと `label` の題名を太字で書き、childrenの本文と操作（`ActionLink` など）をその下に置きます。childrenを省くと題名だけの知らせになります。

`tone` で役割を選びます（`info`・`success`・`warning`・`danger`、既定は `info`）。`info` と `warning` は黄色の面（`#ffffcc`）に黄色の枠（`#eac73b`）で、題名は黒です。`info` のアイコンは青、`warning` のアイコンは黄土色です。`success` は淡い緑の面と枠に緑の題名とアイコン、`danger` は淡い赤の面と枠に赤の題名とアイコンです。アイコンは `success` でチェック、`danger` でバツ、他はiにします。

Noticeの中にNoticeを入れ子にもできます。

`heading` を渡すと題名を `h2` で書き、ページの節の見出しとして読ませます。

Noticeは描いた時の内容を示すだけで、自動では消えません。動的に出す時の読み上げや、いつ消すかは利用側で扱い、重大なエラーは自動で消しません。JavaScriptは使いません。

## アクセシビリティ

- `aside` で、`label` を読み上げ名にします。アイコンは読み上げから外します。
- `role` は付けません。画面を開いた後に出す時は、利用側で `role="status"` や `role="alert"` を付けて読み上げさせます。
- 役割の色とアイコンの形は補助です。何が起きたかは題名と本文で伝えます。

## API

### Notice

通知は本文のそばへ置く。読み上げを必要とする動的な更新では利用側でroleを指定する。

| 名前            | 型                         | 既定値   | 説明                                                                                                                                        |
| --------------- | -------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `tone`          | `Exclude<Tone, "neutral">` | `"info"` | 通知の役割。アイコンをその色で描き（successとdangerは面・枠・題名もその色にする）、アイコンはsuccessでチェック、dangerでバツ、他はiを置く。 |
| `label`（必須） | `string`                   |          | 題名。アイコンの横に太字で書き、asideの読み上げ名（aria-label）にもする。                                                                   |
| `heading`       | `boolean`                  | `false`  | 題名をh2で書く。ページの節の見出しとして読ませる時に使う。既定はp。                                                                         |
| `children`      | `Child`                    |          | 題名の下に置く本文と操作。                                                                                                                  |

ほかに、`<aside>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/icon.css`、`components/notice.css`、`components/error-summary.css`

#### `Tone`

値：`"neutral" | "info" | "success" | "warning" | "danger"`

## コード

```tsx
import { Notice, ActionLink, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack" data-space="small">
    <Notice label="変更は保存後に反映されます">
      <p>入力を終えたら、このページの「設定を保存」を押してください。</p>
    </Notice>
    <Notice label="招待を送りました" tone="success">
      <p>相手が参加すると、メンバーの一覧に表示されます。</p>
    </Notice>
    <Notice label="公開期限は明日です" tone="warning">
      <p>9月16日を過ぎると、共有リンクから記事を閲覧できなくなります。</p>
      <ActionLink href="/apps/docs">公開設定を確認する</ActionLink>
    </Notice>
    <Notice label="添付ファイルを送信できませんでした" tone="danger">
      <p>入力した内容は残っています。接続を確認してから、もう一度送信してください。</p>
    </Notice>
    <DisclosureGroup label="内容と置き場所の違い">
      <Disclosure summary="入れ子の通知">
        <Notice label="外側の注意" tone="warning">
          <p>一部のファイルに確認が必要です。</p>
          <Notice label="内側の完了" tone="success">
            <p>本文の確認は完了しました。</p>
          </Notice>
        </Notice>
      </Disclosure>
      <Disclosure summary="題名だけ・見出しとして置く">
        <div class="rx-stack" data-space="small">
          <Notice label="この記事は公開済みです" tone="success" />
          <Notice label="メンテナンスのお知らせ" heading>
            <p>9月30日 2:00〜4:00は、予約の受付を停止します。</p>
          </Notice>
        </div>
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 16rem">
          <Notice
            label="https://example.com/articles/autumn-reading-club-2026 は公開できません"
            tone="danger"
          >
            <p>見出し画像の代替テキストを入力してから、もう一度公開してください。</p>
            <ActionLink href="/apps/docs">記事を編集する</ActionLink>
          </Notice>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Notice label="تنتهي مدة النشر غدًا" tone="warning">
            <p>بعد ١٦ سبتمبر لن يمكن عرض المقال من رابط المشاركة.</p>
          </Notice>
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
  <aside class="rx-notice" data-tone="info" aria-label="変更は保存後に反映されます">
    <div class="heading">
      <span class="symbol" aria-hidden="true"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-info"></use></svg
      ></span>
      <p class="title">変更は保存後に反映されます</p>
    </div>
    <div class="body">
      <p>入力を終えたら、このページの「設定を保存」を押してください。</p>
    </div>
  </aside>
  <aside class="rx-notice" data-tone="success" aria-label="招待を送りました">
    <div class="heading">
      <span class="symbol" aria-hidden="true"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-check"></use></svg
      ></span>
      <p class="title">招待を送りました</p>
    </div>
    <div class="body"><p>相手が参加すると、メンバーの一覧に表示されます。</p></div>
  </aside>
  <aside class="rx-notice" data-tone="warning" aria-label="公開期限は明日です">
    <div class="heading">
      <span class="symbol" aria-hidden="true"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-info"></use></svg
      ></span>
      <p class="title">公開期限は明日です</p>
    </div>
    <div class="body">
      <p>9月16日を過ぎると、共有リンクから記事を閲覧できなくなります。</p>
      <a
        href="/apps/docs"
        class="rx-button"
        data-variant="secondary"
        data-size="default"
        >公開設定を確認する</a
      >
    </div>
  </aside>
  <aside
    class="rx-notice"
    data-tone="danger"
    aria-label="添付ファイルを送信できませんでした"
  >
    <div class="heading">
      <span class="symbol" aria-hidden="true"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-x"></use></svg
      ></span>
      <p class="title">添付ファイルを送信できませんでした</p>
    </div>
    <div class="body">
      <p>入力した内容は残っています。接続を確認してから、もう一度送信してください。</p>
    </div>
  </aside>
  <div class="rx-disclosure-group" role="group" aria-label="内容と置き場所の違い">
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
        ><span class="label"><span class="title">入れ子の通知</span></span>
      </summary>
      <div class="body">
        <aside class="rx-notice" data-tone="warning" aria-label="外側の注意">
          <div class="heading">
            <span class="symbol" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-info"></use></svg
            ></span>
            <p class="title">外側の注意</p>
          </div>
          <div class="body">
            <p>一部のファイルに確認が必要です。</p>
            <aside class="rx-notice" data-tone="success" aria-label="内側の完了">
              <div class="heading">
                <span class="symbol" aria-hidden="true"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-check"></use></svg
                ></span>
                <p class="title">内側の完了</p>
              </div>
              <div class="body"><p>本文の確認は完了しました。</p></div>
            </aside>
          </div>
        </aside>
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
          ><span class="title">題名だけ・見出しとして置く</span></span
        >
      </summary>
      <div class="body">
        <div class="rx-stack" data-space="small">
          <aside
            class="rx-notice"
            data-tone="success"
            aria-label="この記事は公開済みです"
          >
            <div class="heading">
              <span class="symbol" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-check"></use></svg
              ></span>
              <p class="title">この記事は公開済みです</p>
            </div>
            <div class="body"></div>
          </aside>
          <aside class="rx-notice" data-tone="info" aria-label="メンテナンスのお知らせ">
            <div class="heading">
              <span class="symbol" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-info"></use></svg
              ></span>
              <h2 class="title">メンテナンスのお知らせ</h2>
            </div>
            <div class="body">
              <p>9月30日 2:00〜4:00は、予約の受付を停止します。</p>
            </div>
          </aside>
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
        <div style="max-inline-size: 16rem">
          <aside
            class="rx-notice"
            data-tone="danger"
            aria-label="https://example.com/articles/autumn-reading-club-2026 は公開できません"
          >
            <div class="heading">
              <span class="symbol" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-x"></use></svg
              ></span>
              <p class="title">
                https://example.com/articles/autumn-reading-club-2026 は公開できません
              </p>
            </div>
            <div class="body">
              <p>見出し画像の代替テキストを入力してから、もう一度公開してください。</p>
              <a
                href="/apps/docs"
                class="rx-button"
                data-variant="secondary"
                data-size="default"
                >記事を編集する</a
              >
            </div>
          </aside>
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
          <aside
            class="rx-notice"
            data-tone="warning"
            aria-label="تنتهي مدة النشر غدًا"
          >
            <div class="heading">
              <span class="symbol" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-info"></use></svg
              ></span>
              <p class="title">تنتهي مدة النشر غدًا</p>
            </div>
            <div class="body">
              <p>بعد ١٦ سبتمبر لن يمكن عرض المقال من رابط المشاركة.</p>
            </div>
          </aside>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
