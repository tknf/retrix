<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Message

投稿者・時刻・本文を、決まった順序で表示します。

## 使いどころ

- コメント・チャット・メールのスレッドのように、誰がいつ何を書いたかを一件ずつ見せる時に使います。
- 受信した連絡を件名とプレビューで並べて選ばせる時は `MessageList`、出来事を時刻の順に並べる時は `Timeline` を使います。
- 入力欄は `Composer` を組み合わせます。

## 使い方

`author`・`time`・`datetime` を渡し、本文を `children` に書きます。見出しの行は名前、時刻（`time` 要素）の順です。`avatar` は名前の行の横の2remの列に置き、`conversation` では本文・操作・返信をその列の後ろから書きます。

既定の `layout="conversation"` は、本文をアバター側の上の角だけを立てた淡い吹き出しにし、吹き出しを文の長さに合わせて縮めます。幅は48remまでです。`layout="document"` は一通を一枚のカードにし、日付を見出しの行の終わりに寄せ、本文を1rem・行高1.75でカードの幅いっぱいに読ませます。`document` の `Message` を続けて置くと、カードを少し重ねて積みます。

`actions` は本文の下に、`replies` はさらにその下に置きます。`replies` には返信の `Message` を並べ、親と返信の両方に `avatar` がある時はアバターから下ろした線でつなぎます。

幅が20rem未満の `Message` では、アバターを名前の行の横だけに置き、本文と操作をアバターの下から全幅で表示します。本文の長い URL は吹き出しの幅で折り返します。

送信・既読・返信・リアクションのデータと保存は利用側が持ちます。controllerを持たないので、JavaScriptなしでも同じように表示されます。

## アクセシビリティ

- ルートは `article` で、名前は `strong`、時刻は `datetime` 付きの `time` 要素です。
- `avatar` は読み上げから外します（名前は `author` で読むため）。アバターに名前以外の意味を持たせないでください。
- `actions` のボタンには、どの投稿への操作か分かる名前を付けてください。同じ文言のボタンが並ぶ時は `aria-label` で投稿者などを補います。

## API

### Message

| 名前               | 型                             | 既定値           | 説明                                                                                                                                                                              |
| ------------------ | ------------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `author`（必須）   | `string`                       |                  | 投稿者の名前。見出しの行に太字で置く。                                                                                                                                            |
| `layout`           | `"conversation" \| "document"` | `"conversation"` | 見せ方。conversationは本文を淡い吹き出しにし、documentは一通を一枚のカードにして日付を見出しの行の末尾に寄せる。 documentを続けて置くと、カードを少し重ねてひとまとまりに見せる。 |
| `avatar`           | `Child`                        |                  | 投稿者のアバター（Avatarなど）。名前の行の横に置き、読み上げからは外す（名前はauthorで読む）。                                                                                    |
| `time`（必須）     | `string`                       |                  | 見出しの行に出す時刻の文字。書式は利用側で決める。                                                                                                                                |
| `datetime`（必須） | `string`                       |                  | timeに対応する機械可読の日時。time要素のdatetime属性に入れる。                                                                                                                    |
| `actions`          | `Child`                        |                  | 本文の下に並べる操作（返信・リンクのコピーなど）。footerとして描く。                                                                                                              |
| `replies`          | `Child`                        |                  | 返信のMessage。本文の下に積み、avatarがある時はアバターから下ろした線でつなぐ。                                                                                                   |
| `children`         | `Child`                        |                  | 本文。段落・FileItemなど任意のHTMLを渡せる。conversationでは吹き出しに、documentではカードの全幅に入れる。                                                                        |

ほかに、`<article>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/message.css`

## コード

