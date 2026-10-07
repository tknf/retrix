<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# SearchResults

題名・抜粋・補足を並べ、一致した語を強調した検索結果です。

## 使いどころ

- 検索の結果を、題名・本文の抜粋・置き場所や日付の補足で並べ、一致した語を見つけやすくする時に使います。
- 検索に限らない一件ずつの一覧は `DataList`、受信した連絡の一覧は `MessageList` を使います。
- 結果を絞る条件の列は、`OptionalFields` の `layout="stack"` をページの側に並べます。検索の欄そのものは `Field` や `FilterBar` で組みます。

## 使い方

`results` に `title`・`href` と、任意の `excerpt`・`meta`・`leading` を渡します。結果の間には行の幅いっぱいの罫線を引き、題名（青緑の下線付きの太字のリンク、ホバーすると赤茶）・灰色の抜粋（二行まで）・茶色の小さな補足の順に積みます。`leading` にアバターや種類のアイコンを渡すと、先頭側の2.5remの列に置きます。

`query` を渡すと、題名と、文字で渡した `excerpt` の中の一致した語を `mark` で包み、文中の強調と同じ黄色の面で示します。大文字と小文字は区別せず、前後の空白は無視します。`excerpt` に要素を渡した時は強調しないので、必要なら利用側で `mark` を書きます。

検索の実行・結果の並び順・件数やページ送りは利用側が持ちます。0件の時は `SearchResults` を出さず、`EmptyState` などで伝えてください。controllerを持たないので、JavaScriptなしでも同じように表示・操作できます。

## アクセシビリティ

- ルートは `label` を名前に持つ `ol` で、読み上げでは結果の件数と何件目かが伝わります。
- 一致した語は `mark` 要素なので、対応する読み上げ環境では強調として伝わります。
- `leading` は読み上げから外しません。`Avatar` は人の名前を読み上げ、`Icon` は自身で読み上げから外れます。それ以外の飾りを渡す時は、利用側で `aria-hidden` を付けてください。

## API

### SearchResults

題名・抜粋・補足を並べ、一致した語を淡い黄の背景で強調する。条件を追加する列はOptionalFieldsのstackで、ページの側に置く。

| 名前              | 型                        | 既定値 | 説明                                         |
| ----------------- | ------------------------- | ------ | -------------------------------------------- |
| `label`（必須）   | `string`                  |        | 結果の一覧の名前。olのaria-labelに入れる。   |
| `query`           | `string`                  |        | 一致した語。題名と文字の抜粋の中で強調する。 |
| `results`（必須） | `readonly SearchResult[]` |        | 並べる結果。並び順は利用側で決める。         |

ほかに、`<ol>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/search-results.css`

#### `SearchResult`

| 名前            | 型       | 既定値 | 説明                                                        |
| --------------- | -------- | ------ | ----------------------------------------------------------- |
| `title`（必須） | `string` |        | 結果の題名。リンクの文字にし、queryに一致した語を強調する。 |
| `href`（必須）  | `string` |        | 題名のリンクの移動先。                                      |
| `excerpt`       | `Child`  |        | 本文の抜粋。文字で渡すと、queryに一致した語を強調する。     |
| `meta`          | `Child`  |        | 置き場所・日付などの補足。                                  |
| `leading`       | `Child`  |        | アバターや種類のアイコン。                                  |

## コード

