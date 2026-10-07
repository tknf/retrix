<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# InputGroup

入力欄の前後に、単位や接頭辞を並べます。

## 使いどころ

- 「¥」「人」「https://」のように、値の前後に決まった文字を添えて入力させる時に使います。
- 検索欄と「検索」ボタンのように、入力と一つの操作を一組で並べる時にも使います。
- 文字だけの入力は `Input`、数だけで単位が要らない時は `NumberField` を使います。

## 使い方

`Field` の `children` の中で、受け取った属性をそのまま `InputGroup` へ展開します。`prefix`・`suffix` 以外の属性は中の入力へ渡します。`type="number"` の時は中の入力を `NumberField` にし、PageUp・PageDownで10倍のstepだけ動かせます。その場合は `NumberFieldController` を `number-field` として登録します。

`prefix`・`suffix` は入力と同じ枠の中に淡い文字で置きます。値には含めず、送信するのは入力の値だけです。置き場所が14rem未満になると、枠の外の操作を次の行へ送り、接頭辞と接尾辞が両方ある時は縦に積みます。

`action` を渡すと枠の外の末尾側にButtonを置きます。`label` が文言で、残りはButtonのpropsです。Buttonの既定の `type` は `button` なので、フォームを送信する時は `type: "submit"` を渡します。

`size="large"` は入力とボタンを高く大きい文字にします。エラー・`readonly`・`disabled` は枠全体の縁と面で示します。

## アクセシビリティ

- `prefix`・`suffix` は入力の説明として `aria-describedby` に加えます。単位は読み上げでも伝わるよう、ラベルにも「料金（円）」のように含めます。
- アイコンだけを `prefix` に置く時は、入力のラベルで何の欄かが分かるようにします。

## API

### InputGroup

接頭辞・単位と入力を一つの枠に並べ、操作のボタンを添える。残りの属性は入力へ渡し、type="number"ならNumberFieldにする。

| 名前         | 型                     | 既定値      | 説明                                                                                     |
| ------------ | ---------------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `id`（必須） | `string`               |             | 入力のid。接頭辞（`<id>-prefix`）と接尾辞（`<id>-suffix`）のidの元になる。               |
| `prefix`     | `Child`                |             | 入力の前に置く接頭辞（「¥」「https://」やアイコン）。入力の説明として読み上げる。        |
| `suffix`     | `Child`                |             | 入力の後に置く単位や接尾辞（「人」「.example.jp」など）。入力の説明として読み上げる。    |
| `size`       | `"default" \| "large"` | `"default"` | defaultは通常の高さ、largeは高く大きい文字にする。actionのボタンも同じ大きさにそろえる。 |
| `action`     | `InputGroupAction`     |             | 枠の外の末尾に並べる操作のボタン。入力がdisabledの時はボタンも使えなくする。             |