```tsx
import {
  Message,
  Avatar,
  AvatarGroup,
  Tag,
  TagGroup,
  Button,
  ActionLink,
  FileItem,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

const mori = <Avatar name="森 美咲" initials="美" tone="green" size="small" />;
const sato = <Avatar name="佐藤 健" initials="健" size="small" />;
const tanaka = <Avatar name="田中 遥" initials="田" tone="amber" size="small" />;

export default () => (
  <div class="rx-stack">
    <div>
      <Message
        author="森 美咲"
        time="今日 10:24"
        datetime="2026-09-15T10:24:00+09:00"
        avatar={mori}
      >
        <p>
          記事のカテゴリを5つにまとめました。まずはこの形で、実際に探しやすいか試してみたいです。
        </p>
      </Message>
      <Message
        author="佐藤 健"
        time="今日 10:31"
        datetime="2026-09-15T10:31:00+09:00"
        avatar={sato}
        actions={
          <>
            <Button size="compact">返信する</Button>
            <Button size="compact" variant="link">
              リンクをコピー
            </Button>
          </>
        }
      >
        <p>いいと思います。</p>
      </Message>
    </div>
    <DisclosureGroup label="会話の形と文書の形">
      <Disclosure summary="返信をまとめる">
        <Message
          author="田中 遥"
          time="9月14日 16:02"
          datetime="2026-09-14T16:02:00+09:00"
          avatar={tanaka}
          replies={
            <>
              <Message
                author="森 美咲"
                time="9月14日 16:10"
                datetime="2026-09-14T16:10:00+09:00"
                avatar={mori}
              >
                <p>18時からで大丈夫です。</p>
              </Message>
              <Message
                author="佐藤 健"
                time="9月14日 16:25"
                datetime="2026-09-14T16:25:00+09:00"
                avatar={sato}
              >
                <p>少し遅れて参加します。資料は先に共有しておきます。</p>
              </Message>
            </>
          }
        >
          <p>読書会の開始時間を18時に変えてもよいですか。</p>
        </Message>
      </Disclosure>
      <Disclosure summary="アバターなし・複数段落・添付">
        <div>
          <Message
            author="予約の受付"
            time="9月13日 9:00"
            datetime="2026-09-13T09:00:00+09:00"
          >
            <p>中会議室の予約を受け付けました。</p>
          </Message>
          <Message
            author="森 美咲"
            time="9月13日 9:12"
            datetime="2026-09-13T09:12:00+09:00"
            avatar={mori}
          >
            <p>当日の進め方をまとめました。</p>
            <p>最初の10分で近況を話し、そのあと一人ずつ本を紹介します。</p>
            <FileItem
              name="当日の進め方.pdf"
              description="PDF · 120 KB"
              href="/apps/files"
            />
          </Message>
        </div>
      </Disclosure>
      <Disclosure summary="メールのスレッドをカードを重ねて表示する">
        <div class="rx-stack">
          <div class="rx-cluster">
            <AvatarGroup label="森 美咲、佐藤 健" size="small">
              {mori}
              {sato}
            </AvatarGroup>
            <TagGroup label="ラベル">
              <Tag label="読書会" accent="blue" />
            </TagGroup>
          </div>
          <h3>来週の打ち合わせについて</h3>
          <div>
            <Message
              layout="document"
              author="森 美咲"
              time="9月15日"
              datetime="2026-09-15T09:00:00+09:00"
              avatar={mori}
            >
              <p>
                来週の打ち合わせの資料を共有します。事前に目を通しておいてください。
              </p>
              <FileItem
                name="料金表-2026年秋.pdf"
                description="PDF · 47.7 KB"
                href="/apps/files"
                preview={
                  <svg viewBox="0 0 40 40" role="img" aria-label="料金表の1ページ目">
                    <rect width="40" height="40" fill="#ffffff" />
                    <rect x="6" y="7" width="14" height="2" fill="#243946" />
                    <rect x="6" y="13" width="28" height="1" fill="#b7c4cc" />
                    <rect x="6" y="17" width="28" height="1" fill="#b7c4cc" />
                    <rect x="6" y="21" width="20" height="1" fill="#b7c4cc" />
                  </svg>
                }
              />
            </Message>
            <Message
              layout="document"
              author="佐藤 健"
              time="9月15日"
              datetime="2026-09-15T11:20:00+09:00"
              avatar={sato}
            >
              <p>ありがとうございます。料金の表だけ、先に確認しておきます。</p>
            </Message>
            <Message
              layout="document"
              author="森 美咲"
              time="9月16日"
              datetime="2026-09-16T08:45:00+09:00"
              avatar={mori}
              actions={
                <>
                  <Button size="compact">返信する</Button>
                  <Button size="compact">後で返信</Button>
                </>
              }
            >
              <p>助かります。気になる点があれば、この返信にまとめてください。</p>
              <p>当日は14時から、2階の小部屋で始めます。</p>
            </Message>
          </div>
        </div>
      </Disclosure>
      <Disclosure summary="長い名前・長い本文">
        <div class="rx-stack">
          <Message
            author="株式会社とても長い名前の制作会社・海外事業部／山田"
            time="9月12日 18:40"
            datetime="2026-09-12T18:40:00+09:00"
            avatar={<Avatar name="山田" initials="山" tone="coral" size="small" />}
          >
            <p>
              https://example.com/documents/abcdefghijklmnopqrstuvwxyz0123456789
              に資料を置きました。確認の際は、共有設定が「組織内」になっていることもあわせて確かめてください。
            </p>
          </Message>
          <Message
            layout="document"
            author="株式会社とても長い名前の制作会社・海外事業部／山田"
            time="9月12日"
            datetime="2026-09-12T18:40:00+09:00"
            avatar={<Avatar name="山田" initials="山" tone="coral" size="small" />}
            actions={<ActionLink href="/apps/docs">元のメールを開く</ActionLink>}
          >
            <p>
              https://example.com/documents/abcdefghijklmnopqrstuvwxyz0123456789
              に資料を置きました。共有設定が「組織内」になっていることもあわせて確かめてください。
            </p>
          </Message>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Message
            author="ليلى"
            time="اليوم ١٠:٢٤"
            datetime="2026-09-15T10:24:00+09:00"
            avatar={<Avatar name="ليلى" initials="ل" tone="coral" size="small" />}
          >
            <p>أحضر كتابًا قرأته مؤخرًا وشارك انطباعاتك.</p>
          </Message>
          <Message
            layout="document"
            author="عمر"
            time="١٥ سبتمبر"
            datetime="2026-09-15T11:20:00+09:00"
            avatar={<Avatar name="عمر" initials="ع" size="small" />}
          >
            <p>شكرًا، سأراجع الجدول قبل الاجتماع.</p>
          </Message>
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
  <div>
    <article class="rx-message" data-layout="conversation">
      <div class="avatar" aria-hidden="true">
        <span
          class="rx-avatar"
          data-size="small"
          data-tone="green"
          role="img"
          aria-label="森 美咲"
          ><span class="initials">美</span></span
        >
      </div>
      <header class="heading">
        <strong>森 美咲</strong
        ><time datetime="2026-09-15T10:24:00+09:00">今日 10:24</time>
      </header>
      <div class="body">
        <p>
          記事のカテゴリを5つにまとめました。まずはこの形で、実際に探しやすいか試してみたいです。
        </p>
      </div>
    </article>
    <article class="rx-message" data-layout="conversation">
      <div class="avatar" aria-hidden="true">
        <span
          class="rx-avatar"
          data-size="small"
          data-tone="blue"
          role="img"
          aria-label="佐藤 健"
          ><span class="initials">健</span></span
        >
      </div>
      <header class="heading">
        <strong>佐藤 健</strong
        ><time datetime="2026-09-15T10:31:00+09:00">今日 10:31</time>
      </header>
      <div class="body"><p>いいと思います。</p></div>
      <footer class="actions">
        <button
          class="rx-button"
          type="button"
          data-variant="secondary"
          data-size="compact"
        >
          返信する</button
        ><button
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          リンクをコピー
        </button>
      </footer>
    </article>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="会話の形と文書の形">
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
        ><span class="label"><span class="title">返信をまとめる</span></span>
      </summary>
      <div class="body">
        <article class="rx-message" data-layout="conversation">
          <div class="avatar" aria-hidden="true">
            <span
              class="rx-avatar"
              data-size="small"
              data-tone="amber"
              role="img"
              aria-label="田中 遥"
              ><span class="initials">田</span></span
            >
          </div>
          <header class="heading">
            <strong>田中 遥</strong
            ><time datetime="2026-09-14T16:02:00+09:00">9月14日 16:02</time>
          </header>
          <div class="body"><p>読書会の開始時間を18時に変えてもよいですか。</p></div>
          <div class="replies">
            <article class="rx-message" data-layout="conversation">
              <div class="avatar" aria-hidden="true">
                <span
                  class="rx-avatar"
                  data-size="small"
                  data-tone="green"
                  role="img"
                  aria-label="森 美咲"
                  ><span class="initials">美</span></span
                >
              </div>
              <header class="heading">
                <strong>森 美咲</strong
                ><time datetime="2026-09-14T16:10:00+09:00">9月14日 16:10</time>
              </header>
              <div class="body"><p>18時からで大丈夫です。</p></div>
            </article>
            <article class="rx-message" data-layout="conversation">
              <div class="avatar" aria-hidden="true">
                <span
                  class="rx-avatar"
                  data-size="small"
                  data-tone="blue"
                  role="img"
                  aria-label="佐藤 健"
                  ><span class="initials">健</span></span
                >
              </div>
              <header class="heading">
                <strong>佐藤 健</strong
                ><time datetime="2026-09-14T16:25:00+09:00">9月14日 16:25</time>
              </header>
              <div class="body">
                <p>少し遅れて参加します。資料は先に共有しておきます。</p>
              </div>
            </article>
          </div>
        </article>
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
          ><span class="title">アバターなし・複数段落・添付</span></span
        >
      </summary>
      <div class="body">
        <div>
          <article class="rx-message" data-layout="conversation">
            <header class="heading">
              <strong>予約の受付</strong
              ><time datetime="2026-09-13T09:00:00+09:00">9月13日 9:00</time>
            </header>
            <div class="body"><p>中会議室の予約を受け付けました。</p></div>
          </article>
          <article class="rx-message" data-layout="conversation">
            <div class="avatar" aria-hidden="true">
              <span
                class="rx-avatar"
                data-size="small"
                data-tone="green"
                role="img"
                aria-label="森 美咲"
                ><span class="initials">美</span></span
              >
            </div>
            <header class="heading">
              <strong>森 美咲</strong
              ><time datetime="2026-09-13T09:12:00+09:00">9月13日 9:12</time>
            </header>
            <div class="body">
              <p>当日の進め方をまとめました。</p>
              <p>最初の10分で近況を話し、そのあと一人ずつ本を紹介します。</p>
              <div class="rx-file-item" data-state="ready">
                <span class="icon"
                  ><svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-file"></use></svg
                ></span>
                <div class="body">
                  <p class="title"><a href="/apps/files">当日の進め方.pdf</a></p>
                  <p class="description">PDF · 120 KB</p>
                </div>
              </div>
            </div>
          </article>
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
          ><span class="title">メールのスレッドをカードを重ねて表示する</span></span
        >
      </summary>
      <div class="body">
        <div class="rx-stack">
          <div class="rx-cluster">
            <span
              class="rx-avatar-group"
              data-size="small"
              role="group"
              aria-label="森 美咲、佐藤 健"
              ><span
                class="rx-avatar"
                data-size="small"
                data-tone="green"
                role="img"
                aria-label="森 美咲"
                ><span class="initials">美</span></span
              ><span
                class="rx-avatar"
                data-size="small"
                data-tone="blue"
                role="img"
                aria-label="佐藤 健"
                ><span class="initials">健</span></span
              ></span
            >
            <div class="rx-tag-group" role="group" aria-label="ラベル">
              <span class="rx-tag" data-accent="blue">読書会</span>
            </div>
          </div>
          <h3>来週の打ち合わせについて</h3>
          <div>
            <article class="rx-message" data-layout="document">
              <div class="avatar" aria-hidden="true">
                <span
                  class="rx-avatar"
                  data-size="small"
                  data-tone="green"
                  role="img"
                  aria-label="森 美咲"
                  ><span class="initials">美</span></span
                >
              </div>
              <header class="heading">
                <strong>森 美咲</strong
                ><time datetime="2026-09-15T09:00:00+09:00">9月15日</time>
              </header>
              <div class="body">
                <p>
                  来週の打ち合わせの資料を共有します。事前に目を通しておいてください。
                </p>
                <div class="rx-file-item" data-state="ready">
                  <span class="preview"
                    ><svg viewBox="0 0 40 40" role="img" aria-label="料金表の1ページ目">
                      <rect width="40" height="40" fill="#ffffff"></rect>
                      <rect x="6" y="7" width="14" height="2" fill="#243946"></rect>
                      <rect x="6" y="13" width="28" height="1" fill="#b7c4cc"></rect>
                      <rect x="6" y="17" width="28" height="1" fill="#b7c4cc"></rect>
                      <rect
                        x="6"
                        y="21"
                        width="20"
                        height="1"
                        fill="#b7c4cc"
                      ></rect></svg
                  ></span>
                  <div class="body">
                    <p class="title"><a href="/apps/files">料金表-2026年秋.pdf</a></p>
                    <p class="description">PDF · 47.7 KB</p>
                  </div>
                </div>
              </div>
            </article>
            <article class="rx-message" data-layout="document">
              <div class="avatar" aria-hidden="true">
                <span
                  class="rx-avatar"
                  data-size="small"
                  data-tone="blue"
                  role="img"
                  aria-label="佐藤 健"
                  ><span class="initials">健</span></span
                >
              </div>
              <header class="heading">
                <strong>佐藤 健</strong
                ><time datetime="2026-09-15T11:20:00+09:00">9月15日</time>
              </header>
              <div class="body">
                <p>ありがとうございます。料金の表だけ、先に確認しておきます。</p>
              </div>
            </article>
            <article class="rx-message" data-layout="document">
              <div class="avatar" aria-hidden="true">
                <span
                  class="rx-avatar"
                  data-size="small"
                  data-tone="green"
                  role="img"
                  aria-label="森 美咲"
                  ><span class="initials">美</span></span
                >
              </div>
              <header class="heading">
                <strong>森 美咲</strong
                ><time datetime="2026-09-16T08:45:00+09:00">9月16日</time>
              </header>
              <div class="body">
                <p>助かります。気になる点があれば、この返信にまとめてください。</p>
                <p>当日は14時から、2階の小部屋で始めます。</p>
              </div>
              <footer class="actions">
                <button
                  class="rx-button"
                  type="button"
                  data-variant="secondary"
                  data-size="compact"
                >
                  返信する</button
                ><button
                  class="rx-button"
                  type="button"
                  data-variant="secondary"
                  data-size="compact"
                >
                  後で返信
                </button>
              </footer>
            </article>
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
        ><span class="label"><span class="title">長い名前・長い本文</span></span>
      </summary>
      <div class="body">
        <div class="rx-stack">
          <article class="rx-message" data-layout="conversation">
            <div class="avatar" aria-hidden="true">
              <span
                class="rx-avatar"
                data-size="small"
                data-tone="coral"
                role="img"
                aria-label="山田"
                ><span class="initials">山</span></span
              >
            </div>
            <header class="heading">
              <strong>株式会社とても長い名前の制作会社・海外事業部／山田</strong
              ><time datetime="2026-09-12T18:40:00+09:00">9月12日 18:40</time>
            </header>
            <div class="body">
              <p>
                https://example.com/documents/abcdefghijklmnopqrstuvwxyz0123456789
                に資料を置きました。確認の際は、共有設定が「組織内」になっていることもあわせて確かめてください。
              </p>
            </div>
          </article>
          <article class="rx-message" data-layout="document">
            <div class="avatar" aria-hidden="true">
              <span
                class="rx-avatar"
                data-size="small"
                data-tone="coral"
                role="img"
                aria-label="山田"
                ><span class="initials">山</span></span
              >
            </div>
            <header class="heading">
              <strong>株式会社とても長い名前の制作会社・海外事業部／山田</strong
              ><time datetime="2026-09-12T18:40:00+09:00">9月12日</time>
            </header>
            <div class="body">
              <p>
                https://example.com/documents/abcdefghijklmnopqrstuvwxyz0123456789
                に資料を置きました。共有設定が「組織内」になっていることもあわせて確かめてください。
              </p>
            </div>
            <footer class="actions">
              <a
                href="/apps/docs"
                class="rx-button"
                data-variant="secondary"
                data-size="default"
                >元のメールを開く</a
              >
            </footer>
          </article>
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
          <article class="rx-message" data-layout="conversation">
            <div class="avatar" aria-hidden="true">
              <span
                class="rx-avatar"
                data-size="small"
                data-tone="coral"
                role="img"
                aria-label="ليلى"
                ><span class="initials">ل</span></span
              >
            </div>
            <header class="heading">
              <strong>ليلى</strong
              ><time datetime="2026-09-15T10:24:00+09:00">اليوم ١٠:٢٤</time>
            </header>
            <div class="body"><p>أحضر كتابًا قرأته مؤخرًا وشارك انطباعاتك.</p></div>
          </article>
          <article class="rx-message" data-layout="document">
            <div class="avatar" aria-hidden="true">
              <span
                class="rx-avatar"
                data-size="small"
                data-tone="blue"
                role="img"
                aria-label="عمر"
                ><span class="initials">ع</span></span
              >
            </div>
            <header class="heading">
              <strong>عمر</strong
              ><time datetime="2026-09-15T11:20:00+09:00">١٥ سبتمبر</time>
            </header>
            <div class="body"><p>شكرًا، سأراجع الجدول قبل الاجتماع.</p></div>
          </article>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
