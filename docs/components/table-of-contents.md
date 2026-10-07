<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# TableOfContents

長い資料の見出しへ移動し、現在の位置を示します。

## 使いどころ

- 規約や手順書などの長い資料で、本文の冒頭に番号付きの目次を置き、見出しへ移れるようにする時に使います。
- 同じ領域のページを切り替える時は`Navigation`、同じ場所でパネルを切り替える時は`Tabs`を使います。

## 使い方

`label`と`sections`を渡すと、番号付きの目次と、見出し・本文を続けて描画します。各節は`id`・`title`・`content`を持ち、`level: 3`で小見出しにして「1.1」のように一段下げます。前に章がない`level: 3`は、章として扱います。

目次の見出しは字間を空けた小さな大文字の太字、番号は茶色の小さな数字です。項目は`Navigation`と同じく背景のパネルを持たず、ホバーすると名前に下線を引き、今読んでいる項目は淡い灰色の面と黒い太字で示します。本文の節の見出し（`h2`）は`Section`と同じ赤茶の通常の太さ、小見出し（`h3`）は黒い小さな太字です。

目次の項目は通常のページ内リンクなので、JavaScriptなしでも見出しへ移れます。

`TableOfContentsController`を`table-of-contents`として登録すると、スクロールに合わせて今読んでいる節の項目を示します。画面の上端から`offset`（px）の位置を越えた最後の見出しを現在地にし、ページの末尾まで読むと最後の見出しを現在地にします。

各`id`はページ内で一意にし、空白を含めません。controllerはidの重複や空白を見つけると、現在地を示しません。

## アクセシビリティ

- 目次は`label`を読み上げ名に持つ`nav`で、番号は`aria-hidden`で読み上げません。
- 現在地の項目に`aria-current="location"`を付けます。
- 見出しは`level`に応じて`h2`・`h3`で出します。画面の見出し（`h1`）の下に置きます。

## API

### TableOfContents

長い資料の見出しとページ内リンクを一緒に描画する。

| 名前               | 型                                  | 既定値 | 説明                                                                                                                                                                                  |
| ------------------ | ----------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須）    | `string`                            |        | 目次の見出しと、navの読み上げ名。                                                                                                                                                     |
| `sections`（必須） | `readonly TableOfContentsSection[]` |        | 目次と本文に並べる節。書いた順に番号を振る。                                                                                                                                          |
| `offset`           | `number`                            | `80`   | 現在地を判定する位置。画面の上端からの距離（px）で、この位置を越えた最後の見出しを現在地にする。固定したバーで見出しが隠れる時は、その高さに合わせる。0未満や数でない値は既定に戻す。 |

登録するcontroller：`table-of-contents`（`TableOfContentsController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/table-of-contents.css`

#### `TableOfContentsSection`

| 名前              | 型       | 既定値 | 説明                                                                                                                 |
| ----------------- | -------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| `id`（必須）      | `string` |        | 見出しのid。目次のページ内リンクの行き先になる。空白を含めず、ページ内で一意にする。                                 |
| `title`（必須）   | `string` |        | 見出しの文言。目次の項目と本文の見出しの両方に出す。                                                                 |
| `level`           | `2 \| 3` |        | 見出しの段。2は章（h2）、3は小見出し（h3）で、目次では「1.1」のように一段下げる。前に章が一つもない3は章として扱う。 |
| `content`（必須） | `Child`  |        | 見出しの下に置く本文。                                                                                               |

## コード

