<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# DataList

主な情報・補足・状態を行ごとに並べて比較します。

## 使いどころ

- 人・記事・資料などを一件ずつ、題名・補足・状態で見比べる時に使います。
- 行の末尾に状態や操作を置けます。操作を持たない作業へのリンクを並べる時は `ActionList`、列ごとに値を比べる時は `Table` を使います。
- 差出人・件名・時刻を並べる受信の一覧は `MessageList` を使います。

## 使い方

`items` に一行ずつ `title` と、必要なら `description`・`meta` を渡します。`start` には `Avatar` や塗りつぶしの `Icon` を、`end` には `Badge`・`Button`・日付や件数を置きます。題名は本文の大きさ（13px）の黒い太字です。`description` は題名と同じ大きさの灰色（#666）の抜粋で、「 - 」に続けて題名と同じ行に続けます。`meta` は投稿者や日付を書く茶色の小さな文字（11px）で、題名の下に置きます。`end` に置いた日付などの文字は、題名と同じ大きさの茶色になります。`start` の `Avatar` は30pxの大きさで行の上端にそろえ、題名の列はその右10pxから始めます。

`href` を渡した行は題名が青緑の太字に1pxの下線のリンク（ホバーで赤）になり、押せる範囲を行全体に広げます。ホバーすると行を淡い黄色で塗り、押している間は黄色のハイライト（#ffffcc）にします。`end` の操作はリンクの上に重ねて押せます。`href` の無い行は押せない行として表示します。

`current` の行は、今開いている行として黄色のハイライト（#ffffcc）で示します。面は角を丸めず、行の幅いっぱいに塗ります。

行の間には、行の幅いっぱいに1px #ececec の罫線を引いて区切ります。行の左右に余白はありません。配置先の幅が28rem以上なら `end` を右の列に置き、狭ければ説明の下に並べます。長い題名やURLも省略せずに折り返します。

JavaScriptは使いません。

## アクセシビリティ

- ルートは `ul`、各行は `li` です。一覧の名前は `aria-label` などで利用側が付けます。
- `current` の行のリンクには `aria-current="true"` を付けます。リンクの無い行では背景色だけで示すので、必要なら文言を添えます。
- 行ごとのフォーカス先は題名のリンクです。`end` に置いた操作は、それぞれ別のフォーカス先になります。

## API

### DataList

| 名前            | 型                        | 既定値 | 説明                               |
| --------------- | ------------------------- | ------ | ---------------------------------- |
| `items`（必須） | `readonly DataListItem[]` |        | 並べる行。順序はそのまま表示する。 |

ほかに、`<ul>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/data-list.css`

#### `DataListItem`

一覧の一行。

