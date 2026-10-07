<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Section

関連する内容を、見出し・件数・操作と一緒にまとめます。

## 使いどころ

- 作業面の中で、関連する一覧や内容を見出しと件数でまとめる時に使います。
- 画面全体の見出しは`PageHeader`、一件の内容をカードにまとめる時は`Card`、見出しを持たない区切りは`Divider`を使います。

## 使い方

`title`を見出しに出し、`children`をその下に置きます。見出しは丸いマーク・太字の名前・件数だけで、線を引きません。続く一覧や表の罫線と重ねないためです。

`count`は名前の横の小さなピルに出します。`count={0}`も表示します。

`tone`は見出しの前のマークの色です。`neutral`は灰色、`info`・`success`・`warning`・`danger`はそれぞれの役割の色です。色だけで状態を伝えず、見出しの文言でも示します。

`actions`は見出しの行の末尾側に寄せます。狭い場所では見出しの行を折り返します。

## アクセシビリティ

- ルートは`section`、見出しは常に`h2`です。画面の見出し（`h1`）の下のまとまりに使います。
- ルートに読み上げ名は付けません。ランドマークとして扱わせたい時は、`aria-labelledby`などを利用側で渡します。

## API

### Section

| 名前            | 型       | 既定値      | 説明                                                                                     |
| --------------- | -------- | ----------- | ---------------------------------------------------------------------------------------- |
| `title`（必須） | `string` |             | 見出しの文言。h2で出す。                                                                 |
| `count`         | `number` |             | 見出しの横に出す件数。0も表示し、省略すると出さない。                                    |
| `tone`          | `Tone`   | `"neutral"` | 見出しの前の丸いマークの色。色だけでは意味が伝わらないので、状態は見出しの文言でも示す。 |
| `actions`       | `Child`  |             | 見出しの行の末尾側に置く操作（ActionLinkやButtonなど）。                                 |
| `children`      | `Child`  |             | 見出しの下に置く内容。                                                                   |

ほかに、`<section>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/section.css`

#### `Tone`

値：`"neutral" | "info" | "success" | "warning" | "danger"`

## コード

```tsx
import { Section, TaskList } from "@tknf/retrix/hono";
export default () => (
  <Section title="進めている" count={2} tone="info">
    <TaskList
      label="進めている仕事"
      items={[
        { name: "section-first", label: "最初の案をまとめる" },
        { name: "section-review", label: "チームで確認する" },
      ]}
    />
  </Section>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<section class="rx-section" data-tone="info">
  <header class="heading">
    <h2>進めている</h2>
    <span class="count">2</span>
  </header>
  <div class="rx-task-list">
    <ul class="sheet" aria-label="進めている仕事">
      <li>
        <label class="rx-choice" data-kind="plain"
          ><input name="section-first" type="checkbox" /><span
            ><strong>最初の案をまとめる</strong></span
          ></label
        >
      </li>
      <li>
        <label class="rx-choice" data-kind="plain"
          ><input name="section-review" type="checkbox" /><span
            ><strong>チームで確認する</strong></span
          ></label
        >
      </li>
    </ul>
  </div>
</section>
```

</details>
