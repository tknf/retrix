<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# MessageList

差出人・件名・本文の冒頭・時刻を並べた受信の一覧です。

## 使いどころ

- 受信箱や通知の一覧のように、連絡を差出人・件名・書き出し・時刻で並べ、一件を開かせる時に使います。
- 開いた連絡の本文や会話を見せる時は `Message`、連絡ではない一件ずつの物を並べる時は `DataList` を使います。

## 使い方

`items` に `id`・`sender`・`title` と、任意の `href`・`preview`・`time`・`datetime`・`avatar`・`unread` を渡します。行は「件名」と「差出人 – 書き出し」の二段で、時刻と未読の点を末尾側に置き、行の間に行の幅いっぱいの罫線を引きます。件名は青緑の文字に下線を引き（ホバーで赤茶）、書き出しは灰色、時刻は茶色の小さな文字です。`unread` の行は件名と差出人を太字にし、時刻の後ろに青緑の点を置きます。`href` を渡した行はリンクにし、ホバーすると行を淡い黄色で塗ります。省略した行はリンクにしません。

件名と差出人が空の時は「（件名なし）」「差出人不明」を出します。どれかの行に `avatar` があれば全ての行にアバターの列を設け、`avatar` の無い行には淡い灰色の丸に手紙のアイコンを置いて列をそろえます。`threadCount`（2以上）は件名の後ろに淡い青のピルで、`attachments`（1以上）は灰色の小さな数で添えます。

行ごとの `state` は件名の前に共通の `Badge` で示します。`draft` は「下書き」、`sending` は「送信中」で行全体を少し控えめにし、`failed` は赤茶の「送信失敗」です。`unavailableReason` を渡すと `state` より優先して「閲覧不可」のバッジを出し、書き出しの位置に理由を出して、件名と差出人を淡くします。`current` の行は淡い青緑の面で示します。面は角を丸めず、行の幅いっぱいに塗ります。

`previewLines` は、`1` で差出人と書き出しを一行に並べて省略し、`2` で差出人の下に書き出しを二行まで折り返します。`newSince` に行の `id` を渡すと、その行の直前に青緑の区切りの線とラベル（既定は「ここから新着」）を置きます。

一覧全体の `state` は `ready`・`loading`・`error` です。`loading` と `error` では行を出さず、一覧の場所に状態の文を出します（`loading` は行の形の斜線を流します）。`ready` で `items` が0件の時は `empty` を `EmptyState` で出します。0件の表示は、行を後から DOM へ追加すると隠れ、全て消すと再び現れます。

幅が30rem未満では時刻を件名の行に置き、件名を二行まで折り返します。16rem未満ではアバター・件名・書き出し・時刻を縦に積みます。

既読・送信・削除などのデータ処理と、開いた行の `current` の切り替えは利用側が持ちます。controllerを持たないので、JavaScriptなしでも行のリンクで開けます。

## アクセシビリティ

- ルートは `label` を名前に持つ `ul` です。行のリンクは件名・差出人・書き出し・時刻をまとめて読み上げます。
- `current` の行のリンクには `aria-current="page"` を付けます。未読は読み上げ用の「未読」を添え、会話の件数と添付の数は、見える数を読み上げから外し、「4件の会話」「添付ファイル2件」の文を読み上げ用に添えます。
- 差出人のアバターは読み上げから外します。状態の文と0件の表示は一覧の項目の中の `role="status"` で、`loading` では `aria-busy="true"` を付けます。
- `newSince` の区切りは一覧の一項目で、ラベル（既定は「ここから新着」）を読み上げます。一覧の直下の `li` には項目以外の役割を付けません。

## API

### MessageList