| 名前            | 型        | 既定値 | 説明                                                                                                                                         |
| --------------- | --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`（必須） | `string`  |        | 行の題名。本文の大きさの太字で書く。                                                                                                         |
| `description`   | `string`  |        | 題名に「 - 」で続けて同じ行に添える、灰色の抜粋。                                                                                            |
| `href`          | `string`  |        | 渡すと題名をリンクにし、行全体を押せる範囲にする。渡さなければ押せない行になる。                                                             |
| `start`         | `Child`   |        | 行の先頭に置くアイコンやAvatar。行の上端にそろえる。                                                                                         |
| `meta`          | `Child`   |        | 題名の下に茶色の小さな文字で添える補足（担当者や更新日など）。                                                                               |
| `end`           | `Child`   |        | 行の末尾に置く状態や操作（Badge・Button・数など）。リンクの行でも上に重ねて押せる。広い幅では右の列、狭い幅では説明の下に積む。0も表示する。 |
| `current`       | `boolean` |        | 今開いている行。黄色のハイライトで示し、リンクにaria-current="true"を付ける。                                                                |

## コード

```tsx
import {
  DataList,
  Avatar,
  Badge,
  Button,
  Icon,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack">
    <DataList
      aria-label="担当者の一覧"
      items={[
        {
          title: "森 美咲",
          href: "/apps/docs",
          start: <Avatar name="森 美咲" initials="美" tone="green" />,
          description: "mori@example.com",
          end: <Badge tone="info">編集</Badge>,
          current: true,
        },
        {
          title: "佐藤 健",
          href: "/apps/docs",
          start: <Avatar name="佐藤 健" initials="健" />,
          description: "sato@example.com",
        },
        {
          title: "株式会社とても長い名前の制作会社・海外事業部の山田さん",
          href: "/apps/docs",
          start: <Avatar name="山田" initials="山" tone="coral" />,
          description: "yamada-overseas-department@example-production-company.co.jp",
          end: "9月12日",
        },
      ]}
    />
    <DisclosureGroup label="内容と置き場所の違い">
      <Disclosure summary="記事の一覧（状態と操作）">
        <DataList
          aria-label="記事の一覧"
          items={[
            {
              title: "暮らしの記録",
              href: "/apps/docs",
              description: "季節の移り変わりを、写真と文章で記録しています。",
              meta: "田中 遥 · 9月15日更新",
              end: <Badge tone="success">公開中</Badge>,
            },
            {
              title:
                "初めての予約から当日の受付まで、仕事場を利用する方への詳しいご案内",
              href: "/apps/docs",
              description: "利用方法と料金、キャンセルの条件をまとめています。",
              end: (
                <>
                  <Badge tone="info">確認待ち</Badge>
                  <Button disabled>公開する</Button>
                </>
              ),
            },
            {
              title: "今月の問い合わせ",
              description: "回答を待っている問い合わせの件数です。",
              end: 0,
            },
            {
              title: "まだ公開されていない記事",
              description: "内容を準備しています。",
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="アイコン付きの一覧">
        <DataList
          aria-label="資料の一覧"
          items={[
            {
              title: "利用規約",
              href: "/apps/docs",
              start: <Icon name="file" fill />,
              description: "PDF · 2.4 MB",
            },
            {
              title: "予約の受付",
              href: "/apps/docs",
              start: <Icon name="calendar" fill />,
              description: "毎日 9:00〜18:00",
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div style="max-inline-size: 18rem">
          <DataList
            aria-label="狭い場所の一覧"
            items={[
              {
                title: "初めての予約から当日の受付までのご案内",
                href: "/apps/docs",
                start: <Avatar name="田中 遥" initials="田" tone="amber" />,
                description: "https://example.com/articles/autumn-reading-club-2026",
                end: <Badge tone="warning">期限間近</Badge>,
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <DataList
            aria-label="قائمة"
            items={[
              {
                title: "ليلى",
                href: "/apps/docs",
                start: <Avatar name="ليلى" initials="ل" tone="coral" />,
                description: "layla@example.com",
                end: <Badge tone="info">محرر</Badge>,
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
  <ul aria-label="担当者の一覧" class="rx-data-list">
    <li data-current="true">
      <div class="start">
        <span
          class="rx-avatar"
          data-size="default"
          data-tone="green"
          role="img"
          aria-label="森 美咲"
          ><span class="initials">美</span></span
        >
      </div>
      <div class="body">
        <a class="title" href="/apps/docs" aria-current="true">森 美咲</a>
        <p class="description">mori@example.com</p>
      </div>
      <div class="end"><span class="rx-badge" data-tone="info">編集</span></div>
    </li>
    <li>
      <div class="start">
        <span
          class="rx-avatar"
          data-size="default"
          data-tone="blue"
          role="img"
          aria-label="佐藤 健"
          ><span class="initials">健</span></span
        >
      </div>
      <div class="body">
        <a class="title" href="/apps/docs">佐藤 健</a>
        <p class="description">sato@example.com</p>
      </div>
    </li>
    <li>
      <div class="start">
        <span
          class="rx-avatar"
          data-size="default"
          data-tone="coral"
          role="img"
          aria-label="山田"
          ><span class="initials">山</span></span
        >
      </div>
      <div class="body">
        <a class="title" href="/apps/docs"
          >株式会社とても長い名前の制作会社・海外事業部の山田さん</a
        >
        <p class="description">
          yamada-overseas-department@example-production-company.co.jp
        </p>
      </div>
      <div class="end">9月12日</div>
    </li>
  </ul>
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
        ><span class="label"><span class="title">記事の一覧（状態と操作）</span></span>
      </summary>
      <div class="body">
        <ul aria-label="記事の一覧" class="rx-data-list">
          <li>
            <div class="body">
              <a class="title" href="/apps/docs">暮らしの記録</a>
              <p class="description">
                季節の移り変わりを、写真と文章で記録しています。
              </p>
              <div class="meta">田中 遥 · 9月15日更新</div>
            </div>
            <div class="end">
              <span class="rx-badge" data-tone="success">公開中</span>
            </div>
          </li>
          <li>
            <div class="body">
              <a class="title" href="/apps/docs"
                >初めての予約から当日の受付まで、仕事場を利用する方への詳しいご案内</a
              >
              <p class="description">
                利用方法と料金、キャンセルの条件をまとめています。
              </p>
            </div>
            <div class="end">
              <span class="rx-badge" data-tone="info">確認待ち</span
              ><button
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="default"
                disabled=""
              >
                公開する
              </button>
            </div>
          </li>
          <li>
            <div class="body">
              <strong class="title">今月の問い合わせ</strong>
              <p class="description">回答を待っている問い合わせの件数です。</p>
            </div>
            <div class="end">0</div>
          </li>
          <li>
            <div class="body">
              <strong class="title">まだ公開されていない記事</strong>
              <p class="description">内容を準備しています。</p>
            </div>
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
        ><span class="label"><span class="title">アイコン付きの一覧</span></span>
      </summary>
      <div class="body">
        <ul aria-label="資料の一覧" class="rx-data-list">
          <li>
            <div class="start">
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-file-fill"></use>
              </svg>
            </div>
            <div class="body">
              <a class="title" href="/apps/docs">利用規約</a>
              <p class="description">PDF · 2.4 MB</p>
            </div>
          </li>
          <li>
            <div class="start">
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar-fill"></use>
              </svg>
            </div>
            <div class="body">
              <a class="title" href="/apps/docs">予約の受付</a>
              <p class="description">毎日 9:00〜18:00</p>
            </div>
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
        <div style="max-inline-size: 18rem">
          <ul aria-label="狭い場所の一覧" class="rx-data-list">
            <li>
              <div class="start">
                <span
                  class="rx-avatar"
                  data-size="default"
                  data-tone="amber"
                  role="img"
                  aria-label="田中 遥"
                  ><span class="initials">田</span></span
                >
              </div>
              <div class="body">
                <a class="title" href="/apps/docs"
                  >初めての予約から当日の受付までのご案内</a
                >
                <p class="description">
                  https://example.com/articles/autumn-reading-club-2026
                </p>
              </div>
              <div class="end">
                <span class="rx-badge" data-tone="warning">期限間近</span>
              </div>
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
          <ul aria-label="قائمة" class="rx-data-list">
            <li>
              <div class="start">
                <span
                  class="rx-avatar"
                  data-size="default"
                  data-tone="coral"
                  role="img"
                  aria-label="ليلى"
                  ><span class="initials">ل</span></span
                >
              </div>
              <div class="body">
                <a class="title" href="/apps/docs">ليلى</a>
                <p class="description">layla@example.com</p>
              </div>
              <div class="end"><span class="rx-badge" data-tone="info">محرر</span></div>
            </li>
          </ul>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
