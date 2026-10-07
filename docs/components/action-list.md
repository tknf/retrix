<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# ActionList

作業へのリンクを、一覧や内容の見えるカードで示します。

## 使いどころ

- 別の画面へ移動して行う作業やツールへのリンクを、アイコンと名前で並べる時に使います。
- 各行は一つのリンクです。行に状態やボタンなど別の操作が付く時は `DataList` を使います。
- アイコンと名前を縦に積んだ大きなショートカットや、その場で行う操作には `ActionTile` を使います。

## 使い方

`items` にリンクごとの `title` と `href` を渡し、`description` と塗りつぶしの `Icon`（`icon`）を添えます。名前は、移動先で行う作業を動詞で書きます。

`layout="list"` は背景を持たずに行を積み、行の幅いっぱいの罫線で区切ります。`layout="grid"` は同じ行の形のまま、各リンクを白い面に罫線の色の枠を付けた小さなタイル（角丸3px）にし、13rem以上の幅で格子に並べます。

名前は本文のリンクと同じ青緑の太字に下線を引き、説明は灰色の小さな文字です。アイコンは丸い面に入れず、名前の一行目の前に小さく添えます。`accent` はアイコンの色で、`blue`（既定、リンクと同じ青緑）・`green`・`amber`・`coral` で用途を見分けます。状態を示す色には使いません。未確認の連絡先のように対応が必要な行は `attention` にすると、`accent` より優先してアイコン・名前・説明を危険を示す赤茶で表示します。

`preview` に直近の数件などを渡すと、説明の下に中身の見本を置きます。行全体がリンクなので、見本の中にボタンやリンクを置きません。

ホバーすると行を淡い黄色の面にし、名前を赤茶にします。押している間は黄色の面です。JavaScriptは使いません。

## アクセシビリティ

- ルートは `ul` で、各リンクは `li` の中の一つの `a` です。一覧の名前は `aria-label` などで利用側が付けます。
- `icon` に置く `Icon` は読み上げから外れます。名前だけで移動先が分かるように書きます。
- `attention` は色で示すので、対応が必要な理由を `description` に書きます。

## API

### ActionList

| 名前            | 型                          | 既定値   | 説明                                                                                               |
| --------------- | --------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| `items`（必須） | `readonly ActionListItem[]` |          | 並べる項目。                                                                                       |
| `layout`        | `"list" \| "grid"`          | `"list"` | listは淡いパネルに行を積み、行の間を細い線で区切る。gridは各項目を角丸のタイルにして格子に並べる。 |

ほかに、`<ul>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/action-list.css`

#### `ActionListItem`

一件の項目。行（またはタイル）全体が一つのリンクになる。

| 名前            | 型        | 既定値 | 説明                                                                                         |
| --------------- | --------- | ------ | -------------------------------------------------------------------------------------------- |
| `title`（必須） | `string`  |        | 項目の名前。移動先で行う作業を動詞で書く。                                                   |
| `href`（必須）  | `string`  |        | 移動先。行全体をこのリンクにする。                                                           |
| `description`   | `string`  |        | 名前の下に淡い文字で添える一文。                                                             |
| `icon`          | `Child`   |        | 名前の前に置くアイコン。accentの色を淡く敷いた丸に載せる。塗りつぶしのIconを想定する。       |
| `preview`       | `Child`   |        | 説明の下に置く中身の見本（直近の数件など）。リンクの中に入るので、ボタンやリンクを入れない。 |
| `accent`        | `Accent`  |        | アイコンの色。用途を見分けるためだけに使い、状態の色には使わない。                           |
| `attention`     | `boolean` |        | 対応が必要な行（未確認の予備の連絡先など）。名前と説明を危険の色で書く。                     |

#### `Accent`

値：`"blue" | "green" | "amber" | "coral"`

## コード