| 名前            | 型                                                                        | 既定値                              | 説明                                                                                                                               |
| --------------- | ------------------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須） | `string`                                                                  |                                     | 一覧の名前。ulのaria-labelに入れる。                                                                                               |
| `items`（必須） | `readonly MessageListItem[]`                                              |                                     | 並べる連絡。並び順と絞り込みは利用側で決める。                                                                                     |
| `state`         | `"ready" \| "loading" \| "error"`                                         | `"ready"`                           | 一覧全体の状態。loadingとerrorでは行を出さず、一覧の場所に状態の文を出す。loadingではaria-busyを付ける。                           |
| `stateContent`  | `Child`                                                                   |                                     | 状態の文の代わりに出す内容。readyでは0件の時の表示（empty）の代わりになる。                                                        |
| `previewLines`  | `1 \| 2`                                                                  | `1`                                 | 書き出しの行数。1は差出人と書き出しを一行に並べ、2は差出人の下で書き出しを二行まで折り返す。                                       |
| `newSince`      | `{ id: string; label?: string; }`                                         |                                     | この項目の直前に区切りの線とラベルを置き、ここから新しいことを示す。                                                               |
| `empty`         | `{ title: string; description?: Child; kind?: EmptyStateProps["kind"]; }` | `{ title: "連絡はまだありません" }` | 連絡が一件もない時の表示。EmptyStateで描く。行を後から出し入れしても、行が一つもない時だけ見える。既定は「連絡はまだありません」。 |

ほかに、`<ul>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/message-list.css`、`components/badge.css`、`components/empty-state.css`、`components/icon.css`、`components/divider.css`

#### `newSince`の項目

| 名前         | 型       | 既定値 | 説明                                                                                         |
| ------------ | -------- | ------ | -------------------------------------------------------------------------------------------- |
| `id`（必須） | `string` |        | 区切りを置く項目のid。この項目の直前に線とラベルを置く。一致する項目が無ければ何も置かない。 |
| `label`      | `string` |        | 区切りのラベル。既定は「ここから新着」。                                                     |

#### `empty`の項目

| 名前            | 型                        | 既定値 | 説明                                               |
| --------------- | ------------------------- | ------ | -------------------------------------------------- |
| `title`（必須） | `string`                  |        | 空の時の題名。                                     |
| `description`   | `Child`                   |        | 題名の下に添える説明。                             |
| `kind`          | `EmptyStateProps["kind"]` |        | EmptyStateの場面（`empty`・`start`・`complete`）。 |

#### `MessageListItem`

| 名前                | 型                                 | 既定値 | 説明                                                                                                                   |
| ------------------- | ---------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| `id`（必須）        | `string`                           |        | 連絡を識別する値。行のdata-message-idに入れ、newSinceの位置合わせにも使う。                                            |
| `sender`（必須）    | `string`                           |        | 差出人の名前。空白だけの時は「差出人不明」と出す。                                                                     |
| `title`（必須）     | `string`                           |        | 件名。空白だけの時は「（件名なし）」と出す。一行に収まらない分は省略する（幅が30rem未満では二行まで折り返す）。        |
| `preview`           | `string`                           |        | 本文の書き出し。差出人の後ろに続け、previewLinesの行数に収まらない分は省略する。                                       |
| `href`              | `string`                           |        | 行を開く移動先。省略すると行はリンクにならない。                                                                       |
| `time`              | `string`                           |        | 行の末尾に出す時刻の文字。書式は利用側で決める。                                                                       |
| `datetime`          | `string`                           |        | timeに対応する機械可読の日時。日時として読める値の時だけtime要素にする。                                               |
| `avatar`            | `Child`                            |        | 差出人のアバター（Avatarなど）。一覧のどれかの行に渡すと全ての行にアバターの列を設け、無い行には手紙のアイコンを置く。 |
| `unread`            | `boolean`                          |        | 未読。件名と差出人を太字にし、時刻の後ろに青い点と読み上げ用の「未読」を添える。                                       |
| `current`           | `boolean`                          |        | 今開いている連絡。行を淡い青の背景にし、aria-current="page"を付ける。                                                  |
| `threadCount`       | `number`                           |        | 会話の件数。2以上の時だけ件名の後ろに数を出す。                                                                        |
| `attachments`       | `number`                           |        | 添付ファイルの数。1以上の時だけ件名の後ろにファイルのアイコンと数を出す。                                              |
| `state`             | `"draft" \| "sending" \| "failed"` |        | 送信の状態。件名の前にバッジを置く（draftは「下書き」、sendingは「送信中」で行を控えめに、failedは赤い「送信失敗」）。 |
| `unavailableReason` | `string`                           |        | 閲覧できない理由。指定するとstateより優先して「閲覧不可」のバッジを出し、書き出しの位置に理由を出す。                  |

