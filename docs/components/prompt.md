<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Prompt

質問を層の見出しに置き、回答の選択肢をカードに並べます。

## 使いどころ

- すぐ下の対象について「どれに近いか」「最初に何をするか」など、作業の流れの中で一つの答えを求める時に使います。
- 作業を止めて確認や判断を求める時は `Dialog` を使います。
- フォームの中で値を選ぶ時は、`Field` と `CheckboxGroup` や `Select` を使います。
- 見出しと中身をまとめるだけで答えを求めない時は `LayerCard` を使います。

## 使い方

`LayerCard` そのものの形で、`question` を淡い青の層の見出しに、`choices` を白いカードの中の行に置きます。行は丸いマーク・太字の `title`・淡い `description`・進む矢印で、ホバーすると淡い青の面と青から紫のマークになり、押すと内側へへこみます。

`href` を渡した選択肢は移動のリンク、渡さない選択肢は `type="submit"` のボタンになり、`name` と選択肢の `value` を送ります。フォームはPromptの外側に利用側が置き、答えの保存も利用側で行います。

`dismiss` には、選ばずに閉じる操作（「今は答えない」の `ActionLink` など）を渡し、見出しの行の終わりに置きます。閉じた後にまた出すかどうかは利用側で決めます。

既定で層の下に尾を付け、すぐ下の対象を指します。尾は層の外に出るので、下の対象との間を16px以上空けます。尾が要らない時は `pointer={false}` にします。

行は複数行の文を持つ専用の操作で、文字の指定は `prompt.css` が持ちます。利用側のCSSで行の文字を上書きしません。JavaScriptは使いません。

## アクセシビリティ

- 全体は `section` で、`question` を読み上げ名と見出し（`h3`）にします。
- 選択肢はリンクかボタンなので、Tabで順に移り、リンクはEnter、ボタンはEnterかSpaceで答えます。丸いマークと矢印は読み上げから外します。

## API

### Prompt

判断を依頼する問いかけ。LayerCardの淡い青の層に問いを見出しとして置き、白いカードに選択肢の行を並べる。行は丸いアイコン・太字の要点・淡い説明・進む矢印を持ち、押すとその答えを選ぶ。尾ですぐ下の対象を指せる。選択肢の行は複数行の文を持つ専用の操作で、文字の指定はprompt.cssが持つ。

| 名前               | 型                        | 既定値 | 説明                                                                 |
| ------------------ | ------------------------- | ------ | -------------------------------------------------------------------- |
| `question`（必須） | `string`                  |        | 問い。層の見出し（h3）に書き、読み上げ名（aria-label）にもする。     |
| `choices`（必須）  | `readonly PromptChoice[]` |        | 答えの行。並べた順に上から置く。                                     |
| `name`             | `string`                  |        | ボタンの選択肢が送る名前。                                           |
| `dismiss`          | `Child`                   |        | 選ばずに閉じる操作（「今は答えない」など）。見出しの行の末尾に置く。 |
| `pointer`          | `boolean`                 | `true` | 層の下に尾を付けて、すぐ下の要素を指す。falseで尾を外す。            |