```tsx
import { ActionList, Icon, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack">
    <ActionList
      aria-label="よく使うツール"
      items={[
        {
          title: "記事を書く",
          href: "/apps/docs",
          description: "途中まで書いて、下書きとして保存できます。",
          icon: <Icon name="pencil" fill />,
        },
        {
          title: "予約を確認する",
          href: "/apps/schedule",
          description: "日時と人数、利用する部屋を確認します。",
          icon: <Icon name="calendar" fill />,
          accent: "green",
        },
        {
          title: "資料をまとめる",
          href: "/apps/files",
          icon: <Icon name="files" fill />,
          accent: "amber",
        },
        {
          title: "すべての添付ファイルと過去に公開した資料を確認する",
          href: "/apps/files",
        },
      ]}
    />
    <DisclosureGroup label="並べ方と置き場所の違い">
      <Disclosure summary="対応が必要な行" open>
        <ActionList
          aria-label="ログインと確認"
          items={[
            {
              title: "パスワードを変える",
              href: "/apps/docs",
              icon: <Icon name="pencil" fill />,
            },
            {
              title: "予備のメールアドレス",
              href: "/apps/docs",
              description: "予備のメールアドレスをまだ確かめていません",
              icon: <Icon name="mail" fill />,
              attention: true,
            },
            {
              title: "二段階認証",
              href: "/apps/docs",
              description: "まだ設定していません",
              icon: <Icon name="info" fill />,
              attention: true,
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="タイルに並べる">
        <ActionList
          layout="grid"
          aria-label="ツールへのショートカット"
          items={[
            {
              title: "記事",
              href: "/apps/search",
              icon: <Icon name="pencil" fill />,
              accent: "amber",
            },
            {
              title: "予定",
              href: "/apps/schedule",
              icon: <Icon name="calendar" fill />,
              accent: "green",
            },
            { title: "資料", href: "/apps/files", icon: <Icon name="files" fill /> },
            {
              title: "問い合わせ",
              href: "/apps/docs",
              icon: <Icon name="chat" fill />,
              accent: "coral",
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="中身の見えるタイル">
        <ActionList
          layout="grid"
          aria-label="内容の見えるツールへのショートカット"
          items={[
            {
              title: "記事",
              href: "/apps/search",
              icon: <Icon name="pencil" fill />,
              accent: "amber",
              description: "下書き2件 · 公開中4件",
              preview: (
                <>
                  <p>仕事場の案内</p>
                  <p>秋の読書会のお知らせ</p>
                </>
              ),
            },
            {
              title: "予定",
              href: "/apps/schedule",
              icon: <Icon name="calendar" fill />,
              accent: "green",
              description: "今週2件",
              preview: (
                <>
                  <p>
                    <time datetime="2026-09-25">9月25日</time>　読書会
                  </p>
                  <p>
                    <time datetime="2026-09-28">9月28日</time>　編集会議
                  </p>
                </>
              ),
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 16rem">
          <ActionList
            aria-label="狭い場所のツール"
            items={[
              {
                title: "初めて利用する方への案内を書く",
                href: "/apps/docs",
                description: "https://example.com/articles/autumn-reading-club-2026",
                icon: <Icon name="pencil" fill />,
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <ActionList
            aria-label="الأدوات"
            items={[
              {
                title: "كتابة مقال",
                href: "/apps/docs",
                description: "احفظ المسودة وأكملها لاحقًا.",
                icon: <Icon name="pencil" fill />,
              },
              {
                title: "مراجعة الحجز",
                href: "/apps/schedule",
                icon: <Icon name="calendar" fill />,
                accent: "green",
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
  <ul aria-label="よく使うツール" class="rx-action-list" data-layout="list">
    <li>
      <a href="/apps/docs" data-accent="blue"
        ><span class="icon"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-pencil-fill"></use></svg></span
        ><span class="title">記事を書く</span
        ><small class="description"
          >途中まで書いて、下書きとして保存できます。</small
        ></a
      >
    </li>
    <li>
      <a href="/apps/schedule" data-accent="green"
        ><span class="icon"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-calendar-fill"></use></svg></span
        ><span class="title">予約を確認する</span
        ><small class="description">日時と人数、利用する部屋を確認します。</small></a
      >
    </li>
    <li>
      <a href="/apps/files" data-accent="amber"
        ><span class="icon"
          ><svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-files-fill"></use></svg></span
        ><span class="title">資料をまとめる</span></a
      >
    </li>
    <li>
      <a href="/apps/files" data-accent="blue"
        ><span class="title"
          >すべての添付ファイルと過去に公開した資料を確認する</span
        ></a
      >
    </li>
  </ul>
  <div class="rx-disclosure-group" role="group" aria-label="並べ方と置き場所の違い">
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
        ><span class="label"><span class="title">対応が必要な行</span></span>
      </summary>
      <div class="body">
        <ul aria-label="ログインと確認" class="rx-action-list" data-layout="list">
          <li>
            <a href="/apps/docs" data-accent="blue"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-pencil-fill"></use></svg></span
              ><span class="title">パスワードを変える</span></a
            >
          </li>
          <li>
            <a href="/apps/docs" data-accent="coral" data-attention="true"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-mail-fill"></use></svg></span
              ><span class="title">予備のメールアドレス</span
              ><small class="description"
                >予備のメールアドレスをまだ確かめていません</small
              ></a
            >
          </li>
          <li>
            <a href="/apps/docs" data-accent="coral" data-attention="true"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-info-fill"></use></svg></span
              ><span class="title">二段階認証</span
              ><small class="description">まだ設定していません</small></a
            >
          </li>
        </ul>
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
        ><span class="label"><span class="title">タイルに並べる</span></span>
      </summary>
      <div class="body">
        <ul
          aria-label="ツールへのショートカット"
          class="rx-action-list"
          data-layout="grid"
        >
          <li>
            <a href="/apps/search" data-accent="amber"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-pencil-fill"></use></svg></span
              ><span class="title">記事</span></a
            >
          </li>
          <li>
            <a href="/apps/schedule" data-accent="green"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-calendar-fill"></use></svg></span
              ><span class="title">予定</span></a
            >
          </li>
          <li>
            <a href="/apps/files" data-accent="blue"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-files-fill"></use></svg></span
              ><span class="title">資料</span></a
            >
          </li>
          <li>
            <a href="/apps/docs" data-accent="coral"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-chat-fill"></use></svg></span
              ><span class="title">問い合わせ</span></a
            >
          </li>
        </ul>
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
        ><span class="label"><span class="title">中身の見えるタイル</span></span>
      </summary>
      <div class="body">
        <ul
          aria-label="内容の見えるツールへのショートカット"
          class="rx-action-list"
          data-layout="grid"
        >
          <li>
            <a href="/apps/search" data-accent="amber"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-pencil-fill"></use></svg></span
              ><span class="title">記事</span
              ><small class="description">下書き2件 · 公開中4件</small>
              <div class="preview">
                <p>仕事場の案内</p>
                <p>秋の読書会のお知らせ</p>
              </div></a
            >
          </li>
          <li>
            <a href="/apps/schedule" data-accent="green"
              ><span class="icon"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-calendar-fill"></use></svg></span
              ><span class="title">予定</span><small class="description">今週2件</small>
              <div class="preview">
                <p><time datetime="2026-09-25">9月25日</time>　読書会</p>
                <p><time datetime="2026-09-28">9月28日</time>　編集会議</p>
              </div></a
            >
          </li>
        </ul>
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
          <ul aria-label="狭い場所のツール" class="rx-action-list" data-layout="list">
            <li>
              <a href="/apps/docs" data-accent="blue"
                ><span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-pencil-fill"></use></svg></span
                ><span class="title">初めて利用する方への案内を書く</span
                ><small class="description"
                  >https://example.com/articles/autumn-reading-club-2026</small
                ></a
              >
            </li>
          </ul>
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
          <ul aria-label="الأدوات" class="rx-action-list" data-layout="list">
            <li>
              <a href="/apps/docs" data-accent="blue"
                ><span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-pencil-fill"></use></svg></span
                ><span class="title">كتابة مقال</span
                ><small class="description">احفظ المسودة وأكملها لاحقًا.</small></a
              >
            </li>
            <li>
              <a href="/apps/schedule" data-accent="green"
                ><span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-calendar-fill"></use></svg></span
                ><span class="title">مراجعة الحجز</span></a
              >
            </li>
          </ul>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
