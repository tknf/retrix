<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# EmptyState

表示する情報がない理由と、次の操作を示します。

## 使いどころ

- 一覧や検索の結果が0件の時、初めて使う時、確認などの作業を全て終えた時に、その理由と次の操作を示す時に使います。
- 読み込みに失敗した・検索できなかったなどのエラーは、0件と区別して `Notice` で示します。
- まだ読み込んでいる時は `Loading` を使います。

## 使い方

`title` に何が無いのか・何が終わったのかを書き、childrenに説明、`actions` に次の操作（`ActionLink` など）を渡します。枠や面は付けず、中央に太字の題名と灰色の説明を書き、操作はその下に置きます。

`kind` で場面を選びます。`empty` は0件（灰色）、`start` は初めて使う時（青緑）、`complete` は作業を終えた時（緑）で、アイコンを置く丸をその色で塗ります。

`icon` は渡した時だけ、題名の上の場面の色で塗った小さな丸に白で置きます。`complete` は渡さなくても、緑の丸にペンで描くチェックを置きます。

架空の件数や見本のデータを置きません。JavaScriptは使いません。

## アクセシビリティ

- `section` で、`title` を見出し（`h3`）にします。アイコンは読み上げから外します。
- 動きを減らす設定では、チェックを描く動きを止めます。

## API

### EmptyState

検索0件・初回利用・作業完了を、実際の文脈と次の操作に合わせて使い分ける。

| 名前            | 型                                 | 既定値    | 説明                                                                                       |
| --------------- | ---------------------------------- | --------- | ------------------------------------------------------------------------------------------ |
| `title`（必須） | `string`                           |           | 枠内に太字で書く題名。何が無いのか、何が終わったのかを書く。                               |
| `kind`          | `"empty" \| "start" \| "complete"` | `"empty"` | 場面。emptyは0件（灰）、startは初めて使う時（青）、completeは作業を終えた時（緑）。        |
| `actions`       | `Child`                            |           | 枠の下に置く次の操作（ActionLinkやButton）。                                               |
| `icon`          | `Child`                            |           | 題名の上に置くアイコン。渡した時だけ置く。completeは渡さなくてもペンで描くチェックを置く。 |
| `children`      | `Child`                            |           | 題名の下に置く説明文。                                                                     |

ほかに、`<section>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/empty-state.css`、`components/icon.css`

## コード