ほかのpropsは`LayerCard`へそのまま渡します。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/icon.css`、`components/layer-card.css`、`components/prompt.css`

#### `PromptChoice`

| 名前            | 型       | 既定値 | 説明                                                                   |
| --------------- | -------- | ------ | ---------------------------------------------------------------------- |
| `value`（必須） | `string` |        | 送信のボタンの時にnameと一緒に送る値。hrefを渡した選択肢では使わない。 |
| `title`（必須） | `string` |        | 選択肢の要点。太字で書く。                                             |
| `description`   | `Child`  |        | 要点の下に添える説明。                                                 |
| `href`          | `string` |        | 渡すと移動のリンク、無ければ送信のボタン（nameとvalueを送る）。        |

## コード

```tsx
import { Prompt, ActionLink, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <form>
      <Prompt
        question="下のメールはどれに近いですか？"
        name="kind"
        choices={[
          {
            value: "person",
            title: "人からのメール",
            description: "返信するかもしれない、見逃したくない大事なもの（請求など）。",
          },
          {
            value: "newsletter",
            title: "お知らせ",
            description: "読むだけのもの。急がず、届いた時に読めれば十分。",
          },
          {
            value: "receipt",
            title: "領収書や確認",
            description: "注文の確認や、宣伝、手続きのメール。",
          },
        ]}
        dismiss={<ActionLink href="/">今は答えない</ActionLink>}
      />
    </form>
    <DisclosureGroup label="選択肢と置き場所の違い">
      <Disclosure summary="移動のリンクの選択肢・尾なし">
        <Prompt
          question="最初に何をしますか？"
          pointer={false}
          choices={[
            { value: "board", title: "ボードを作る", href: "/" },
            { value: "invite", title: "人を招待する", href: "/" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：選択肢を縦に積む">
        <div style="max-inline-size: 20rem">
          <Prompt
            question="この差出人からのメールを受け取りますか？"
            choices={[
              { value: "yes", title: "受け取る", href: "/" },
              { value: "no", title: "受け取らない", href: "/" },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Prompt
            question="كيف تصف هذه الرسالة؟"
            pointer={false}
            choices={[
              { value: "person", title: "من شخص", href: "/" },
              { value: "news", title: "نشرة", href: "/" },
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
  <form>
    <section
      aria-label="下のメールはどれに近いですか？"
      data-pointer="true"
      class="rx-layer-card rx-prompt"
    >
      <header class="heading">
        <h3 class="title">下のメールはどれに近いですか？</h3>
        <div class="actions">
          <a href="/" class="rx-button" data-variant="secondary" data-size="default"
            >今は答えない</a
          >
        </div>
      </header>
      <div class="body">
        <div class="choices">
          <button type="submit" class="choice" name="kind" value="person">
            <span class="mark" aria-hidden="true"></span
            ><span class="text"
              ><strong>人からのメール</strong
              ><span class="description"
                >返信するかもしれない、見逃したくない大事なもの（請求など）。</span
              ></span
            ><span class="go" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-arrow"></use></svg
            ></span></button
          ><button type="submit" class="choice" name="kind" value="newsletter">
            <span class="mark" aria-hidden="true"></span
            ><span class="text"
              ><strong>お知らせ</strong
              ><span class="description"
                >読むだけのもの。急がず、届いた時に読めれば十分。</span
              ></span
            ><span class="go" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-arrow"></use></svg
            ></span></button
          ><button type="submit" class="choice" name="kind" value="receipt">
            <span class="mark" aria-hidden="true"></span
            ><span class="text"
              ><strong>領収書や確認</strong
              ><span class="description"
                >注文の確認や、宣伝、手続きのメール。</span
              ></span
            ><span class="go" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-arrow"></use></svg
            ></span>
          </button>
        </div>
      </div>
    </section>
  </form>
  <div class="rx-disclosure-group" role="group" aria-label="選択肢と置き場所の違い">
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
          ><span class="title">移動のリンクの選択肢・尾なし</span></span
        >
      </summary>
      <div class="body">
        <section aria-label="最初に何をしますか？" class="rx-layer-card rx-prompt">
          <header class="heading"><h3 class="title">最初に何をしますか？</h3></header>
          <div class="body">
            <div class="choices">
              <a class="choice" href="/"
                ><span class="mark" aria-hidden="true"></span
                ><span class="text"><strong>ボードを作る</strong></span
                ><span class="go" aria-hidden="true"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-arrow"></use></svg></span></a
              ><a class="choice" href="/"
                ><span class="mark" aria-hidden="true"></span
                ><span class="text"><strong>人を招待する</strong></span
                ><span class="go" aria-hidden="true"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-arrow"></use></svg></span
              ></a>
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
          ><span class="title">狭い場所：選択肢を縦に積む</span></span
        >
      </summary>
      <div class="body">
        <div style="max-inline-size: 20rem">
          <section
            aria-label="この差出人からのメールを受け取りますか？"
            data-pointer="true"
            class="rx-layer-card rx-prompt"
          >
            <header class="heading">
              <h3 class="title">この差出人からのメールを受け取りますか？</h3>
            </header>
            <div class="body">
              <div class="choices">
                <a class="choice" href="/"
                  ><span class="mark" aria-hidden="true"></span
                  ><span class="text"><strong>受け取る</strong></span
                  ><span class="go" aria-hidden="true"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-arrow"></use></svg></span></a
                ><a class="choice" href="/"
                  ><span class="mark" aria-hidden="true"></span
                  ><span class="text"><strong>受け取らない</strong></span
                  ><span class="go" aria-hidden="true"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-arrow"></use></svg></span
                ></a>
              </div>
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
          <section aria-label="كيف تصف هذه الرسالة؟" class="rx-layer-card rx-prompt">
            <header class="heading"><h3 class="title">كيف تصف هذه الرسالة؟</h3></header>
            <div class="body">
              <div class="choices">
                <a class="choice" href="/"
                  ><span class="mark" aria-hidden="true"></span
                  ><span class="text"><strong>من شخص</strong></span
                  ><span class="go" aria-hidden="true"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-arrow"></use></svg></span></a
                ><a class="choice" href="/"
                  ><span class="mark" aria-hidden="true"></span
                  ><span class="text"><strong>نشرة</strong></span
                  ><span class="go" aria-hidden="true"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-arrow"></use></svg></span
                ></a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
