<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Tag

分類や選択した条件を短く示します。

## 使いどころ

- 記事の分類や、選んだ絞り込みの条件を短く示す時に使います。
- 公開中・確認待ちなどの状態は、角の丸い `Badge` で示します。Tagは枠の付いた角の小さな四角で、分類を示します。
- 利用者が自由に書いてタグを追加する入力欄は `TagInput` を使います。

## 使い方

`label` を渡します。淡い灰色の面に灰色の枠を付けた、角丸2pxの小さな四角で、文字は12pxの通常の太さです。一行の高さは20pxで `Badge` とそろえます。`accent` は `blue`・`green`・`amber`・`coral` から選び、その色を淡く混ぜた面と枠に、その色の文字で示します。`data-current="true"` を渡すと、濃い灰色の面に白い文字で強調します。

`href` を渡すと分類へ移るリンクになります。下線は引かず、ホバーすると面と枠を一段濃くします。

`removeButton` を渡すとタグの末尾に、タグの文字と同じ色の小さな×ボタンを置きます。タグの高さは変えません。解除した後の処理は利用側が行います。`href` と `removeButton` は同時に使えません。

複数のタグは `TagGroup` で囲みます。タグの間を0.25remに詰めて折り返し、長い文言も省略しません。

`Tag` は `class`・`id` などのHTML属性をタグのルート（`href` がある時は `a`、それ以外は `span`）に渡します。JavaScriptは使いません。

## アクセシビリティ

- `TagGroup` は `role="group"` で、`label` を名前にします。
- 解除の操作はアイコンだけのボタンなので、「暮らしを解除」のように何を解除するかを `aria-label` で付けます。
- `accent` の色は見分けの補助です。意味は文言で伝えます。

## API

### Tag

HTML属性はルート（リンクの時はa、それ以外はspan）に渡す。

| 名前                       | 型       | 既定値 | 説明                                                                                                                                                                                                      |
| -------------------------- | -------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須）            | `string` |        | タグの文言。長い文言は省略せずに折り返す。                                                                                                                                                                |
| `accent`                   | `Accent` |        | 縁と文字の色。分類を見分けるために使う。渡さなければ淡い灰のタグにする。                                                                                                                                  |
| `href`                     | `string` |        | 渡すとタグを分類へ移るリンクにする。removeButtonとは同時に使えない。                                                                                                                                      |
| `removeButton`（形による） | `Child`  |        | タグの末尾に置く解除操作。空のButton（variant="link"・size="tag"・class="remove"・ data-icon-only="true"）に「〇〇を解除」のaria-labelを付けて渡すと、×のアイコンを描く。解除した後の処理は利用側が持つ。 |

ほかに、`<a>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/tag.css`

#### `Accent`

値：`"blue" | "green" | "amber" | "coral"`

### TagGroup

| 名前            | 型       | 既定値 | 説明                                             |
| --------------- | -------- | ------ | ------------------------------------------------ |
| `label`（必須） | `string` |        | まとまりの名前。role="group"のaria-labelにする。 |
| `children`      | `Child`  |        | 並べる `Tag`。                                   |

ほかに、`<div>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/tag-group.css`

## コード

