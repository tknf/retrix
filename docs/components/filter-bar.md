<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# FilterBar

一覧の絞り込み条件を、リンクで切り替えます。

## 使いどころ

- 一覧の上で、状態や期間などの条件を一つ選んで絞り込む時に使います。`appearance="segmented"` にすると、月・週・一覧のような表示の切り替えにも使えます。
- 条件ごとにページ（URL）を移ります。ページを移らずにその場で切り替える時は `Tabs` や `ToggleGroup`、多めの候補から打って探して選ぶ時は `FilterMenu` を使います。

## 使い方

`label` と `items`（`label`・`href`・`current`・任意の `count`・`icon`）を渡します。各条件は `Button` と同じ文字の大きさ（12px）と高さ（22px）の `ActionLink` になります。`count` は名前の後に数字で出し、0も表示します。

`appearance` の `chips` は、各条件を枠も面も無い黒い文字にして0.25remの間隔で並べて折り返します。件数は淡い青の数字（#5574b0）で、ホバーすると条件名に下線を引きます。`current` の条件は、メニューの選んでいる項目と同じ淡い青（`--rx-option-active`、#ddeefe）の面に黒い文字（件数も黒）にし、ピルで囲みません。`segmented` は控えめなボタンを `ButtonGroup` と同じく隙間なくつなげて間を1本の線にし、外側の角だけを丸めた一組として一行に並べます。件数は灰色の数字で、`current` の条件はチェックボックスの選んだ状態と同じ淡い青の縦の塗りに紺の縁と紺の文字にします。

条件を含むURLと、どれを選んでいるかはサーバーが決めて渡します。`items` の代わりに `children` でリンクを直接並べることもできます。その時は `a` 要素を直接の子にし、現在地の `aria-current`・`data-current="true"` は利用側で付けます。

controllerは持たず、通常のリンクなのでJavaScriptが無くても移れます。

## アクセシビリティ

- 全体は `nav` で、`label` を名前にします。何を絞り込むかを短く書きます（「記事の状態」など）。
- `current` の条件に `aria-current="page"` を付け、今選んでいる条件を読み上げでも伝えます。

## API

### FilterBar

| 名前                   | 型                         | 既定値    | 説明                                                                             |
| ---------------------- | -------------------------- | --------- | -------------------------------------------------------------------------------- |
| `label`（必須）        | `string`                   |           | navの読み上げ名。何を絞り込むか・切り替えるかを短く書く（「記事の状態」など）。  |
| `appearance`           | `"chips" \| "segmented"`   | `"chips"` | chipsは折り返す絞り込み、segmentedは表示の切り替えとしてつながった一組で並べる。 |
| `items`（形による）    | `readonly FilterBarItem[]` |           | 並べる条件。並べた順にActionLinkのリンクにする。                                 |
| `children`（形による） | `Child`                    |           | itemsの代わりに直接並べるリンク。現在地のaria-currentなどは利用側で付ける。      |

ほかに、`<nav>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/filter-bar.css`

#### `FilterBarItem`

FilterBarの一件。Navigationの項目と同じ形で、currentは選んでいる条件を示す。

| 名前            | 型        | 既定値 | 説明                                                                |
| --------------- | --------- | ------ | ------------------------------------------------------------------- |
| `label`（必須） | `string`  |        | 項目の名前。                                                        |
| `href`（必須）  | `string`  |        | 移動先のURL。現在地の項目もリンクのまま出す。                       |
| `current`       | `boolean` |        | 今いる項目。aria-current="page"を付け、見た目でも現在地として示す。 |
| `count`         | `number`  |        | 名前の後に出す件数。0も表示し、省略すると出さない。                 |
| `icon`          | `Child`   |        | 名前の前のアイコン（Iconなど）。                                    |

## コード