```tsx
import {
  EmptyState,
  ActionLink,
  Disclosure,
  DisclosureGroup,
  Icon,
} from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack">
    <EmptyState
      title="条件に合う記事が見つかりませんでした"
      actions={<ActionLink href="/apps/search">条件をクリアする</ActionLink>}
    >
      <p>キーワードを短くするか、公開状態の絞り込みを外してみてください。</p>
    </EmptyState>
    <DisclosureGroup label="場面と置き場所の違い">
      <Disclosure summary="初めて使うとき" open>
        <EmptyState
          kind="start"
          title="最初の記事を書いてみましょう"
          actions={
            <ActionLink href="/apps/docs" variant="primary">
              記事を書く
            </ActionLink>
          }
        >
          <p>
            お知らせや日々の記録を、ここにまとめられます。途中まで書いて、下書きとして残すこともできます。
          </p>
        </EmptyState>
      </Disclosure>
      <Disclosure summary="作業が終わったとき" open>
        <EmptyState kind="complete" title="今日の確認はすべて終わりました">
          <p>新しく確認する記事が届いたら、ここに表示します。</p>
        </EmptyState>
      </Disclosure>
      <Disclosure summary="アイコンを差し替える・操作が二つ">
        <EmptyState
          title="予約はまだありません"
          icon={<Icon name="calendar" />}
          actions={
            <>
              <ActionLink href="/apps/docs" variant="primary">
                予約を入れる
              </ActionLink>
              <ActionLink href="/apps/docs">予約の受け方を読む</ActionLink>
            </>
          }
        >
          <p>会議室や備品の予約が入ると、日付の順に並びます。</p>
        </EmptyState>
      </Disclosure>
      <Disclosure summary="題名だけ">
        <EmptyState title="通知はありません" />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 20rem">
          <EmptyState
            kind="start"
            title="このフォルダにはまだ資料がありません。最初の資料を追加しましょう"
            actions={<ActionLink href="/apps/docs">資料を追加する</ActionLink>}
          >
            <p>PDF・画像・表計算のファイルを置けます。</p>
          </EmptyState>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <EmptyState kind="complete" title="اكتملت جميع المراجعات لهذا اليوم">
            <p>ستظهر المقالات الجديدة هنا عند وصولها.</p>
          </EmptyState>
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
  <section class="rx-empty-state" data-kind="empty">
    <div class="slip">
      <h3 class="title">条件に合う記事が見つかりませんでした</h3>
      <div class="body">
        <p>キーワードを短くするか、公開状態の絞り込みを外してみてください。</p>
      </div>
    </div>
    <div class="actions">
      <a
        href="/apps/search"
        class="rx-button"
        data-variant="secondary"
        data-size="default"
        >条件をクリアする</a
      >
    </div>
  </section>
  <div class="rx-disclosure-group" role="group" aria-label="場面と置き場所の違い">
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
        ><span class="label"><span class="title">初めて使うとき</span></span>
      </summary>
      <div class="body">
        <section class="rx-empty-state" data-kind="start">
          <div class="slip">
            <h3 class="title">最初の記事を書いてみましょう</h3>
            <div class="body">
              <p>
                お知らせや日々の記録を、ここにまとめられます。途中まで書いて、下書きとして残すこともできます。
              </p>
            </div>
          </div>
          <div class="actions">
            <a
              href="/apps/docs"
              class="rx-button"
              data-variant="primary"
              data-size="default"
              >記事を書く</a
            >
          </div>
        </section>
      </div>
    </details>
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
        ><span class="label"><span class="title">作業が終わったとき</span></span>
      </summary>
      <div class="body">
        <section class="rx-empty-state" data-kind="complete">
          <div class="slip">
            <div class="symbol" aria-hidden="true">
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-check"></use>
              </svg>
            </div>
            <h3 class="title">今日の確認はすべて終わりました</h3>
            <div class="body">
              <p>新しく確認する記事が届いたら、ここに表示します。</p>
            </div>
          </div>
        </section>
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
          ><span class="title">アイコンを差し替える・操作が二つ</span></span
        >
      </summary>
      <div class="body">
        <section class="rx-empty-state" data-kind="empty">
          <div class="slip">
            <div class="symbol" aria-hidden="true">
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use>
              </svg>
            </div>
            <h3 class="title">予約はまだありません</h3>
            <div class="body">
              <p>会議室や備品の予約が入ると、日付の順に並びます。</p>
            </div>
          </div>
          <div class="actions">
            <a
              href="/apps/docs"
              class="rx-button"
              data-variant="primary"
              data-size="default"
              >予約を入れる</a
            ><a
              href="/apps/docs"
              class="rx-button"
              data-variant="secondary"
              data-size="default"
              >予約の受け方を読む</a
            >
          </div>
        </section>
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
        ><span class="label"><span class="title">題名だけ</span></span>
      </summary>
      <div class="body">
        <section class="rx-empty-state" data-kind="empty">
          <div class="slip">
            <h3 class="title">通知はありません</h3>
            <div class="body"></div>
          </div>
        </section>
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
        <div style="max-inline-size: 20rem">
          <section class="rx-empty-state" data-kind="start">
            <div class="slip">
              <h3 class="title">
                このフォルダにはまだ資料がありません。最初の資料を追加しましょう
              </h3>
              <div class="body"><p>PDF・画像・表計算のファイルを置けます。</p></div>
            </div>
            <div class="actions">
              <a
                href="/apps/docs"
                class="rx-button"
                data-variant="secondary"
                data-size="default"
                >資料を追加する</a
              >
            </div>
          </section>
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
          <section class="rx-empty-state" data-kind="complete">
            <div class="slip">
              <div class="symbol" aria-hidden="true">
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-check"></use>
                </svg>
              </div>
              <h3 class="title">اكتملت جميع المراجعات لهذا اليوم</h3>
              <div class="body"><p>ستظهر المقالات الجديدة هنا عند وصولها.</p></div>
            </div>
          </section>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