ほかのpropsは`NumberField`または`Input`へそのまま渡します。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/input-group.css`

#### `InputGroupAction`

| 名前            | 型       | 既定値 | 説明                                                                      |
| --------------- | -------- | ------ | ------------------------------------------------------------------------- |
| `label`（必須） | `string` |        | 操作の文言。残りはButtonのpropsとして渡す（送信するならtype: "submit"）。 |

## コード

```tsx
import { Disclosure, Field, InputGroup, Icon } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-split">
    <Field id="hono-group-price" label="料金（円）" help="100円単位で設定できます。">
      {(attributes) => (
        <InputGroup
          {...attributes}
          prefix="¥"
          type="number"
          name="price"
          min={0}
          max={100000}
          step={100}
          value={1200}
        />
      )}
    </Field>
    <Field id="hono-group-capacity" label="定員（人）">
      {(attributes) => (
        <InputGroup
          {...attributes}
          suffix="人"
          type="number"
          name="capacity"
          min={1}
          max={20}
          value={5}
        />
      )}
    </Field>
    <Field id="hono-group-site" label="サイトのURL">
      {(attributes) => (
        <InputGroup
          {...attributes}
          prefix="https://"
          suffix=".example.jp"
          name="subdomain"
          value="studio"
        />
      )}
    </Field>
    <form action="/apps/search" method="get">
      <Field id="hono-group-search" label="記事を検索">
        {(attributes) => (
          <InputGroup
            {...attributes}
            type="search"
            name="q"
            prefix={<Icon name="search" />}
            placeholder="記事名や本文から探す"
            action={{ label: "検索", type: "submit" }}
          />
        )}
      </Field>
    </form>
    <Disclosure summary="エラー・閲覧専用・利用不可・大きい入力">
      <div class="rx-stack">
        <Field
          id="hono-group-price-error"
          label="料金（入力エラー）"
          error="料金を入力してください。"
        >
          {(attributes) => (
            <InputGroup {...attributes} prefix="¥" type="number" min={0} required />
          )}
        </Field>
        <Field id="hono-group-site-readonly" label="公開済みのURL">
          {(attributes) => (
            <InputGroup
              {...attributes}
              prefix="https://"
              suffix=".example.jp"
              value="archive"
              readonly
            />
          )}
        </Field>
        <Field id="hono-group-search-disabled" label="停止中の検索">
          {(attributes) => (
            <InputGroup
              {...attributes}
              type="search"
              disabled
              value="受付停止中"
              action={{ label: "検索する" }}
            />
          )}
        </Field>
        <form action="/apps/search" method="get">
          <Field id="hono-group-search-large" label="記事を検索（大きい入力）">
            {(attributes) => (
              <InputGroup
                {...attributes}
                prefix={<Icon name="search" />}
                type="search"
                name="q"
                placeholder="記事名や本文から探す"
                size="large"
                action={{ label: "検索", type: "submit" }}
              />
            )}
          </Field>
        </form>
      </div>
    </Disclosure>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-split">
  <div class="rx-field">
    <div class="heading"><label for="hono-group-price">料金（円）</label></div>
    <div class="rx-input-group">
      <div class="control" data-size="default">
        <span class="affix" id="hono-group-price-prefix">¥</span
        ><input
          aria-describedby="hono-group-price-help hono-group-price-prefix"
          type="number"
          name="price"
          min="0"
          max="100000"
          step="100"
          value="1200"
          id="hono-group-price"
          data-size="default"
          data-controller="number-field"
          data-number-field-page-step-value="10"
          class="rx-input"
        />
      </div>
    </div>
    <div class="messages">
      <p class="help" id="hono-group-price-help">
        <span>100円単位で設定できます。</span>
      </p>
    </div>
  </div>
  <div class="rx-field">
    <div class="heading"><label for="hono-group-capacity">定員（人）</label></div>
    <div class="rx-input-group">
      <div class="control" data-size="default">
        <input
          aria-describedby="hono-group-capacity-suffix"
          type="number"
          name="capacity"
          min="1"
          max="20"
          value="5"
          id="hono-group-capacity"
          data-size="default"
          data-controller="number-field"
          data-number-field-page-step-value="10"
          class="rx-input"
        /><span class="affix" id="hono-group-capacity-suffix">人</span>
      </div>
    </div>
  </div>
  <div class="rx-field">
    <div class="heading"><label for="hono-group-site">サイトのURL</label></div>
    <div class="rx-input-group">
      <div class="control" data-size="default">
        <span class="affix" id="hono-group-site-prefix">https://</span
        ><input
          aria-describedby="hono-group-site-prefix hono-group-site-suffix"
          name="subdomain"
          value="studio"
          id="hono-group-site"
          data-size="default"
          class="rx-input"
        /><span class="affix" id="hono-group-site-suffix">.example.jp</span>
      </div>
    </div>
  </div>
  <form action="/apps/search" method="get">
    <div class="rx-field">
      <div class="heading"><label for="hono-group-search">記事を検索</label></div>
      <div class="rx-input-group">
        <div class="control" data-size="default">
          <span class="affix" id="hono-group-search-prefix"
            ><svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-search"></use></svg></span
          ><input
            aria-describedby="hono-group-search-prefix"
            type="search"
            name="q"
            placeholder="記事名や本文から探す"
            id="hono-group-search"
            data-size="default"
            class="rx-input"
          />
        </div>
        <button
          class="rx-button"
          type="submit"
          data-variant="secondary"
          data-size="default"
        >
          検索
        </button>
      </div>
    </div>
  </form>
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
        ><span class="title">エラー・閲覧専用・利用不可・大きい入力</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-stack">
        <div class="rx-field">
          <div class="heading">
            <label for="hono-group-price-error">料金（入力エラー）</label>
          </div>
          <div class="rx-input-group">
            <div class="control" data-size="default">
              <span class="affix" id="hono-group-price-error-prefix">¥</span
              ><input
                aria-describedby="hono-group-price-error-error hono-group-price-error-prefix"
                aria-invalid="true"
                data-invalid="true"
                type="number"
                min="0"
                required=""
                id="hono-group-price-error"
                data-size="default"
                data-controller="number-field"
                data-number-field-page-step-value="10"
                class="rx-input"
              />
            </div>
          </div>
          <div class="messages">
            <p class="error" id="hono-group-price-error-error">
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span>料金を入力してください。</span>
            </p>
          </div>
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="hono-group-site-readonly">公開済みのURL</label>
          </div>
          <div class="rx-input-group">
            <div class="control" data-size="default">
              <span class="affix" id="hono-group-site-readonly-prefix">https://</span
              ><input
                aria-describedby="hono-group-site-readonly-prefix hono-group-site-readonly-suffix"
                value="archive"
                readonly=""
                id="hono-group-site-readonly"
                data-size="default"
                class="rx-input"
              /><span class="affix" id="hono-group-site-readonly-suffix"
                >.example.jp</span
              >
            </div>
          </div>
        </div>
        <div class="rx-field">
          <div class="heading">
            <label for="hono-group-search-disabled">停止中の検索</label>
          </div>
          <div class="rx-input-group">
            <div class="control" data-size="default">
              <input
                type="search"
                disabled=""
                value="受付停止中"
                id="hono-group-search-disabled"
                data-size="default"
                class="rx-input"
              />
            </div>
            <button
              class="rx-button"
              type="button"
              data-variant="secondary"
              data-size="default"
              disabled=""
            >
              検索する
            </button>
          </div>
        </div>
        <form action="/apps/search" method="get">
          <div class="rx-field">
            <div class="heading">
              <label for="hono-group-search-large">記事を検索（大きい入力）</label>
            </div>
            <div class="rx-input-group">
              <div class="control" data-size="large">
                <span class="affix" id="hono-group-search-large-prefix"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-search"></use></svg></span
                ><input
                  aria-describedby="hono-group-search-large-prefix"
                  type="search"
                  name="q"
                  placeholder="記事名や本文から探す"
                  id="hono-group-search-large"
                  data-size="large"
                  class="rx-input"
                />
              </div>
              <button
                class="rx-button"
                type="submit"
                data-variant="secondary"
                data-size="large"
              >
                検索
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </details>
</div>
```

</details>