```tsx
import {
  SearchResults,
  OptionalFields,
  Avatar,
  Icon,
  Field,
  Input,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

const results = [
  {
    title: "秋の読書会のお知らせ",
    href: "/",
    excerpt: "今年の秋の読書会は10月3日です。読書会の課題の本は受付で貸し出します。",
    meta: "田中 遥 · 9月20日",
  },
  {
    title: "読書会の会場の予約",
    href: "/",
    excerpt: "第二会議室を18時から21時まで予約しました。",
    meta: "佐藤 健 · 9月18日",
  },
];

export default () => (
  <div class="rx-stack">
    <SearchResults label="「読書会」の検索の結果" query="読書会" results={results} />
    <DisclosureGroup label="並べ方の違い">
      <Disclosure summary="アバターを添える" open>
        <SearchResults
          label="アバターを添えた結果"
          query="案内"
          results={[
            {
              title: "仕事場の案内を更新しました",
              href: "/",
              excerpt: "料金とキャンセル条件の案内を書き足しました。",
              meta: "ヘルプセンター · 12月8日",
              leading: <Avatar name="田中 遥" initials="遥" />,
            },
            {
              title: "案内のPDF",
              href: "/",
              meta: "PDF · 2.4 MB",
              leading: <Icon name="file" />,
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="条件を追加する列と並べる">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr)); gap: var(--rx-space-6)">
          <OptionalFields
            label="結果を絞る"
            layout="stack"
            items={[
              {
                id: "refine-from",
                label: "差出人",
                icon: "user",
                field: (
                  <Field id="refine-from" label="差出人">
                    {(control) => <Input {...control} name="from" />}
                  </Field>
                ),
              },
              {
                id: "refine-attach",
                label: "添付がある",
                icon: "attach",
                field: (
                  <Field id="refine-attach" label="添付の種類">
                    {(control) => <Input {...control} name="attach" />}
                  </Field>
                ),
              },
            ]}
          />
          <SearchResults label="絞った結果" query="読書会" results={results} />
        </div>
      </Disclosure>
      <Disclosure summary="長い題名と抜粋：抜粋は二行まで">
        <SearchResults
          label="長い結果"
          query="予約"
          results={[
            {
              title:
                "初めて利用する方に向けた予約方法と当日の受付の流れを、写真付きで分かりやすく書き直しました",
              href: "/",
              excerpt:
                "予約はウェブから受け付けます。予約の取り消しは前日まで無料です。当日の受付では予約の番号を伝えてください。予約がない方も空きがあれば利用できます。",
              meta: "ヘルプセンター · 12月8日",
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <SearchResults
            label="نتائج البحث"
            query="نادي"
            results={[
              {
                title: "نادي القراءة في الخريف",
                href: "/",
                excerpt: "يجتمع نادي القراءة في أكتوبر.",
                meta: "هارو · 20 سبتمبر",
              },
            ]}
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
  <ol class="rx-search-results" aria-label="「読書会」の検索の結果">
    <li>
      <a class="title" href="/">秋の<mark>読書会</mark>のお知らせ</a>
      <p class="excerpt">
        今年の秋の<mark>読書会</mark>は10月3日です。<mark>読書会</mark>の課題の本は受付で貸し出します。
      </p>
      <p class="meta">田中 遥 · 9月20日</p>
    </li>
    <li>
      <a class="title" href="/"><mark>読書会</mark>の会場の予約</a>
      <p class="excerpt">第二会議室を18時から21時まで予約しました。</p>
      <p class="meta">佐藤 健 · 9月18日</p>
    </li>
  </ol>
  <div class="rx-disclosure-group" role="group" aria-label="並べ方の違い">
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
        ><span class="label"><span class="title">アバターを添える</span></span>
      </summary>
      <div class="body">
        <ol class="rx-search-results" aria-label="アバターを添えた結果">
          <li data-leading="true">
            <span class="leading"
              ><span
                class="rx-avatar"
                data-size="default"
                data-tone="blue"
                role="img"
                aria-label="田中 遥"
                ><span class="initials">遥</span></span
              ></span
            ><a class="title" href="/">仕事場の<mark>案内</mark>を更新しました</a>
            <p class="excerpt">
              料金とキャンセル条件の<mark>案内</mark>を書き足しました。
            </p>
            <p class="meta">ヘルプセンター · 12月8日</p>
          </li>
          <li data-leading="true">
            <span class="leading"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-file"></use></svg></span
            ><a class="title" href="/"><mark>案内</mark>のPDF</a>
            <p class="meta">PDF · 2.4 MB</p>
          </li>
        </ol>
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
        ><span class="label"><span class="title">条件を追加する列と並べる</span></span>
      </summary>
      <div class="body">
        <div
          style="
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(12rem, 100%), 1fr));
            gap: var(--rx-space-6);
          "
        >
          <div
            class="rx-optional-fields"
            data-controller="optional-fields"
            data-layout="stack"
          >
            <div class="fields">
              <fieldset
                class="field"
                id="refine-from-slot"
                data-open="false"
                data-optional-fields-target="field"
              >
                <div class="rx-field">
                  <div class="heading"><label for="refine-from">差出人</label></div>
                  <input id="refine-from" name="from" class="rx-input" />
                </div>
                <button
                  data-icon-only="true"
                  aria-label="差出人を削除"
                  title="差出人を削除"
                  data-action="optional-fields#remove"
                  hidden=""
                  class="rx-button remove"
                  type="button"
                  data-variant="link"
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
                  </svg>
                </button>
              </fieldset>
              <fieldset
                class="field"
                id="refine-attach-slot"
                data-open="false"
                data-optional-fields-target="field"
              >
                <div class="rx-field">
                  <div class="heading">
                    <label for="refine-attach">添付の種類</label>
                  </div>
                  <input id="refine-attach" name="attach" class="rx-input" />
                </div>
                <button
                  data-icon-only="true"
                  aria-label="添付があるを削除"
                  title="添付があるを削除"
                  data-action="optional-fields#remove"
                  hidden=""
                  class="rx-button remove"
                  type="button"
                  data-variant="link"
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
                  </svg>
                </button>
              </fieldset>
            </div>
            <div class="chips" role="group" aria-label="結果を絞る">
              <button
                aria-controls="refine-from-slot"
                aria-expanded="false"
                hidden=""
                data-action="optional-fields#add"
                class="rx-button chip"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-user"></use></svg
                >差出人</button
              ><button
                aria-controls="refine-attach-slot"
                aria-expanded="false"
                hidden=""
                data-action="optional-fields#add"
                class="rx-button chip"
                type="button"
                data-variant="secondary"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-attach"></use></svg
                >添付がある
              </button>
            </div>
          </div>
          <ol class="rx-search-results" aria-label="絞った結果">
            <li>
              <a class="title" href="/">秋の<mark>読書会</mark>のお知らせ</a>
              <p class="excerpt">
                今年の秋の<mark>読書会</mark>は10月3日です。<mark>読書会</mark>の課題の本は受付で貸し出します。
              </p>
              <p class="meta">田中 遥 · 9月20日</p>
            </li>
            <li>
              <a class="title" href="/"><mark>読書会</mark>の会場の予約</a>
              <p class="excerpt">第二会議室を18時から21時まで予約しました。</p>
              <p class="meta">佐藤 健 · 9月18日</p>
            </li>
          </ol>
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
          ><span class="title">長い題名と抜粋：抜粋は二行まで</span></span
        >
      </summary>
      <div class="body">
        <ol class="rx-search-results" aria-label="長い結果">
          <li>
            <a class="title" href="/"
              >初めて利用する方に向けた<mark>予約</mark>方法と当日の受付の流れを、写真付きで分かりやすく書き直しました</a
            >
            <p class="excerpt">
              <mark>予約</mark
              >はウェブから受け付けます。<mark>予約</mark>の取り消しは前日まで無料です。当日の受付では<mark>予約</mark>の番号を伝えてください。<mark>予約</mark>がない方も空きがあれば利用できます。
            </p>
            <p class="meta">ヘルプセンター · 12月8日</p>
          </li>
        </ol>
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
          <ol class="rx-search-results" aria-label="نتائج البحث">
            <li>
              <a class="title" href="/"><mark>نادي</mark> القراءة في الخريف</a>
              <p class="excerpt">يجتمع <mark>نادي</mark> القراءة في أكتوبر.</p>
              <p class="meta">هارو · 20 سبتمبر</p>
            </li>
          </ol>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