```tsx
import { Disclosure, FilterBar } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <div class="rx-stack" data-space="small">
      <p class="label">予定を月で絞り込む</p>
      <FilterBar
        label="表示する月"
        items={[
          { label: "8月", href: "/apps/schedule?month=8" },
          { label: "9月", href: "/apps/schedule", current: true },
        ]}
      />
    </div>
    <div class="rx-stack" data-space="small">
      <p class="label">表示を切り替える</p>
      <FilterBar
        label="予定の表示形式"
        appearance="segmented"
        items={[
          { label: "月", href: "/apps/schedule", current: true },
          { label: "週", href: "/apps/schedule?view=week" },
          { label: "年", href: "/apps/schedule?view=year" },
          { label: "一覧", href: "/apps/schedule?view=agenda" },
        ]}
      />
    </div>
    <Disclosure summary="件数・0件・長い条件名">
      <div class="rx-stack">
        <FilterBar
          label="記事の状態"
          items={[
            { label: "すべて", href: "/apps/search", count: 6, current: true },
            { label: "公開中", href: "/apps/search?state=公開中", count: 3 },
            { label: "下書き", href: "/apps/search?state=下書き", count: 3 },
            { label: "該当なし", href: "/apps/search?q=該当なし", count: 0 },
          ]}
        />
        <FilterBar
          label="検索する内容"
          items={[
            { label: "すべて", href: "/apps/search", current: true },
            {
              label: "長く使う道具と日々の暮らしを整える工夫について",
              href: "/apps/search?q=道具",
            },
            { label: "初めての方への申し込み手順", href: "/apps/search?q=申し込み" },
          ]}
        />
      </div>
    </Disclosure>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <div class="rx-stack" data-space="small">
    <p class="label">予定を月で絞り込む</p>
    <nav class="rx-filter-bar" aria-label="表示する月">
      <a
        href="/apps/schedule?month=8"
        class="rx-button"
        data-variant="secondary"
        data-size="default"
        ><span>8月</span></a
      ><a
        href="/apps/schedule"
        aria-current="page"
        data-current="true"
        class="rx-button"
        data-variant="secondary"
        data-size="default"
        ><span>9月</span></a
      >
    </nav>
  </div>
  <div class="rx-stack" data-space="small">
    <p class="label">表示を切り替える</p>
    <nav class="rx-filter-bar" aria-label="予定の表示形式" data-appearance="segmented">
      <a
        href="/apps/schedule"
        aria-current="page"
        data-current="true"
        class="rx-button"
        data-variant="secondary"
        data-size="default"
        ><span>月</span></a
      ><a
        href="/apps/schedule?view=week"
        class="rx-button"
        data-variant="secondary"
        data-size="default"
        ><span>週</span></a
      ><a
        href="/apps/schedule?view=year"
        class="rx-button"
        data-variant="secondary"
        data-size="default"
        ><span>年</span></a
      ><a
        href="/apps/schedule?view=agenda"
        class="rx-button"
        data-variant="secondary"
        data-size="default"
        ><span>一覧</span></a
      >
    </nav>
  </div>
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
      ><span class="label"><span class="title">件数・0件・長い条件名</span></span>
    </summary>
    <div class="body">
      <div class="rx-stack">
        <nav class="rx-filter-bar" aria-label="記事の状態">
          <a
            href="/apps/search"
            aria-current="page"
            data-current="true"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            ><span>すべて</span><small>6</small></a
          ><a
            href="/apps/search?state=公開中"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            ><span>公開中</span><small>3</small></a
          ><a
            href="/apps/search?state=下書き"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            ><span>下書き</span><small>3</small></a
          ><a
            href="/apps/search?q=該当なし"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            ><span>該当なし</span><small>0</small></a
          >
        </nav>
        <nav class="rx-filter-bar" aria-label="検索する内容">
          <a
            href="/apps/search"
            aria-current="page"
            data-current="true"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            ><span>すべて</span></a
          ><a
            href="/apps/search?q=道具"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            ><span>長く使う道具と日々の暮らしを整える工夫について</span></a
          ><a
            href="/apps/search?q=申し込み"
            class="rx-button"
            data-variant="secondary"
            data-size="default"
            ><span>初めての方への申し込み手順</span></a
          >
        </nav>
      </div>
    </div>
  </details>
</div>
```

</details>