```tsx
import { TableOfContents } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <p>公開前の確認事項を、担当者が上から順に読み進めるための資料です。</p>
    <TableOfContents
      label="この資料の目次"
      sections={[
        {
          id: "guide-purpose",
          title: "この資料の目的",
          content: (
            <p>
              公開する内容、添付ファイル、共有範囲を一つずつ確認します。修正が必要な項目は、公開する前に担当者へ戻してください。
            </p>
          ),
        },
        {
          id: "guide-content",
          title: "内容の確認",
          content: (
            <ul>
              <li>見出しと本文が、現在の案内内容と一致しているか</li>
              <li>日時や連絡先が、予定表と一致しているか</li>
              <li>リンク先を開き、閲覧できるか</li>
            </ul>
          ),
        },
        {
          id: "guide-attachments",
          title: "添付ファイル",
          level: 3,
          content: (
            <p>
              最新版のファイルが添付されていることを確認します。古い版が残っている場合は、公開前に取り除いてください。
            </p>
          ),
        },
        {
          id: "guide-sharing",
          title: "共有範囲",
          level: 3,
          content: (
            <p>
              閲覧できる人と公開開始日を確認します。限定公開の資料は、対象外の人へリンクを送らないでください。
            </p>
          ),
        },
        {
          id: "guide-final",
          title: "最終確認",
          content: (
            <p>
              修正が反映された内容をもう一度読み返し、担当者と確認日を記録してから公開します。
            </p>
          ),
        },
      ]}
    />
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <p>公開前の確認事項を、担当者が上から順に読み進めるための資料です。</p>
  <div
    class="rx-table-of-contents"
    data-controller="table-of-contents"
    data-table-of-contents-offset-value="80"
  >
    <nav aria-label="この資料の目次" data-table-of-contents-target="nav">
      <p class="heading">この資料の目次</p>
      <ol>
        <li data-level="2">
          <a href="#guide-purpose" data-table-of-contents-target="link"
            ><span class="number" aria-hidden="true">1</span
            ><span class="title">この資料の目的</span></a
          >
        </li>
        <li data-level="2">
          <a href="#guide-content" data-table-of-contents-target="link"
            ><span class="number" aria-hidden="true">2</span
            ><span class="title">内容の確認</span></a
          >
        </li>
        <li data-level="3">
          <a href="#guide-attachments" data-table-of-contents-target="link"
            ><span class="number" aria-hidden="true">2.1</span
            ><span class="title">添付ファイル</span></a
          >
        </li>
        <li data-level="3">
          <a href="#guide-sharing" data-table-of-contents-target="link"
            ><span class="number" aria-hidden="true">2.2</span
            ><span class="title">共有範囲</span></a
          >
        </li>
        <li data-level="2">
          <a href="#guide-final" data-table-of-contents-target="link"
            ><span class="number" aria-hidden="true">3</span
            ><span class="title">最終確認</span></a
          >
        </li>
      </ol>
    </nav>
    <div class="body">
      <section data-level="2">
        <h2 id="guide-purpose" data-table-of-contents-target="heading">
          この資料の目的
        </h2>
        <div class="content">
          <p>
            公開する内容、添付ファイル、共有範囲を一つずつ確認します。修正が必要な項目は、公開する前に担当者へ戻してください。
          </p>
        </div>
      </section>
      <section data-level="2">
        <h2 id="guide-content" data-table-of-contents-target="heading">内容の確認</h2>
        <div class="content">
          <ul>
            <li>見出しと本文が、現在の案内内容と一致しているか</li>
            <li>日時や連絡先が、予定表と一致しているか</li>
            <li>リンク先を開き、閲覧できるか</li>
          </ul>
        </div>
      </section>
      <section data-level="3">
        <h3 id="guide-attachments" data-table-of-contents-target="heading">
          添付ファイル
        </h3>
        <div class="content">
          <p>
            最新版のファイルが添付されていることを確認します。古い版が残っている場合は、公開前に取り除いてください。
          </p>
        </div>
      </section>
      <section data-level="3">
        <h3 id="guide-sharing" data-table-of-contents-target="heading">共有範囲</h3>
        <div class="content">
          <p>
            閲覧できる人と公開開始日を確認します。限定公開の資料は、対象外の人へリンクを送らないでください。
          </p>
        </div>
      </section>
      <section data-level="2">
        <h2 id="guide-final" data-table-of-contents-target="heading">最終確認</h2>
        <div class="content">
          <p>
            修正が反映された内容をもう一度読み返し、担当者と確認日を記録してから公開します。
          </p>
        </div>
      </section>
    </div>
  </div>
</div>
```

</details>