```tsx
import { Tag, TagGroup, Button, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

const removeButton = (label: string) => (
  <Button
    class="remove"
    variant="link"
    size="tag"
    type="button"
    data-icon-only="true"
    aria-label={`${label}を解除`}
  />
);

export default () => (
  <div class="rx-stack">
    <TagGroup label="記事の分類">
      <Tag label="暮らし" />
      <Tag label="読書会" accent="blue" />
      <Tag label="仕事場の記事" href="/apps/search?q=仕事場" />
      <Tag label="公開済み" accent="green" />
      <Tag label="確認中" accent="amber" />
    </TagGroup>
    <DisclosureGroup label="色と置き場所の違い">
      <Disclosure summary="色ごとのタグ" open>
        <TagGroup label="色ごとの分類">
          <Tag label="分類なし" />
          <Tag label="読書会" accent="blue" />
          <Tag label="公開済み" accent="green" />
          <Tag label="確認中" accent="amber" />
          <Tag label="要対応" accent="coral" />
        </TagGroup>
      </Disclosure>
      <Disclosure summary="分類へ移動するタグ" open>
        <TagGroup label="分類から探す">
          <Tag label="仕事場の記事" href="/apps/search?q=仕事場" />
          <Tag label="読書会" accent="blue" href="/apps/search?q=読書会" />
          <Tag label="イベント" accent="green" href="/apps/search?q=イベント" />
          <Tag label="お知らせ" accent="amber" href="/apps/search?q=お知らせ" />
          <Tag label="締め切り" accent="coral" href="/apps/search?q=締め切り" />
        </TagGroup>
      </Disclosure>
      <Disclosure summary="解除できるタグ">
        <TagGroup label="選んだ分類">
          <Tag label="暮らし" removeButton={removeButton("暮らし")} />
          <Tag label="読書会" accent="blue" removeButton={removeButton("読書会")} />
          <Tag label="要対応" accent="coral" removeButton={removeButton("要対応")} />
        </TagGroup>
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 12rem">
          <TagGroup label="長い分類">
            <Tag label="初めて仕事場を利用する方へのご案内" accent="blue" />
            <Tag label="https://example.com/articles/autumn-reading-club-2026" />
            <Tag label="秋の読書会の参加者向け" href="/apps/search?q=読書会" />
          </TagGroup>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <TagGroup label="التصنيفات">
            <Tag label="الحياة" />
            <Tag label="نادي القراءة" accent="blue" />
            <Tag label="الفعاليات" accent="green" href="/apps/search?q=events" />
            <Tag
              label="قيد المراجعة"
              accent="amber"
              removeButton={removeButton("قيد المراجعة")}
            />
          </TagGroup>
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
  <div class="rx-tag-group" role="group" aria-label="記事の分類">
    <span class="rx-tag">暮らし</span
    ><span class="rx-tag" data-accent="blue">読書会</span
    ><a class="rx-tag" href="/apps/search?q=仕事場">仕事場の記事</a
    ><span class="rx-tag" data-accent="green">公開済み</span
    ><span class="rx-tag" data-accent="amber">確認中</span>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="色と置き場所の違い">
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
        ><span class="label"><span class="title">色ごとのタグ</span></span>
      </summary>
      <div class="body">
        <div class="rx-tag-group" role="group" aria-label="色ごとの分類">
          <span class="rx-tag">分類なし</span
          ><span class="rx-tag" data-accent="blue">読書会</span
          ><span class="rx-tag" data-accent="green">公開済み</span
          ><span class="rx-tag" data-accent="amber">確認中</span
          ><span class="rx-tag" data-accent="coral">要対応</span>
        </div>
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
        ><span class="label"><span class="title">分類へ移動するタグ</span></span>
      </summary>
      <div class="body">
        <div class="rx-tag-group" role="group" aria-label="分類から探す">
          <a class="rx-tag" href="/apps/search?q=仕事場">仕事場の記事</a
          ><a class="rx-tag" data-accent="blue" href="/apps/search?q=読書会">読書会</a
          ><a class="rx-tag" data-accent="green" href="/apps/search?q=イベント"
            >イベント</a
          ><a class="rx-tag" data-accent="amber" href="/apps/search?q=お知らせ"
            >お知らせ</a
          ><a class="rx-tag" data-accent="coral" href="/apps/search?q=締め切り"
            >締め切り</a
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
        ><span class="label"><span class="title">解除できるタグ</span></span>
      </summary>
      <div class="body">
        <div class="rx-tag-group" role="group" aria-label="選んだ分類">
          <span class="rx-tag removable"
            ><span class="label">暮らし</span
            ><button
              data-icon-only="true"
              aria-label="暮らしを解除"
              class="rx-button remove"
              type="button"
              data-variant="link"
              data-size="tag"
            ></button></span
          ><span class="rx-tag removable" data-accent="blue"
            ><span class="label">読書会</span
            ><button
              data-icon-only="true"
              aria-label="読書会を解除"
              class="rx-button remove"
              type="button"
              data-variant="link"
              data-size="tag"
            ></button></span
          ><span class="rx-tag removable" data-accent="coral"
            ><span class="label">要対応</span
            ><button
              data-icon-only="true"
              aria-label="要対応を解除"
              class="rx-button remove"
              type="button"
              data-variant="link"
              data-size="tag"
            ></button
          ></span>
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
        <div style="max-inline-size: 12rem">
          <div class="rx-tag-group" role="group" aria-label="長い分類">
            <span class="rx-tag" data-accent="blue"
              >初めて仕事場を利用する方へのご案内</span
            ><span class="rx-tag"
              >https://example.com/articles/autumn-reading-club-2026</span
            ><a class="rx-tag" href="/apps/search?q=読書会">秋の読書会の参加者向け</a>
          </div>
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
          <div class="rx-tag-group" role="group" aria-label="التصنيفات">
            <span class="rx-tag">الحياة</span
            ><span class="rx-tag" data-accent="blue">نادي القراءة</span
            ><a class="rx-tag" data-accent="green" href="/apps/search?q=events"
              >الفعاليات</a
            ><span class="rx-tag removable" data-accent="amber"
              ><span class="label">قيد المراجعة</span
              ><button
                data-icon-only="true"
                aria-label="قيد المراجعةを解除"
                class="rx-button remove"
                type="button"
                data-variant="link"
                data-size="tag"
              ></button
            ></span>
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