#### `EmptyStateProps`

[EmptyState](empty-state.md)のpropsと同じです。

## コード

```tsx
import { MessageList, Avatar, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack">
    <MessageList
      label="受信した連絡"
      newSince={{ id: "sample-categories" }}
      items={[
        {
          id: "sample-categories",
          sender: "森 美咲",
          title: "カテゴリ案をまとめました",
          preview: "5つのカテゴリに整理しました。実際の記事を入れて試してみませんか。",
          href: "/apps/inbox/categories",
          time: "10:24",
          datetime: "2026-09-15T10:24:00+09:00",
          unread: true,
          threadCount: 4,
          attachments: 2,
          avatar: <Avatar name="森 美咲" initials="美" tone="green" />,
        },
        {
          id: "sample-meeting",
          sender: "佐藤 健",
          title: "来週の打ち合わせについて",
          preview: "火曜日14時からはいかがでしょうか。",
          href: "/apps/inbox/meeting",
          time: "9:42",
          datetime: "2026-09-15T09:42:00+09:00",
          avatar: <Avatar name="佐藤 健" initials="健" tone="blue" />,
        },
      ]}
    />
    <DisclosureGroup label="内容と状態の違い">
      <Disclosure summary="長文・欠損・添付のみ・画像の有無が混在" open>
        <MessageList
          label="長い内容と不足する情報"
          items={[
            {
              id: "long-message",
              sender: "株式会社とても長い名前の制作会社・海外事業部／山田",
              title:
                "Re: Re: 来年度の共同プロジェクトについて、担当窓口と申請時に必要な資料をまとめました",
              preview:
                "https://example.com/documents/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789",
              href: "/apps/inbox/categories",
              time: "9月15日 10:24",
              datetime: "2026-09-15T10:24:00+09:00",
              threadCount: 128,
              unread: true,
              avatar: <Avatar name="山田" initials="山" />,
            },
            {
              id: "no-subject",
              sender: "",
              title: "",
              href: "/apps/inbox/meeting",
              attachments: 12,
              time: "昨日",
            },
            {
              id: "attachment-only",
              sender: "資料窓口",
              title: "確認用の添付資料",
              href: "/apps/inbox/categories",
              attachments: 1,
              time: "9月12日",
            },
            {
              id: "unicode",
              sender: "ليلى / Léa / 🙂",
              title: "確認してください 👩‍💻 Meeting at 東京",
              preview: "本文の日本語・English・العربيةが混在します。",
              href: "/apps/inbox/meeting",
              time: "9月11日",
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="下書き・送信中・送信失敗・閲覧できない項目">
        <MessageList
          label="送信と閲覧の状態"
          items={[
            {
              id: "draft",
              sender: "自分",
              title: "来週の打ち合わせ",
              state: "draft",
              href: "/apps/inbox/meeting",
              preview: "途中まで書いた内容です。",
            },
            {
              id: "sending",
              sender: "自分",
              title: "資料を送ります",
              state: "sending",
              href: "/apps/inbox/categories",
              attachments: 2,
            },
            {
              id: "failed",
              sender: "自分",
              title: "請求内容の確認",
              state: "failed",
              href: "/apps/inbox/categories",
              preview: "本文は保存されています。",
              current: true,
            },
            {
              id: "unavailable",
              sender: "担当者",
              title: "共有が終了した連絡",
              unavailableReason: "この連絡を閲覧する権限がありません。",
              time: "9月10日",
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="0件・読み込み中・読み込み失敗">
        <MessageList label="0件の受信一覧" items={[]} />
        <MessageList label="読み込み中の受信一覧" items={[]} state="loading" />
        <MessageList
          label="読み込み失敗の受信一覧"
          items={[]}
          state="error"
          stateContent={
            <p>連絡を読み込めませんでした。ページを再読み込みしてください。</p>
          }
        />
      </Disclosure>
    </DisclosureGroup>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <ul
    class="rx-message-list"
    aria-label="受信した連絡"
    data-state="ready"
    data-avatars="true"
    data-preview-lines="1"
  >
    <li class="state" data-empty="true">
      <div role="status">
        <section class="rx-empty-state" data-kind="empty">
          <div class="slip">
            <h3 class="title">連絡はまだありません</h3>
            <div class="body"></div>
          </div>
        </section>
      </div>
    </li>
    <li class="divider">
      <div class="rx-divider"><span>ここから新着</span></div>
    </li>
    <li data-message-id="sample-categories" data-unread="true">
      <a class="row" href="/apps/inbox/categories"
        ><span class="avatar" aria-hidden="true"
          ><span
            class="rx-avatar"
            data-size="default"
            data-tone="green"
            role="img"
            aria-label="森 美咲"
            ><span class="initials">美</span></span
          ></span
        ><span class="body"
          ><strong class="title"
            ><span class="subject">カテゴリ案をまとめました</span
            ><span class="count"
              ><span aria-hidden="true">4</span
              ><span class="rx-visually-hidden">4件の会話</span></span
            ><span class="attachment"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-file"></use></svg
              ><span aria-hidden="true">2</span
              ><span class="rx-visually-hidden">添付ファイル2件</span></span
            ></strong
          ><span class="summary"
            ><span class="sender">森 美咲</span
            ><span class="preview"
              >5つのカテゴリに整理しました。実際の記事を入れて試してみませんか。</span
            ></span
          ></span
        ><span class="meta"
          ><time datetime="2026-09-15T10:24:00+09:00">10:24</time
          ><span class="unread"
            ><span class="rx-visually-hidden">未読</span></span
          ></span
        ></a
      >
    </li>
    <li data-message-id="sample-meeting" data-unread="false">
      <a class="row" href="/apps/inbox/meeting"
        ><span class="avatar" aria-hidden="true"
          ><span
            class="rx-avatar"
            data-size="default"
            data-tone="blue"
            role="img"
            aria-label="佐藤 健"
            ><span class="initials">健</span></span
          ></span
        ><span class="body"
          ><strong class="title"
            ><span class="subject">来週の打ち合わせについて</span></strong
          ><span class="summary"
            ><span class="sender">佐藤 健</span
            ><span class="preview">火曜日14時からはいかがでしょうか。</span></span
          ></span
        ><span class="meta"
          ><time datetime="2026-09-15T09:42:00+09:00">9:42</time
          ><span class="unread" hidden=""
            ><span class="rx-visually-hidden">未読</span></span
          ></span
        ></a
      >
    </li>
  </ul>
  <div class="rx-disclosure-group" role="group" aria-label="内容と状態の違い">
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
        ><span class="label"
          ><span class="title">長文・欠損・添付のみ・画像の有無が混在</span></span
        >
      </summary>
      <div class="body">
        <ul
          class="rx-message-list"
          aria-label="長い内容と不足する情報"
          data-state="ready"
          data-avatars="true"
          data-preview-lines="1"
        >
          <li class="state" data-empty="true">
            <div role="status">
              <section class="rx-empty-state" data-kind="empty">
                <div class="slip">
                  <h3 class="title">連絡はまだありません</h3>
                  <div class="body"></div>
                </div>
              </section>
            </div>
          </li>
          <li data-message-id="long-message" data-unread="true">
            <a class="row" href="/apps/inbox/categories"
              ><span class="avatar" aria-hidden="true"
                ><span
                  class="rx-avatar"
                  data-size="default"
                  data-tone="blue"
                  role="img"
                  aria-label="山田"
                  ><span class="initials">山</span></span
                ></span
              ><span class="body"
                ><strong class="title"
                  ><span class="subject"
                    >Re: Re:
                    来年度の共同プロジェクトについて、担当窓口と申請時に必要な資料をまとめました</span
                  ><span class="count"
                    ><span aria-hidden="true">128</span
                    ><span class="rx-visually-hidden">128件の会話</span></span
                  ></strong
                ><span class="summary"
                  ><span class="sender"
                    >株式会社とても長い名前の制作会社・海外事業部／山田</span
                  ><span class="preview"
                    >https://example.com/documents/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789</span
                  ></span
                ></span
              ><span class="meta"
                ><time datetime="2026-09-15T10:24:00+09:00">9月15日 10:24</time
                ><span class="unread"
                  ><span class="rx-visually-hidden">未読</span></span
                ></span
              ></a
            >
          </li>
          <li data-message-id="no-subject" data-unread="false">
            <a class="row" href="/apps/inbox/meeting"
              ><span class="avatar" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-mail"></use></svg></span
              ><span class="body"
                ><strong class="title"
                  ><span class="subject">（件名なし）</span
                  ><span class="attachment"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-file"></use></svg
                    ><span aria-hidden="true">12</span
                    ><span class="rx-visually-hidden">添付ファイル12件</span></span
                  ></strong
                ><span class="summary"
                  ><span class="sender">差出人不明</span></span
                ></span
              ><span class="meta"
                ><span>昨日</span
                ><span class="unread" hidden=""
                  ><span class="rx-visually-hidden">未読</span></span
                ></span
              ></a
            >
          </li>
          <li data-message-id="attachment-only" data-unread="false">
            <a class="row" href="/apps/inbox/categories"
              ><span class="avatar" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-mail"></use></svg></span
              ><span class="body"
                ><strong class="title"
                  ><span class="subject">確認用の添付資料</span
                  ><span class="attachment"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-file"></use></svg
                    ><span aria-hidden="true">1</span
                    ><span class="rx-visually-hidden">添付ファイル1件</span></span
                  ></strong
                ><span class="summary"><span class="sender">資料窓口</span></span></span
              ><span class="meta"
                ><span>9月12日</span
                ><span class="unread" hidden=""
                  ><span class="rx-visually-hidden">未読</span></span
                ></span
              ></a
            >
          </li>
          <li data-message-id="unicode" data-unread="false">
            <a class="row" href="/apps/inbox/meeting"
              ><span class="avatar" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-mail"></use></svg></span
              ><span class="body"
                ><strong class="title"
                  ><span class="subject"
                    >確認してください 👩‍💻 Meeting at 東京</span
                  ></strong
                ><span class="summary"
                  ><span class="sender">ليلى / Léa / 🙂</span
                  ><span class="preview"
                    >本文の日本語・English・العربيةが混在します。</span
                  ></span
                ></span
              ><span class="meta"
                ><span>9月11日</span
                ><span class="unread" hidden=""
                  ><span class="rx-visually-hidden">未読</span></span
                ></span
              ></a
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
        ><span class="label"
          ><span class="title">下書き・送信中・送信失敗・閲覧できない項目</span></span
        >
      </summary>
      <div class="body">
        <ul
          class="rx-message-list"
          aria-label="送信と閲覧の状態"
          data-state="ready"
          data-avatars="false"
          data-preview-lines="1"
        >
          <li class="state" data-empty="true">
            <div role="status">
              <section class="rx-empty-state" data-kind="empty">
                <div class="slip">
                  <h3 class="title">連絡はまだありません</h3>
                  <div class="body"></div>
                </div>
              </section>
            </div>
          </li>
          <li data-message-id="draft" data-unread="false" data-state="draft">
            <a class="row" href="/apps/inbox/meeting"
              ><span class="body"
                ><strong class="title"
                  ><span class="rx-badge state" data-tone="neutral" data-draft="true"
                    >下書き</span
                  ><span class="subject">来週の打ち合わせ</span></strong
                ><span class="summary"
                  ><span class="sender">自分</span
                  ><span class="preview">途中まで書いた内容です。</span></span
                ></span
              ><span class="meta"
                ><span class="unread" hidden=""
                  ><span class="rx-visually-hidden">未読</span></span
                ></span
              ></a
            >
          </li>
          <li data-message-id="sending" data-unread="false" data-state="sending">
            <a class="row" href="/apps/inbox/categories"
              ><span class="body"
                ><strong class="title"
                  ><span class="rx-badge state" data-tone="neutral">送信中</span
                  ><span class="subject">資料を送ります</span
                  ><span class="attachment"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-file"></use></svg
                    ><span aria-hidden="true">2</span
                    ><span class="rx-visually-hidden">添付ファイル2件</span></span
                  ></strong
                ><span class="summary"><span class="sender">自分</span></span></span
              ><span class="meta"
                ><span class="unread" hidden=""
                  ><span class="rx-visually-hidden">未読</span></span
                ></span
              ></a
            >
          </li>
          <li
            data-message-id="failed"
            data-unread="false"
            data-current="true"
            data-state="failed"
          >
            <a class="row" href="/apps/inbox/categories" aria-current="page"
              ><span class="body"
                ><strong class="title"
                  ><span class="rx-badge state" data-tone="danger">送信失敗</span
                  ><span class="subject">請求内容の確認</span></strong
                ><span class="summary"
                  ><span class="sender">自分</span
                  ><span class="preview">本文は保存されています。</span></span
                ></span
              ><span class="meta"
                ><span class="unread" hidden=""
                  ><span class="rx-visually-hidden">未読</span></span
                ></span
              ></a
            >
          </li>
          <li data-message-id="unavailable" data-unread="false" data-unavailable="true">
            <div class="row">
              <span class="body"
                ><strong class="title"
                  ><span class="rx-badge state" data-tone="neutral">閲覧不可</span
                  ><span class="subject">共有が終了した連絡</span></strong
                ><span class="summary"
                  ><span class="sender">担当者</span
                  ><span class="preview"
                    >この連絡を閲覧する権限がありません。</span
                  ></span
                ></span
              ><span class="meta"
                ><span>9月10日</span
                ><span class="unread" hidden=""
                  ><span class="rx-visually-hidden">未読</span></span
                ></span
              >
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
        ><span class="label"
          ><span class="title">0件・読み込み中・読み込み失敗</span></span
        >
      </summary>
      <div class="body">
        <ul
          class="rx-message-list"
          aria-label="0件の受信一覧"
          data-state="empty"
          data-avatars="false"
          data-preview-lines="1"
        >
          <li class="state" data-empty="true">
            <div role="status">
              <section class="rx-empty-state" data-kind="empty">
                <div class="slip">
                  <h3 class="title">連絡はまだありません</h3>
                  <div class="body"></div>
                </div>
              </section>
            </div>
          </li>
        </ul>
        <ul
          class="rx-message-list"
          aria-label="読み込み中の受信一覧"
          aria-busy="true"
          data-state="loading"
          data-avatars="false"
          data-preview-lines="1"
        >
          <li class="state"><div role="status">連絡を読み込んでいます…</div></li>
        </ul>
        <ul
          class="rx-message-list"
          aria-label="読み込み失敗の受信一覧"
          data-state="error"
          data-avatars="false"
          data-preview-lines="1"
        >
          <li class="state">
            <div role="status">
              <p>連絡を読み込めませんでした。ページを再読み込みしてください。</p>
            </div>
          </li>
        </ul>
      </div>
    </details>
  </div>
</div>
```

</details>
