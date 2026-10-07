<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Reactions

同じ絵文字ごとに、付けた人数を添えてリアクションを表示します。

## 使いどころ

- 投稿やコメントに付いたリアクションを、絵文字や短い言葉ごとにまとめて示し、自分も付け外しさせる時に使います。
- 絵文字パネルだけが必要な時は `EmojiPicker` を使います。

## 使い方

`items` にリアクションごとの `content`（絵文字や短い言葉）と `by`（付けた人の名前の並び）を渡します。リアクションは灰色の細い枠の小さな白いピルで、`by` の人数を灰色の太字の数で添え、ホバーすると付けた人の名前を出します。言葉のリアクションは太字で書きます。自分も付けているリアクションは `mine` にすると、淡い青緑の面・青緑の枠・青緑の数にします。

`add` を渡すとリアクションが押せるボタンになり、ホバーすると淡い灰色の面に、押すと内側へへこみます。自分のリアクションを押すと外し、他の人のリアクションを押すと自分も付けます。数が0になったリアクションは消えます。付け外しで `by` に追加・削除する自分の名前は `add.me` で、`mine` のリアクションの `by` にも同じ名前を入れておきます。

`add` がある時は、リアクションの並びの末尾に「リアクションを追加」の操作を、枠を持たない青緑のアイコンのボタンで置きます。開くパネルには16文字までの言葉の欄と `EmojiPicker` があり、開くと言葉の欄へ移ります。選んだ絵文字や書いた言葉は、同じリアクションがあればそこへ自分を加え、なければ末尾に新しいリアクションを作ります。

`ReactionsController` を `reactions`、`EmojiPickerController` を `emoji-picker` として登録し、追加のパネルに使う `PopoverController`・`TooltipController` も登録します。付け外しすると `reactions:toggle` を発火するので、保存は利用側で行います。リアクションはcontrollerがその場で書き換えます。保存に失敗した時は、`reactions` のcontrollerの `setReaction(content, selected, name)` に `reactions:toggle` のdetailを `selected` だけ逆にして渡すと、イベントを発火せずにリアクションを元に戻します（消えたリアクションは作り直し、追加したリアクションは消します）。保存が済むまで書き換えたくない時は `reactions:beforetoggle` を取り消し、保存できてから `setReaction` で付け外しします。

`add` がない時は表示するだけのリアクションです。JavaScriptがない時はリアクションを押しても変わりません。

## キーボード

| キー          | 動作                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------- |
| Enter / Space | フォーカスのあるリアクションで、自分のリアクションを付け外しします。                                    |
| Enter         | 言葉の欄で、書いた言葉をリアクションとして追加します。日本語入力の変換を確定するEnterでは追加しません。 |
| Esc           | 追加のパネルを閉じます。                                                                                |

## アクセシビリティ

- リアクションの並びは `ul` で、`label` を名前にします。`label` は画面には出しません。
- リアクションは「いいね：田中 遥、佐藤 健」のように、`name`（無ければ `content`）と付けた人を読み上げ、絵文字と数は読み上げから外します。押せるリアクションは `aria-pressed` で自分が付けているかを伝えます。絵文字のリアクションには `name` を渡します。
- 追加の操作はアイコンだけのボタンで、`add.label` を名前にし、Tooltipで名前を見せます。パネルの見出しは読み上げだけに残します。
- リアクションを外して消えた時は次のリアクションか追加の操作へ、リアクションを追加した時はそのリアクションへフォーカスを移します。絵文字パネルの中の操作は `EmojiPicker` と同じです。

## イベント

| イベント                 | 内容                                                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reactions:beforetoggle` | 利用者の操作で自分のリアクションを付ける・外す前に発火します。取り消せます（取り消すとリアクションを変えません）。detailは `reactions:toggle` と同じです。                                  |
| `reactions:toggle`       | 自分のリアクションを付けた・外した後に発火します。detailは `content`（リアクションの内容）・`name`（読み上げの名前）・`selected`（付けた時は `true`）です。`setReaction` では発火しません。 |

## API

### Reactions

項目に付いたリアクション。同じ絵文字や言葉は一つのリアクションにまとめ、付けた人数を添える。別々の人が同じ絵文字を付けると数が増え、自分が付けているリアクションは淡い青にする。自分のリアクションを押すと外し、他の人のリアクションを押すと自分も同じリアクションを付ける。新しいリアクションはEmojiPickerから選ぶか、短い言葉を入力して追加する。

| 名前            | 型                                                                                                                       | 既定値 | 説明                                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須） | `string`                                                                                                                 |        | リアクションの一覧の名前。リアクションの並びのaria-labelにする。画面には出さない。                                                                                                                                                                                                                                                                                                |
| `items`（必須） | `readonly Reaction[]`                                                                                                    |        | リアクションごとに一件。付けた人（by）が空のリアクションは描かない。                                                                                                                                                                                                                                                                                                              |
| `add`           | `{ id: string; me?: string; label?: string; groups?: readonly EmojiGroup[]; textLabel?: string; submitLabel?: string; }` |        | 渡すと、リアクションを押して自分のリアクションを付け外しでき、末尾にリアクションを追加する操作を置く。追加のパネルはEmojiPickerと、短い言葉でリアクションする欄（16文字まで）を持つ。付け外しは書き換える前にreactions:beforetoggle（取り消せる）、後にreactions:toggleイベントを発火する。保存は利用側が持ち、失敗した時はReactionsControllerのsetReactionでリアクションを戻す。 |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`reactions`（`ReactionsController`）、`popover`（`PopoverController`）、`tooltip`（`TooltipController`）、`emoji-picker`（`EmojiPickerController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/overlay.css`、`components/icon.css`、`components/input-group.css`、`components/popover.css`、`components/tooltip.css`、`components/reactions.css`、`components/emoji-picker.css`

#### `add`の項目

| 名前          | 型                      | 既定値 | 説明                                                                                            |
| ------------- | ----------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| `id`（必須）  | `string`                |        | 追加のパネル（Popover）のid。ページ内で一意にする。言葉の欄と絵文字パネルのidにも使う。         |
| `me`          | `string`                |        | 自分の名前。付け外しでbyに追加・削除する名前で、itemsのbyと同じ書き方にする。既定は「自分」。   |
| `label`       | `string`                |        | 追加の操作の名前。Tooltipとパネルの見出し（読み上げだけ）に使う。既定は「リアクションを追加」。 |
| `groups`      | `readonly EmojiGroup[]` |        | EmojiPickerに並べる絵文字。渡さなければEmojiPickerの既定の絵文字を使う。                        |
| `textLabel`   | `string`                |        | 言葉の欄の名前。placeholderは末尾に「…」を付けて使う。既定は「リアクションを入力」。            |
| `submitLabel` | `string`                |        | 言葉の欄の確定ボタンの文言。既定は「追加」。                                                    |

#### `Reaction`

| 名前              | 型                  | 既定値 | 説明                                                                       |
| ----------------- | ------------------- | ------ | -------------------------------------------------------------------------- |
| `content`（必須） | `string`            |        | 絵文字や短い言葉。同じ内容のリアクションは一つにまとめる。                 |
| `name`            | `string`            |        | 読み上げの名前（絵文字の名前など）。渡さなければcontentを読む。            |
| `by`（必須）      | `readonly string[]` |        | 付けた人の名前。数はこの人数で、ホバー時と読み上げで誰が付けたかを伝える。 |
| `mine`            | `boolean`           |        | 自分も付けているもの。                                                     |

#### `EmojiGroup`

| 名前             | 型                 | 既定値 | 説明                                                   |
| ---------------- | ------------------ | ------ | ------------------------------------------------------ |
| `label`（必須）  | `string`           |        | 種類の見出し。グリッドのまとまりの読み上げ名にもなる。 |
| `emojis`（必須） | `readonly Emoji[]` |        | この種類に並べる絵文字。並べた順にグリッドへ置く。     |

#### `Emoji`

| 名前            | 型                  | 既定値 | 説明                                                                |
| --------------- | ------------------- | ------ | ------------------------------------------------------------------- |
| `emoji`（必須） | `string`            |        | グリッドに表示し、選んだ時にemoji-picker:pickイベントで渡す絵文字。 |
| `name`（必須）  | `string`            |        | 読み上げとホバー時の名前。                                          |
| `keywords`      | `readonly string[]` |        | 検索に使う別名。                                                    |

## コード

```tsx
import { Reactions, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <Reactions
      label="このカードへのリアクション"
      items={[
        {
          content: "👍",
          name: "いいね",
          by: ["田中 遥", "佐藤 健", "自分"],
          mine: true,
        },
        { content: "🚀", name: "ロケット", by: ["田中 遥"] },
        { content: "👀", name: "見ています", by: ["森 美咲", "佐藤 健"] },
      ]}
      add={{ id: "reactions-main" }}
    />
    <DisclosureGroup label="人数・内容・狭い場所・右から左">
      <Disclosure summary="別々の人が同じ絵文字を付けた時（数が増える）" open>
        <Reactions
          label="大勢のリアクション"
          items={[
            {
              content: "🎉",
              name: "お祝い",
              by: [
                "田中 遥",
                "佐藤 健",
                "森 美咲",
                "山本 誠",
                "小林 葵",
                "加藤 蓮",
                "自分",
              ],
              mine: true,
            },
            {
              content: "👏",
              name: "拍手",
              by: Array.from({ length: 128 }, (_, index) => `参加者${index + 1}`),
            },
          ]}
          add={{ id: "reactions-many" }}
        />
      </Disclosure>
      <Disclosure summary="短い言葉のリアクション・まだリアクションがない">
        <div class="rx-stack" data-space="small">
          <Reactions
            label="言葉のリアクション"
            items={[
              { content: "助かります", by: ["佐藤 健", "田中 遥"] },
              { content: "了解です", by: ["自分"], mine: true },
            ]}
            add={{ id: "reactions-words" }}
          />
          <Reactions
            label="まだないリアクション"
            items={[]}
            add={{ id: "reactions-empty" }}
          />
        </div>
      </Disclosure>
      <Disclosure summary="読むだけ（押せないリアクション）">
        <Reactions
          label="読むだけのリアクション"
          items={[
            { content: "👍", name: "いいね", by: ["田中 遥", "自分"], mine: true },
            { content: "🎉", name: "お祝い", by: ["佐藤 健"] },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：折り返す">
        <div style="max-inline-size: 12rem">
          <Reactions
            label="狭い場所のリアクション"
            items={[
              { content: "とても助かりました、ありがとうございます", by: ["田中 遥"] },
              { content: "🚀", name: "ロケット", by: ["佐藤 健"] },
              { content: "👍", name: "いいね", by: ["森 美咲"] },
            ]}
            add={{ id: "reactions-narrow" }}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Reactions
            label="التفاعلات"
            items={[
              { content: "👍", name: "إعجاب", by: ["هارو", "أنا"], mine: true },
              { content: "رائع", by: ["سارة"] },
            ]}
            add={{ id: "reactions-rtl", me: "أنا", label: "إضافة تفاعل" }}
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
  <div
    class="rx-reactions"
    data-controller="reactions"
    data-reactions-me-value="自分"
    data-action="emoji-picker:pick-&gt;reactions#pick"
  >
    <ul aria-label="このカードへのリアクション" data-reactions-target="list">
      <li>
        <button
          type="button"
          class="reaction"
          aria-pressed="true"
          data-mine="true"
          aria-label="いいね：田中 遥、佐藤 健、自分"
          title="田中 遥、佐藤 健、自分"
          data-content="👍"
          data-name="いいね"
          data-by='["田中 遥","佐藤 健","自分"]'
          data-action="reactions#toggle"
        >
          <span class="content" aria-hidden="true">👍</span
          ><span class="count" aria-hidden="true">3</span>
        </button>
      </li>
      <li>
        <button
          type="button"
          class="reaction"
          aria-pressed="false"
          data-mine="false"
          aria-label="ロケット：田中 遥"
          title="田中 遥"
          data-content="🚀"
          data-name="ロケット"
          data-by='["田中 遥"]'
          data-action="reactions#toggle"
        >
          <span class="content" aria-hidden="true">🚀</span
          ><span class="count" aria-hidden="true">1</span>
        </button>
      </li>
      <li>
        <button
          type="button"
          class="reaction"
          aria-pressed="false"
          data-mine="false"
          aria-label="見ています：森 美咲、佐藤 健"
          title="森 美咲、佐藤 健"
          data-content="👀"
          data-name="見ています"
          data-by='["森 美咲","佐藤 健"]'
          data-action="reactions#toggle"
        >
          <span class="content" aria-hidden="true">👀</span
          ><span class="count" aria-hidden="true">2</span>
        </button>
      </li>
    </ul>
    <div class="rx-popover" data-controller="popover" data-align="start">
      <span class="rx-tooltip" data-controller="tooltip" data-tooltip-delay-value="150"
        ><button
          popovertarget="reactions-main"
          style="
            anchor-name:
              --rx-tooltip-72-65-61-63-74-69-6f-6e-73-2d-6d-61-69-6e-2d-74-6f-6f-6c-74-69-70,
              --rx-popover-72-65-61-63-74-69-6f-6e-73-2d-6d-61-69-6e;
          "
          data-popover-target="trigger"
          data-tooltip-target="trigger"
          aria-haspopup="dialog"
          aria-controls="reactions-main"
          aria-label="リアクションを追加"
          data-icon-only="true"
          class="rx-button"
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
            <use href="/assets/rx-icons.svg#rx-smiley"></use>
          </svg></button
        ><span
          id="reactions-main-tooltip"
          class="content rx-overlay"
          role="tooltip"
          popover="manual"
          data-tooltip-target="content"
          style="
            position-anchor: --rx-tooltip-72-65-61-63-74-69-6f-6e-73-2d-6d-61-69-6e-2d-74-6f-6f-6c-74-69-70;
          "
          >リアクションを追加</span
        ></span
      >
      <div
        id="reactions-main"
        popover="auto"
        class="panel rx-overlay"
        data-placement="anchor"
        style="
          --rx-overlay-anchor: --rx-popover-72-65-61-63-74-69-6f-6e-73-2d-6d-61-69-6e;
        "
        data-popover-target="panel"
        data-align="start"
        data-size="default"
        role="dialog"
        aria-labelledby="reactions-main-title"
      >
        <header class="heading">
          <div class="heading-row">
            <h3 id="reactions-main-title" class="rx-visually-hidden" tabindex="-1">
              リアクションを追加
            </h3>
            <span class="close"
              ><button
                popovertarget="reactions-main"
                popovertargetaction="hide"
                data-icon-only="true"
                aria-label="閉じる"
                class="rx-button"
                type="button"
                data-variant="primary"
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
                </svg></button
            ></span>
          </div>
        </header>
        <div class="body">
          <div class="add">
            <div class="rx-input-group text">
              <div class="control" data-size="default">
                <input
                  maxlength="16"
                  autocomplete="off"
                  autofocus=""
                  aria-label="リアクションを入力"
                  placeholder="リアクションを入力…"
                  data-reactions-target="text"
                  data-action="keydown.enter-&gt;reactions#addText"
                  id="reactions-main-text"
                  data-size="default"
                  class="rx-input"
                />
              </div>
              <button
                data-action="reactions#addText"
                class="rx-button"
                type="button"
                data-variant="secondary"
                data-size="default"
              >
                追加
              </button>
            </div>
            <div
              class="rx-emoji-picker"
              role="group"
              aria-label="絵文字を選ぶ"
              data-controller="emoji-picker"
            >
              <div class="rx-input-group">
                <div class="control" data-size="default">
                  <span class="affix" id="reactions-main-picker-search-prefix"
                    ><svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-search"></use></svg></span
                  ><input
                    type="search"
                    aria-label="絵文字を探す…"
                    placeholder="絵文字を探す…"
                    autocomplete="off"
                    data-emoji-picker-target="input"
                    data-action="input-&gt;emoji-picker#filter"
                    id="reactions-main-picker-search"
                    data-size="default"
                    aria-describedby="reactions-main-picker-search-prefix"
                    class="rx-input"
                  />
                </div>
              </div>
              <div class="groups" data-action="keydown-&gt;emoji-picker#move">
                <section
                  class="group"
                  data-emoji-picker-target="group"
                  aria-labelledby="reactions-main-picker-group-0"
                >
                  <h3 class="title" id="reactions-main-picker-group-0">よく使う</h3>
                  <div class="grid">
                    <button
                      type="button"
                      class="emoji"
                      tabindex="0"
                      aria-label="いいね"
                      title="いいね"
                      data-emoji="👍"
                      data-search="いいね good 賛成 了解"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      👍</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="お祝い"
                      title="お祝い"
                      data-emoji="🎉"
                      data-search="お祝い party おめでとう"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      🎉</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="ハート"
                      title="ハート"
                      data-emoji="❤️"
                      data-search="ハート heart 好き"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      ❤️</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="笑顔"
                      title="笑顔"
                      data-emoji="😄"
                      data-search="笑顔 smile うれしい"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      😄</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="お願い"
                      title="お願い"
                      data-emoji="🙏"
                      data-search="お願い thanks ありがとう 感謝"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      🙏</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="見ています"
                      title="見ています"
                      data-emoji="👀"
                      data-search="見ています eyes 確認中"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      👀</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="ロケット"
                      title="ロケット"
                      data-emoji="🚀"
                      data-search="ロケット rocket 公開 出発"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      🚀</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="完了"
                      title="完了"
                      data-emoji="✅"
                      data-search="完了 done チェック 済み"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      ✅
                    </button>
                  </div>
                </section>
                <section
                  class="group"
                  data-emoji-picker-target="group"
                  aria-labelledby="reactions-main-picker-group-1"
                >
                  <h3 class="title" id="reactions-main-picker-group-1">顔</h3>
                  <div class="grid">
                    <button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="にっこり"
                      title="にっこり"
                      data-emoji="😀"
                      data-search="にっこり grin"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      😀</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="うれし泣き"
                      title="うれし泣き"
                      data-emoji="😂"
                      data-search="うれし泣き joy 笑"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      😂</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="ほほえみ"
                      title="ほほえみ"
                      data-emoji="😊"
                      data-search="ほほえみ blush"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      😊</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="目がハート"
                      title="目がハート"
                      data-emoji="😍"
                      data-search="目がハート love"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      😍</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="考え中"
                      title="考え中"
                      data-emoji="🤔"
                      data-search="考え中 thinking うーん"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      🤔</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="驚き"
                      title="驚き"
                      data-emoji="😮"
                      data-search="驚き wow えっ"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      😮</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="悲しい"
                      title="悲しい"
                      data-emoji="😢"
                      data-search="悲しい sad 涙"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      😢</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="冷や汗"
                      title="冷や汗"
                      data-emoji="😅"
                      data-search="冷や汗 sweat 苦笑"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      😅</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="サングラス"
                      title="サングラス"
                      data-emoji="😎"
                      data-search="サングラス cool"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      😎</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="パーティー"
                      title="パーティー"
                      data-emoji="🥳"
                      data-search="パーティー party お祝い"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      🥳</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="眠い"
                      title="眠い"
                      data-emoji="😴"
                      data-search="眠い sleep"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      😴</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="少しほほえみ"
                      title="少しほほえみ"
                      data-emoji="🙂"
                      data-search="少しほほえみ slight smile"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      🙂
                    </button>
                  </div>
                </section>
                <section
                  class="group"
                  data-emoji-picker-target="group"
                  aria-labelledby="reactions-main-picker-group-2"
                >
                  <h3 class="title" id="reactions-main-picker-group-2">手</h3>
                  <div class="grid">
                    <button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="拍手"
                      title="拍手"
                      data-emoji="👏"
                      data-search="拍手 clap すごい"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      👏</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="よくない"
                      title="よくない"
                      data-emoji="👎"
                      data-search="よくない bad 反対"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      👎</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="オーケー"
                      title="オーケー"
                      data-emoji="👌"
                      data-search="オーケー ok"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      👌</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="ピース"
                      title="ピース"
                      data-emoji="✌️"
                      data-search="ピース peace victory"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      ✌️</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="ばんざい"
                      title="ばんざい"
                      data-emoji="🙌"
                      data-search="ばんざい hooray やった"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      🙌</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="手を振る"
                      title="手を振る"
                      data-emoji="👋"
                      data-search="手を振る wave こんにちは さようなら"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      👋</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="力こぶ"
                      title="力こぶ"
                      data-emoji="💪"
                      data-search="力こぶ strong がんばる"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      💪</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="握手"
                      title="握手"
                      data-emoji="🤝"
                      data-search="握手 handshake 合意"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      🤝
                    </button>
                  </div>
                </section>
                <section
                  class="group"
                  data-emoji-picker-target="group"
                  aria-labelledby="reactions-main-picker-group-3"
                >
                  <h3 class="title" id="reactions-main-picker-group-3">物と記号</h3>
                  <div class="grid">
                    <button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="炎"
                      title="炎"
                      data-emoji="🔥"
                      data-search="炎 fire 熱い"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      🔥</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="星"
                      title="星"
                      data-emoji="⭐"
                      data-search="星 star お気に入り"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      ⭐</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="ひらめき"
                      title="ひらめき"
                      data-emoji="💡"
                      data-search="ひらめき idea 電球"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      💡</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="ピン"
                      title="ピン"
                      data-emoji="📌"
                      data-search="ピン pin 固定"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      📌</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="クリップ"
                      title="クリップ"
                      data-emoji="📎"
                      data-search="クリップ clip 添付"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      📎</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="時計"
                      title="時計"
                      data-emoji="⏰"
                      data-search="時計 alarm 締め切り"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      ⏰</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="コーヒー"
                      title="コーヒー"
                      data-emoji="☕"
                      data-search="コーヒー coffee 休憩"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      ☕</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="的"
                      title="的"
                      data-emoji="🎯"
                      data-search="的 target 目標"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      🎯</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="注意"
                      title="注意"
                      data-emoji="⚠️"
                      data-search="注意 warning"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      ⚠️</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="質問"
                      title="質問"
                      data-emoji="❓"
                      data-search="質問 question はてな"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      ❓</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="バツ"
                      title="バツ"
                      data-emoji="❌"
                      data-search="バツ no だめ"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      ❌</button
                    ><button
                      type="button"
                      class="emoji"
                      tabindex="-1"
                      aria-label="満点"
                      title="満点"
                      data-emoji="💯"
                      data-search="満点 100 完璧"
                      data-emoji-picker-target="emoji"
                      data-action="emoji-picker#pick"
                    >
                      💯
                    </button>
                  </div>
                </section>
                <p class="empty" data-emoji-picker-target="empty" hidden="">
                  当てはまる絵文字はありません
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    class="rx-disclosure-group"
    role="group"
    aria-label="人数・内容・狭い場所・右から左"
  >
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
          ><span class="title">別々の人が同じ絵文字を付けた時（数が増える）</span></span
        >
      </summary>
      <div class="body">
        <div
          class="rx-reactions"
          data-controller="reactions"
          data-reactions-me-value="自分"
          data-action="emoji-picker:pick-&gt;reactions#pick"
        >
          <ul aria-label="大勢のリアクション" data-reactions-target="list">
            <li>
              <button
                type="button"
                class="reaction"
                aria-pressed="true"
                data-mine="true"
                aria-label="お祝い：田中 遥、佐藤 健、森 美咲、山本 誠、小林 葵、加藤 蓮、自分"
                title="田中 遥、佐藤 健、森 美咲、山本 誠、小林 葵、加藤 蓮、自分"
                data-content="🎉"
                data-name="お祝い"
                data-by='["田中 遥","佐藤 健","森 美咲","山本 誠","小林 葵","加藤 蓮","自分"]'
                data-action="reactions#toggle"
              >
                <span class="content" aria-hidden="true">🎉</span
                ><span class="count" aria-hidden="true">7</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                class="reaction"
                aria-pressed="false"
                data-mine="false"
                aria-label="拍手：参加者1、参加者2、参加者3、参加者4、参加者5、参加者6、参加者7、参加者8、参加者9、参加者10、参加者11、参加者12、参加者13、参加者14、参加者15、参加者16、参加者17、参加者18、参加者19、参加者20、参加者21、参加者22、参加者23、参加者24、参加者25、参加者26、参加者27、参加者28、参加者29、参加者30、参加者31、参加者32、参加者33、参加者34、参加者35、参加者36、参加者37、参加者38、参加者39、参加者40、参加者41、参加者42、参加者43、参加者44、参加者45、参加者46、参加者47、参加者48、参加者49、参加者50、参加者51、参加者52、参加者53、参加者54、参加者55、参加者56、参加者57、参加者58、参加者59、参加者60、参加者61、参加者62、参加者63、参加者64、参加者65、参加者66、参加者67、参加者68、参加者69、参加者70、参加者71、参加者72、参加者73、参加者74、参加者75、参加者76、参加者77、参加者78、参加者79、参加者80、参加者81、参加者82、参加者83、参加者84、参加者85、参加者86、参加者87、参加者88、参加者89、参加者90、参加者91、参加者92、参加者93、参加者94、参加者95、参加者96、参加者97、参加者98、参加者99、参加者100、参加者101、参加者102、参加者103、参加者104、参加者105、参加者106、参加者107、参加者108、参加者109、参加者110、参加者111、参加者112、参加者113、参加者114、参加者115、参加者116、参加者117、参加者118、参加者119、参加者120、参加者121、参加者122、参加者123、参加者124、参加者125、参加者126、参加者127、参加者128"
                title="参加者1、参加者2、参加者3、参加者4、参加者5、参加者6、参加者7、参加者8、参加者9、参加者10、参加者11、参加者12、参加者13、参加者14、参加者15、参加者16、参加者17、参加者18、参加者19、参加者20、参加者21、参加者22、参加者23、参加者24、参加者25、参加者26、参加者27、参加者28、参加者29、参加者30、参加者31、参加者32、参加者33、参加者34、参加者35、参加者36、参加者37、参加者38、参加者39、参加者40、参加者41、参加者42、参加者43、参加者44、参加者45、参加者46、参加者47、参加者48、参加者49、参加者50、参加者51、参加者52、参加者53、参加者54、参加者55、参加者56、参加者57、参加者58、参加者59、参加者60、参加者61、参加者62、参加者63、参加者64、参加者65、参加者66、参加者67、参加者68、参加者69、参加者70、参加者71、参加者72、参加者73、参加者74、参加者75、参加者76、参加者77、参加者78、参加者79、参加者80、参加者81、参加者82、参加者83、参加者84、参加者85、参加者86、参加者87、参加者88、参加者89、参加者90、参加者91、参加者92、参加者93、参加者94、参加者95、参加者96、参加者97、参加者98、参加者99、参加者100、参加者101、参加者102、参加者103、参加者104、参加者105、参加者106、参加者107、参加者108、参加者109、参加者110、参加者111、参加者112、参加者113、参加者114、参加者115、参加者116、参加者117、参加者118、参加者119、参加者120、参加者121、参加者122、参加者123、参加者124、参加者125、参加者126、参加者127、参加者128"
                data-content="👏"
                data-name="拍手"
                data-by='["参加者1","参加者2","参加者3","参加者4","参加者5","参加者6","参加者7","参加者8","参加者9","参加者10","参加者11","参加者12","参加者13","参加者14","参加者15","参加者16","参加者17","参加者18","参加者19","参加者20","参加者21","参加者22","参加者23","参加者24","参加者25","参加者26","参加者27","参加者28","参加者29","参加者30","参加者31","参加者32","参加者33","参加者34","参加者35","参加者36","参加者37","参加者38","参加者39","参加者40","参加者41","参加者42","参加者43","参加者44","参加者45","参加者46","参加者47","参加者48","参加者49","参加者50","参加者51","参加者52","参加者53","参加者54","参加者55","参加者56","参加者57","参加者58","参加者59","参加者60","参加者61","参加者62","参加者63","参加者64","参加者65","参加者66","参加者67","参加者68","参加者69","参加者70","参加者71","参加者72","参加者73","参加者74","参加者75","参加者76","参加者77","参加者78","参加者79","参加者80","参加者81","参加者82","参加者83","参加者84","参加者85","参加者86","参加者87","参加者88","参加者89","参加者90","参加者91","参加者92","参加者93","参加者94","参加者95","参加者96","参加者97","参加者98","参加者99","参加者100","参加者101","参加者102","参加者103","参加者104","参加者105","参加者106","参加者107","参加者108","参加者109","参加者110","参加者111","参加者112","参加者113","参加者114","参加者115","参加者116","参加者117","参加者118","参加者119","参加者120","参加者121","参加者122","参加者123","参加者124","参加者125","参加者126","参加者127","参加者128"]'
                data-action="reactions#toggle"
              >
                <span class="content" aria-hidden="true">👏</span
                ><span class="count" aria-hidden="true">128</span>
              </button>
            </li>
          </ul>
          <div class="rx-popover" data-controller="popover" data-align="start">
            <span
              class="rx-tooltip"
              data-controller="tooltip"
              data-tooltip-delay-value="150"
              ><button
                popovertarget="reactions-many"
                style="
                  anchor-name:
                    --rx-tooltip-72-65-61-63-74-69-6f-6e-73-2d-6d-61-6e-79-2d-74-6f-6f-6c-74-69-70,
                    --rx-popover-72-65-61-63-74-69-6f-6e-73-2d-6d-61-6e-79;
                "
                data-popover-target="trigger"
                data-tooltip-target="trigger"
                aria-haspopup="dialog"
                aria-controls="reactions-many"
                aria-label="リアクションを追加"
                data-icon-only="true"
                class="rx-button"
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
                  <use href="/assets/rx-icons.svg#rx-smiley"></use>
                </svg></button
              ><span
                id="reactions-many-tooltip"
                class="content rx-overlay"
                role="tooltip"
                popover="manual"
                data-tooltip-target="content"
                style="
                  position-anchor: --rx-tooltip-72-65-61-63-74-69-6f-6e-73-2d-6d-61-6e-79-2d-74-6f-6f-6c-74-69-70;
                "
                >リアクションを追加</span
              ></span
            >
            <div
              id="reactions-many"
              popover="auto"
              class="panel rx-overlay"
              data-placement="anchor"
              style="
                --rx-overlay-anchor: --rx-popover-72-65-61-63-74-69-6f-6e-73-2d-6d-61-6e-79;
              "
              data-popover-target="panel"
              data-align="start"
              data-size="default"
              role="dialog"
              aria-labelledby="reactions-many-title"
            >
              <header class="heading">
                <div class="heading-row">
                  <h3
                    id="reactions-many-title"
                    class="rx-visually-hidden"
                    tabindex="-1"
                  >
                    リアクションを追加
                  </h3>
                  <span class="close"
                    ><button
                      popovertarget="reactions-many"
                      popovertargetaction="hide"
                      data-icon-only="true"
                      aria-label="閉じる"
                      class="rx-button"
                      type="button"
                      data-variant="primary"
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
                      </svg></button
                  ></span>
                </div>
              </header>
              <div class="body">
                <div class="add">
                  <div class="rx-input-group text">
                    <div class="control" data-size="default">
                      <input
                        maxlength="16"
                        autocomplete="off"
                        autofocus=""
                        aria-label="リアクションを入力"
                        placeholder="リアクションを入力…"
                        data-reactions-target="text"
                        data-action="keydown.enter-&gt;reactions#addText"
                        id="reactions-many-text"
                        data-size="default"
                        class="rx-input"
                      />
                    </div>
                    <button
                      data-action="reactions#addText"
                      class="rx-button"
                      type="button"
                      data-variant="secondary"
                      data-size="default"
                    >
                      追加
                    </button>
                  </div>
                  <div
                    class="rx-emoji-picker"
                    role="group"
                    aria-label="絵文字を選ぶ"
                    data-controller="emoji-picker"
                  >
                    <div class="rx-input-group">
                      <div class="control" data-size="default">
                        <span class="affix" id="reactions-many-picker-search-prefix"
                          ><svg
                            class="rx-icon"
                            viewBox="0 0 256 256"
                            fill="currentColor"
                            aria-hidden="true"
                            focusable="false"
                          >
                            <use
                              href="/assets/rx-icons.svg#rx-search"
                            ></use></svg></span
                        ><input
                          type="search"
                          aria-label="絵文字を探す…"
                          placeholder="絵文字を探す…"
                          autocomplete="off"
                          data-emoji-picker-target="input"
                          data-action="input-&gt;emoji-picker#filter"
                          id="reactions-many-picker-search"
                          data-size="default"
                          aria-describedby="reactions-many-picker-search-prefix"
                          class="rx-input"
                        />
                      </div>
                    </div>
                    <div class="groups" data-action="keydown-&gt;emoji-picker#move">
                      <section
                        class="group"
                        data-emoji-picker-target="group"
                        aria-labelledby="reactions-many-picker-group-0"
                      >
                        <h3 class="title" id="reactions-many-picker-group-0">
                          よく使う
                        </h3>
                        <div class="grid">
                          <button
                            type="button"
                            class="emoji"
                            tabindex="0"
                            aria-label="いいね"
                            title="いいね"
                            data-emoji="👍"
                            data-search="いいね good 賛成 了解"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            👍</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="お祝い"
                            title="お祝い"
                            data-emoji="🎉"
                            data-search="お祝い party おめでとう"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            🎉</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="ハート"
                            title="ハート"
                            data-emoji="❤️"
                            data-search="ハート heart 好き"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            ❤️</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="笑顔"
                            title="笑顔"
                            data-emoji="😄"
                            data-search="笑顔 smile うれしい"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            😄</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="お願い"
                            title="お願い"
                            data-emoji="🙏"
                            data-search="お願い thanks ありがとう 感謝"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            🙏</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="見ています"
                            title="見ています"
                            data-emoji="👀"
                            data-search="見ています eyes 確認中"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            👀</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="ロケット"
                            title="ロケット"
                            data-emoji="🚀"
                            data-search="ロケット rocket 公開 出発"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            🚀</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="完了"
                            title="完了"
                            data-emoji="✅"
                            data-search="完了 done チェック 済み"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            ✅
                          </button>
                        </div>
                      </section>
                      <section
                        class="group"
                        data-emoji-picker-target="group"
                        aria-labelledby="reactions-many-picker-group-1"
                      >
                        <h3 class="title" id="reactions-many-picker-group-1">顔</h3>
                        <div class="grid">
                          <button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="にっこり"
                            title="にっこり"
                            data-emoji="😀"
                            data-search="にっこり grin"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            😀</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="うれし泣き"
                            title="うれし泣き"
                            data-emoji="😂"
                            data-search="うれし泣き joy 笑"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            😂</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="ほほえみ"
                            title="ほほえみ"
                            data-emoji="😊"
                            data-search="ほほえみ blush"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            😊</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="目がハート"
                            title="目がハート"
                            data-emoji="😍"
                            data-search="目がハート love"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            😍</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="考え中"
                            title="考え中"
                            data-emoji="🤔"
                            data-search="考え中 thinking うーん"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            🤔</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="驚き"
                            title="驚き"
                            data-emoji="😮"
                            data-search="驚き wow えっ"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            😮</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="悲しい"
                            title="悲しい"
                            data-emoji="😢"
                            data-search="悲しい sad 涙"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            😢</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="冷や汗"
                            title="冷や汗"
                            data-emoji="😅"
                            data-search="冷や汗 sweat 苦笑"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            😅</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="サングラス"
                            title="サングラス"
                            data-emoji="😎"
                            data-search="サングラス cool"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            😎</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="パーティー"
                            title="パーティー"
                            data-emoji="🥳"
                            data-search="パーティー party お祝い"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            🥳</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="眠い"
                            title="眠い"
                            data-emoji="😴"
                            data-search="眠い sleep"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            😴</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="少しほほえみ"
                            title="少しほほえみ"
                            data-emoji="🙂"
                            data-search="少しほほえみ slight smile"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            🙂
                          </button>
                        </div>
                      </section>
                      <section
                        class="group"
                        data-emoji-picker-target="group"
                        aria-labelledby="reactions-many-picker-group-2"
                      >
                        <h3 class="title" id="reactions-many-picker-group-2">手</h3>
                        <div class="grid">
                          <button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="拍手"
                            title="拍手"
                            data-emoji="👏"
                            data-search="拍手 clap すごい"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            👏</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="よくない"
                            title="よくない"
                            data-emoji="👎"
                            data-search="よくない bad 反対"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            👎</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="オーケー"
                            title="オーケー"
                            data-emoji="👌"
                            data-search="オーケー ok"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            👌</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="ピース"
                            title="ピース"
                            data-emoji="✌️"
                            data-search="ピース peace victory"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            ✌️</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="ばんざい"
                            title="ばんざい"
                            data-emoji="🙌"
                            data-search="ばんざい hooray やった"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            🙌</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="手を振る"
                            title="手を振る"
                            data-emoji="👋"
                            data-search="手を振る wave こんにちは さようなら"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            👋</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="力こぶ"
                            title="力こぶ"
                            data-emoji="💪"
                            data-search="力こぶ strong がんばる"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            💪</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="握手"
                            title="握手"
                            data-emoji="🤝"
                            data-search="握手 handshake 合意"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            🤝
                          </button>
                        </div>
                      </section>
                      <section
                        class="group"
                        data-emoji-picker-target="group"
                        aria-labelledby="reactions-many-picker-group-3"
                      >
                        <h3 class="title" id="reactions-many-picker-group-3">
                          物と記号
                        </h3>
                        <div class="grid">
                          <button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="炎"
                            title="炎"
                            data-emoji="🔥"
                            data-search="炎 fire 熱い"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            🔥</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="星"
                            title="星"
                            data-emoji="⭐"
                            data-search="星 star お気に入り"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            ⭐</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="ひらめき"
                            title="ひらめき"
                            data-emoji="💡"
                            data-search="ひらめき idea 電球"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            💡</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="ピン"
                            title="ピン"
                            data-emoji="📌"
                            data-search="ピン pin 固定"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            📌</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="クリップ"
                            title="クリップ"
                            data-emoji="📎"
                            data-search="クリップ clip 添付"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            📎</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="時計"
                            title="時計"
                            data-emoji="⏰"
                            data-search="時計 alarm 締め切り"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            ⏰</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="コーヒー"
                            title="コーヒー"
                            data-emoji="☕"
                            data-search="コーヒー coffee 休憩"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            ☕</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="的"
                            title="的"
                            data-emoji="🎯"
                            data-search="的 target 目標"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            🎯</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="注意"
                            title="注意"
                            data-emoji="⚠️"
                            data-search="注意 warning"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            ⚠️</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="質問"
                            title="質問"
                            data-emoji="❓"
                            data-search="質問 question はてな"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            ❓</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="バツ"
                            title="バツ"
                            data-emoji="❌"
                            data-search="バツ no だめ"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            ❌</button
                          ><button
                            type="button"
                            class="emoji"
                            tabindex="-1"
                            aria-label="満点"
                            title="満点"
                            data-emoji="💯"
                            data-search="満点 100 完璧"
                            data-emoji-picker-target="emoji"
                            data-action="emoji-picker#pick"
                          >
                            💯
                          </button>
                        </div>
                      </section>
                      <p class="empty" data-emoji-picker-target="empty" hidden="">
                        当てはまる絵文字はありません
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        ><span class="label"
          ><span class="title"
            >短い言葉のリアクション・まだリアクションがない</span
          ></span
        >
      </summary>
      <div class="body">
        <div class="rx-stack" data-space="small">
          <div
            class="rx-reactions"
            data-controller="reactions"
            data-reactions-me-value="自分"
            data-action="emoji-picker:pick-&gt;reactions#pick"
          >
            <ul aria-label="言葉のリアクション" data-reactions-target="list">
              <li>
                <button
                  type="button"
                  class="reaction"
                  aria-pressed="false"
                  data-mine="false"
                  aria-label="助かります：佐藤 健、田中 遥"
                  title="佐藤 健、田中 遥"
                  data-content="助かります"
                  data-by='["佐藤 健","田中 遥"]'
                  data-action="reactions#toggle"
                >
                  <span class="content" aria-hidden="true">助かります</span
                  ><span class="count" aria-hidden="true">2</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="reaction"
                  aria-pressed="true"
                  data-mine="true"
                  aria-label="了解です：自分"
                  title="自分"
                  data-content="了解です"
                  data-by='["自分"]'
                  data-action="reactions#toggle"
                >
                  <span class="content" aria-hidden="true">了解です</span
                  ><span class="count" aria-hidden="true">1</span>
                </button>
              </li>
            </ul>
            <div class="rx-popover" data-controller="popover" data-align="start">
              <span
                class="rx-tooltip"
                data-controller="tooltip"
                data-tooltip-delay-value="150"
                ><button
                  popovertarget="reactions-words"
                  style="
                    anchor-name:
                      --rx-tooltip-72-65-61-63-74-69-6f-6e-73-2d-77-6f-72-64-73-2d-74-6f-6f-6c-74-69-70,
                      --rx-popover-72-65-61-63-74-69-6f-6e-73-2d-77-6f-72-64-73;
                  "
                  data-popover-target="trigger"
                  data-tooltip-target="trigger"
                  aria-haspopup="dialog"
                  aria-controls="reactions-words"
                  aria-label="リアクションを追加"
                  data-icon-only="true"
                  class="rx-button"
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
                    <use href="/assets/rx-icons.svg#rx-smiley"></use>
                  </svg></button
                ><span
                  id="reactions-words-tooltip"
                  class="content rx-overlay"
                  role="tooltip"
                  popover="manual"
                  data-tooltip-target="content"
                  style="
                    position-anchor: --rx-tooltip-72-65-61-63-74-69-6f-6e-73-2d-77-6f-72-64-73-2d-74-6f-6f-6c-74-69-70;
                  "
                  >リアクションを追加</span
                ></span
              >
              <div
                id="reactions-words"
                popover="auto"
                class="panel rx-overlay"
                data-placement="anchor"
                style="
                  --rx-overlay-anchor: --rx-popover-72-65-61-63-74-69-6f-6e-73-2d-77-6f-72-64-73;
                "
                data-popover-target="panel"
                data-align="start"
                data-size="default"
                role="dialog"
                aria-labelledby="reactions-words-title"
              >
                <header class="heading">
                  <div class="heading-row">
                    <h3
                      id="reactions-words-title"
                      class="rx-visually-hidden"
                      tabindex="-1"
                    >
                      リアクションを追加
                    </h3>
                    <span class="close"
                      ><button
                        popovertarget="reactions-words"
                        popovertargetaction="hide"
                        data-icon-only="true"
                        aria-label="閉じる"
                        class="rx-button"
                        type="button"
                        data-variant="primary"
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
                        </svg></button
                    ></span>
                  </div>
                </header>
                <div class="body">
                  <div class="add">
                    <div class="rx-input-group text">
                      <div class="control" data-size="default">
                        <input
                          maxlength="16"
                          autocomplete="off"
                          autofocus=""
                          aria-label="リアクションを入力"
                          placeholder="リアクションを入力…"
                          data-reactions-target="text"
                          data-action="keydown.enter-&gt;reactions#addText"
                          id="reactions-words-text"
                          data-size="default"
                          class="rx-input"
                        />
                      </div>
                      <button
                        data-action="reactions#addText"
                        class="rx-button"
                        type="button"
                        data-variant="secondary"
                        data-size="default"
                      >
                        追加
                      </button>
                    </div>
                    <div
                      class="rx-emoji-picker"
                      role="group"
                      aria-label="絵文字を選ぶ"
                      data-controller="emoji-picker"
                    >
                      <div class="rx-input-group">
                        <div class="control" data-size="default">
                          <span class="affix" id="reactions-words-picker-search-prefix"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-search"
                              ></use></svg></span
                          ><input
                            type="search"
                            aria-label="絵文字を探す…"
                            placeholder="絵文字を探す…"
                            autocomplete="off"
                            data-emoji-picker-target="input"
                            data-action="input-&gt;emoji-picker#filter"
                            id="reactions-words-picker-search"
                            data-size="default"
                            aria-describedby="reactions-words-picker-search-prefix"
                            class="rx-input"
                          />
                        </div>
                      </div>
                      <div class="groups" data-action="keydown-&gt;emoji-picker#move">
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-words-picker-group-0"
                        >
                          <h3 class="title" id="reactions-words-picker-group-0">
                            よく使う
                          </h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="0"
                              aria-label="いいね"
                              title="いいね"
                              data-emoji="👍"
                              data-search="いいね good 賛成 了解"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👍</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="お祝い"
                              title="お祝い"
                              data-emoji="🎉"
                              data-search="お祝い party おめでとう"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🎉</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ハート"
                              title="ハート"
                              data-emoji="❤️"
                              data-search="ハート heart 好き"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ❤️</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="笑顔"
                              title="笑顔"
                              data-emoji="😄"
                              data-search="笑顔 smile うれしい"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😄</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="お願い"
                              title="お願い"
                              data-emoji="🙏"
                              data-search="お願い thanks ありがとう 感謝"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🙏</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="見ています"
                              title="見ています"
                              data-emoji="👀"
                              data-search="見ています eyes 確認中"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👀</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ロケット"
                              title="ロケット"
                              data-emoji="🚀"
                              data-search="ロケット rocket 公開 出発"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🚀</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="完了"
                              title="完了"
                              data-emoji="✅"
                              data-search="完了 done チェック 済み"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ✅
                            </button>
                          </div>
                        </section>
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-words-picker-group-1"
                        >
                          <h3 class="title" id="reactions-words-picker-group-1">顔</h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="にっこり"
                              title="にっこり"
                              data-emoji="😀"
                              data-search="にっこり grin"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😀</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="うれし泣き"
                              title="うれし泣き"
                              data-emoji="😂"
                              data-search="うれし泣き joy 笑"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😂</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ほほえみ"
                              title="ほほえみ"
                              data-emoji="😊"
                              data-search="ほほえみ blush"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😊</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="目がハート"
                              title="目がハート"
                              data-emoji="😍"
                              data-search="目がハート love"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😍</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="考え中"
                              title="考え中"
                              data-emoji="🤔"
                              data-search="考え中 thinking うーん"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🤔</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="驚き"
                              title="驚き"
                              data-emoji="😮"
                              data-search="驚き wow えっ"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😮</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="悲しい"
                              title="悲しい"
                              data-emoji="😢"
                              data-search="悲しい sad 涙"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😢</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="冷や汗"
                              title="冷や汗"
                              data-emoji="😅"
                              data-search="冷や汗 sweat 苦笑"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😅</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="サングラス"
                              title="サングラス"
                              data-emoji="😎"
                              data-search="サングラス cool"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😎</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="パーティー"
                              title="パーティー"
                              data-emoji="🥳"
                              data-search="パーティー party お祝い"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🥳</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="眠い"
                              title="眠い"
                              data-emoji="😴"
                              data-search="眠い sleep"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😴</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="少しほほえみ"
                              title="少しほほえみ"
                              data-emoji="🙂"
                              data-search="少しほほえみ slight smile"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🙂
                            </button>
                          </div>
                        </section>
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-words-picker-group-2"
                        >
                          <h3 class="title" id="reactions-words-picker-group-2">手</h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="拍手"
                              title="拍手"
                              data-emoji="👏"
                              data-search="拍手 clap すごい"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👏</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="よくない"
                              title="よくない"
                              data-emoji="👎"
                              data-search="よくない bad 反対"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👎</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="オーケー"
                              title="オーケー"
                              data-emoji="👌"
                              data-search="オーケー ok"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ピース"
                              title="ピース"
                              data-emoji="✌️"
                              data-search="ピース peace victory"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ✌️</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ばんざい"
                              title="ばんざい"
                              data-emoji="🙌"
                              data-search="ばんざい hooray やった"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🙌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="手を振る"
                              title="手を振る"
                              data-emoji="👋"
                              data-search="手を振る wave こんにちは さようなら"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👋</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="力こぶ"
                              title="力こぶ"
                              data-emoji="💪"
                              data-search="力こぶ strong がんばる"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              💪</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="握手"
                              title="握手"
                              data-emoji="🤝"
                              data-search="握手 handshake 合意"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🤝
                            </button>
                          </div>
                        </section>
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-words-picker-group-3"
                        >
                          <h3 class="title" id="reactions-words-picker-group-3">
                            物と記号
                          </h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="炎"
                              title="炎"
                              data-emoji="🔥"
                              data-search="炎 fire 熱い"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🔥</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="星"
                              title="星"
                              data-emoji="⭐"
                              data-search="星 star お気に入り"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ⭐</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ひらめき"
                              title="ひらめき"
                              data-emoji="💡"
                              data-search="ひらめき idea 電球"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              💡</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ピン"
                              title="ピン"
                              data-emoji="📌"
                              data-search="ピン pin 固定"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              📌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="クリップ"
                              title="クリップ"
                              data-emoji="📎"
                              data-search="クリップ clip 添付"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              📎</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="時計"
                              title="時計"
                              data-emoji="⏰"
                              data-search="時計 alarm 締め切り"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ⏰</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="コーヒー"
                              title="コーヒー"
                              data-emoji="☕"
                              data-search="コーヒー coffee 休憩"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ☕</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="的"
                              title="的"
                              data-emoji="🎯"
                              data-search="的 target 目標"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🎯</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="注意"
                              title="注意"
                              data-emoji="⚠️"
                              data-search="注意 warning"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ⚠️</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="質問"
                              title="質問"
                              data-emoji="❓"
                              data-search="質問 question はてな"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ❓</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="バツ"
                              title="バツ"
                              data-emoji="❌"
                              data-search="バツ no だめ"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ❌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="満点"
                              title="満点"
                              data-emoji="💯"
                              data-search="満点 100 完璧"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              💯
                            </button>
                          </div>
                        </section>
                        <p class="empty" data-emoji-picker-target="empty" hidden="">
                          当てはまる絵文字はありません
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="rx-reactions"
            data-controller="reactions"
            data-reactions-me-value="自分"
            data-action="emoji-picker:pick-&gt;reactions#pick"
          >
            <ul aria-label="まだないリアクション" data-reactions-target="list"></ul>
            <div class="rx-popover" data-controller="popover" data-align="start">
              <span
                class="rx-tooltip"
                data-controller="tooltip"
                data-tooltip-delay-value="150"
                ><button
                  popovertarget="reactions-empty"
                  style="
                    anchor-name:
                      --rx-tooltip-72-65-61-63-74-69-6f-6e-73-2d-65-6d-70-74-79-2d-74-6f-6f-6c-74-69-70,
                      --rx-popover-72-65-61-63-74-69-6f-6e-73-2d-65-6d-70-74-79;
                  "
                  data-popover-target="trigger"
                  data-tooltip-target="trigger"
                  aria-haspopup="dialog"
                  aria-controls="reactions-empty"
                  aria-label="リアクションを追加"
                  data-icon-only="true"
                  class="rx-button"
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
                    <use href="/assets/rx-icons.svg#rx-smiley"></use>
                  </svg></button
                ><span
                  id="reactions-empty-tooltip"
                  class="content rx-overlay"
                  role="tooltip"
                  popover="manual"
                  data-tooltip-target="content"
                  style="
                    position-anchor: --rx-tooltip-72-65-61-63-74-69-6f-6e-73-2d-65-6d-70-74-79-2d-74-6f-6f-6c-74-69-70;
                  "
                  >リアクションを追加</span
                ></span
              >
              <div
                id="reactions-empty"
                popover="auto"
                class="panel rx-overlay"
                data-placement="anchor"
                style="
                  --rx-overlay-anchor: --rx-popover-72-65-61-63-74-69-6f-6e-73-2d-65-6d-70-74-79;
                "
                data-popover-target="panel"
                data-align="start"
                data-size="default"
                role="dialog"
                aria-labelledby="reactions-empty-title"
              >
                <header class="heading">
                  <div class="heading-row">
                    <h3
                      id="reactions-empty-title"
                      class="rx-visually-hidden"
                      tabindex="-1"
                    >
                      リアクションを追加
                    </h3>
                    <span class="close"
                      ><button
                        popovertarget="reactions-empty"
                        popovertargetaction="hide"
                        data-icon-only="true"
                        aria-label="閉じる"
                        class="rx-button"
                        type="button"
                        data-variant="primary"
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
                        </svg></button
                    ></span>
                  </div>
                </header>
                <div class="body">
                  <div class="add">
                    <div class="rx-input-group text">
                      <div class="control" data-size="default">
                        <input
                          maxlength="16"
                          autocomplete="off"
                          autofocus=""
                          aria-label="リアクションを入力"
                          placeholder="リアクションを入力…"
                          data-reactions-target="text"
                          data-action="keydown.enter-&gt;reactions#addText"
                          id="reactions-empty-text"
                          data-size="default"
                          class="rx-input"
                        />
                      </div>
                      <button
                        data-action="reactions#addText"
                        class="rx-button"
                        type="button"
                        data-variant="secondary"
                        data-size="default"
                      >
                        追加
                      </button>
                    </div>
                    <div
                      class="rx-emoji-picker"
                      role="group"
                      aria-label="絵文字を選ぶ"
                      data-controller="emoji-picker"
                    >
                      <div class="rx-input-group">
                        <div class="control" data-size="default">
                          <span class="affix" id="reactions-empty-picker-search-prefix"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-search"
                              ></use></svg></span
                          ><input
                            type="search"
                            aria-label="絵文字を探す…"
                            placeholder="絵文字を探す…"
                            autocomplete="off"
                            data-emoji-picker-target="input"
                            data-action="input-&gt;emoji-picker#filter"
                            id="reactions-empty-picker-search"
                            data-size="default"
                            aria-describedby="reactions-empty-picker-search-prefix"
                            class="rx-input"
                          />
                        </div>
                      </div>
                      <div class="groups" data-action="keydown-&gt;emoji-picker#move">
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-empty-picker-group-0"
                        >
                          <h3 class="title" id="reactions-empty-picker-group-0">
                            よく使う
                          </h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="0"
                              aria-label="いいね"
                              title="いいね"
                              data-emoji="👍"
                              data-search="いいね good 賛成 了解"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👍</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="お祝い"
                              title="お祝い"
                              data-emoji="🎉"
                              data-search="お祝い party おめでとう"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🎉</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ハート"
                              title="ハート"
                              data-emoji="❤️"
                              data-search="ハート heart 好き"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ❤️</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="笑顔"
                              title="笑顔"
                              data-emoji="😄"
                              data-search="笑顔 smile うれしい"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😄</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="お願い"
                              title="お願い"
                              data-emoji="🙏"
                              data-search="お願い thanks ありがとう 感謝"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🙏</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="見ています"
                              title="見ています"
                              data-emoji="👀"
                              data-search="見ています eyes 確認中"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👀</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ロケット"
                              title="ロケット"
                              data-emoji="🚀"
                              data-search="ロケット rocket 公開 出発"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🚀</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="完了"
                              title="完了"
                              data-emoji="✅"
                              data-search="完了 done チェック 済み"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ✅
                            </button>
                          </div>
                        </section>
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-empty-picker-group-1"
                        >
                          <h3 class="title" id="reactions-empty-picker-group-1">顔</h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="にっこり"
                              title="にっこり"
                              data-emoji="😀"
                              data-search="にっこり grin"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😀</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="うれし泣き"
                              title="うれし泣き"
                              data-emoji="😂"
                              data-search="うれし泣き joy 笑"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😂</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ほほえみ"
                              title="ほほえみ"
                              data-emoji="😊"
                              data-search="ほほえみ blush"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😊</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="目がハート"
                              title="目がハート"
                              data-emoji="😍"
                              data-search="目がハート love"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😍</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="考え中"
                              title="考え中"
                              data-emoji="🤔"
                              data-search="考え中 thinking うーん"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🤔</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="驚き"
                              title="驚き"
                              data-emoji="😮"
                              data-search="驚き wow えっ"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😮</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="悲しい"
                              title="悲しい"
                              data-emoji="😢"
                              data-search="悲しい sad 涙"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😢</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="冷や汗"
                              title="冷や汗"
                              data-emoji="😅"
                              data-search="冷や汗 sweat 苦笑"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😅</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="サングラス"
                              title="サングラス"
                              data-emoji="😎"
                              data-search="サングラス cool"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😎</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="パーティー"
                              title="パーティー"
                              data-emoji="🥳"
                              data-search="パーティー party お祝い"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🥳</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="眠い"
                              title="眠い"
                              data-emoji="😴"
                              data-search="眠い sleep"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😴</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="少しほほえみ"
                              title="少しほほえみ"
                              data-emoji="🙂"
                              data-search="少しほほえみ slight smile"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🙂
                            </button>
                          </div>
                        </section>
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-empty-picker-group-2"
                        >
                          <h3 class="title" id="reactions-empty-picker-group-2">手</h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="拍手"
                              title="拍手"
                              data-emoji="👏"
                              data-search="拍手 clap すごい"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👏</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="よくない"
                              title="よくない"
                              data-emoji="👎"
                              data-search="よくない bad 反対"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👎</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="オーケー"
                              title="オーケー"
                              data-emoji="👌"
                              data-search="オーケー ok"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ピース"
                              title="ピース"
                              data-emoji="✌️"
                              data-search="ピース peace victory"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ✌️</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ばんざい"
                              title="ばんざい"
                              data-emoji="🙌"
                              data-search="ばんざい hooray やった"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🙌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="手を振る"
                              title="手を振る"
                              data-emoji="👋"
                              data-search="手を振る wave こんにちは さようなら"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👋</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="力こぶ"
                              title="力こぶ"
                              data-emoji="💪"
                              data-search="力こぶ strong がんばる"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              💪</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="握手"
                              title="握手"
                              data-emoji="🤝"
                              data-search="握手 handshake 合意"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🤝
                            </button>
                          </div>
                        </section>
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-empty-picker-group-3"
                        >
                          <h3 class="title" id="reactions-empty-picker-group-3">
                            物と記号
                          </h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="炎"
                              title="炎"
                              data-emoji="🔥"
                              data-search="炎 fire 熱い"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🔥</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="星"
                              title="星"
                              data-emoji="⭐"
                              data-search="星 star お気に入り"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ⭐</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ひらめき"
                              title="ひらめき"
                              data-emoji="💡"
                              data-search="ひらめき idea 電球"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              💡</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ピン"
                              title="ピン"
                              data-emoji="📌"
                              data-search="ピン pin 固定"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              📌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="クリップ"
                              title="クリップ"
                              data-emoji="📎"
                              data-search="クリップ clip 添付"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              📎</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="時計"
                              title="時計"
                              data-emoji="⏰"
                              data-search="時計 alarm 締め切り"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ⏰</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="コーヒー"
                              title="コーヒー"
                              data-emoji="☕"
                              data-search="コーヒー coffee 休憩"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ☕</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="的"
                              title="的"
                              data-emoji="🎯"
                              data-search="的 target 目標"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🎯</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="注意"
                              title="注意"
                              data-emoji="⚠️"
                              data-search="注意 warning"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ⚠️</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="質問"
                              title="質問"
                              data-emoji="❓"
                              data-search="質問 question はてな"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ❓</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="バツ"
                              title="バツ"
                              data-emoji="❌"
                              data-search="バツ no だめ"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ❌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="満点"
                              title="満点"
                              data-emoji="💯"
                              data-search="満点 100 完璧"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              💯
                            </button>
                          </div>
                        </section>
                        <p class="empty" data-emoji-picker-target="empty" hidden="">
                          当てはまる絵文字はありません
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        ><span class="label"
          ><span class="title">読むだけ（押せないリアクション）</span></span
        >
      </summary>
      <div class="body">
        <div class="rx-reactions">
          <ul aria-label="読むだけのリアクション" data-reactions-target="list">
            <li>
              <span class="reaction" data-mine="true" title="田中 遥、自分"
                ><span class="content" aria-hidden="true">👍</span
                ><span class="count" aria-hidden="true">2</span
                ><span class="rx-visually-hidden">いいね：田中 遥、自分</span></span
              >
            </li>
            <li>
              <span class="reaction" title="佐藤 健"
                ><span class="content" aria-hidden="true">🎉</span
                ><span class="count" aria-hidden="true">1</span
                ><span class="rx-visually-hidden">お祝い：佐藤 健</span></span
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
        ><span class="label"><span class="title">狭い場所：折り返す</span></span>
      </summary>
      <div class="body">
        <div style="max-inline-size: 12rem">
          <div
            class="rx-reactions"
            data-controller="reactions"
            data-reactions-me-value="自分"
            data-action="emoji-picker:pick-&gt;reactions#pick"
          >
            <ul aria-label="狭い場所のリアクション" data-reactions-target="list">
              <li>
                <button
                  type="button"
                  class="reaction"
                  aria-pressed="false"
                  data-mine="false"
                  aria-label="とても助かりました、ありがとうございます：田中 遥"
                  title="田中 遥"
                  data-content="とても助かりました、ありがとうございます"
                  data-by='["田中 遥"]'
                  data-action="reactions#toggle"
                >
                  <span class="content" aria-hidden="true"
                    >とても助かりました、ありがとうございます</span
                  ><span class="count" aria-hidden="true">1</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="reaction"
                  aria-pressed="false"
                  data-mine="false"
                  aria-label="ロケット：佐藤 健"
                  title="佐藤 健"
                  data-content="🚀"
                  data-name="ロケット"
                  data-by='["佐藤 健"]'
                  data-action="reactions#toggle"
                >
                  <span class="content" aria-hidden="true">🚀</span
                  ><span class="count" aria-hidden="true">1</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="reaction"
                  aria-pressed="false"
                  data-mine="false"
                  aria-label="いいね：森 美咲"
                  title="森 美咲"
                  data-content="👍"
                  data-name="いいね"
                  data-by='["森 美咲"]'
                  data-action="reactions#toggle"
                >
                  <span class="content" aria-hidden="true">👍</span
                  ><span class="count" aria-hidden="true">1</span>
                </button>
              </li>
            </ul>
            <div class="rx-popover" data-controller="popover" data-align="start">
              <span
                class="rx-tooltip"
                data-controller="tooltip"
                data-tooltip-delay-value="150"
                ><button
                  popovertarget="reactions-narrow"
                  style="
                    anchor-name:
                      --rx-tooltip-72-65-61-63-74-69-6f-6e-73-2d-6e-61-72-72-6f-77-2d-74-6f-6f-6c-74-69-70,
                      --rx-popover-72-65-61-63-74-69-6f-6e-73-2d-6e-61-72-72-6f-77;
                  "
                  data-popover-target="trigger"
                  data-tooltip-target="trigger"
                  aria-haspopup="dialog"
                  aria-controls="reactions-narrow"
                  aria-label="リアクションを追加"
                  data-icon-only="true"
                  class="rx-button"
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
                    <use href="/assets/rx-icons.svg#rx-smiley"></use>
                  </svg></button
                ><span
                  id="reactions-narrow-tooltip"
                  class="content rx-overlay"
                  role="tooltip"
                  popover="manual"
                  data-tooltip-target="content"
                  style="
                    position-anchor: --rx-tooltip-72-65-61-63-74-69-6f-6e-73-2d-6e-61-72-72-6f-77-2d-74-6f-6f-6c-74-69-70;
                  "
                  >リアクションを追加</span
                ></span
              >
              <div
                id="reactions-narrow"
                popover="auto"
                class="panel rx-overlay"
                data-placement="anchor"
                style="
                  --rx-overlay-anchor: --rx-popover-72-65-61-63-74-69-6f-6e-73-2d-6e-61-72-72-6f-77;
                "
                data-popover-target="panel"
                data-align="start"
                data-size="default"
                role="dialog"
                aria-labelledby="reactions-narrow-title"
              >
                <header class="heading">
                  <div class="heading-row">
                    <h3
                      id="reactions-narrow-title"
                      class="rx-visually-hidden"
                      tabindex="-1"
                    >
                      リアクションを追加
                    </h3>
                    <span class="close"
                      ><button
                        popovertarget="reactions-narrow"
                        popovertargetaction="hide"
                        data-icon-only="true"
                        aria-label="閉じる"
                        class="rx-button"
                        type="button"
                        data-variant="primary"
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
                        </svg></button
                    ></span>
                  </div>
                </header>
                <div class="body">
                  <div class="add">
                    <div class="rx-input-group text">
                      <div class="control" data-size="default">
                        <input
                          maxlength="16"
                          autocomplete="off"
                          autofocus=""
                          aria-label="リアクションを入力"
                          placeholder="リアクションを入力…"
                          data-reactions-target="text"
                          data-action="keydown.enter-&gt;reactions#addText"
                          id="reactions-narrow-text"
                          data-size="default"
                          class="rx-input"
                        />
                      </div>
                      <button
                        data-action="reactions#addText"
                        class="rx-button"
                        type="button"
                        data-variant="secondary"
                        data-size="default"
                      >
                        追加
                      </button>
                    </div>
                    <div
                      class="rx-emoji-picker"
                      role="group"
                      aria-label="絵文字を選ぶ"
                      data-controller="emoji-picker"
                    >
                      <div class="rx-input-group">
                        <div class="control" data-size="default">
                          <span class="affix" id="reactions-narrow-picker-search-prefix"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-search"
                              ></use></svg></span
                          ><input
                            type="search"
                            aria-label="絵文字を探す…"
                            placeholder="絵文字を探す…"
                            autocomplete="off"
                            data-emoji-picker-target="input"
                            data-action="input-&gt;emoji-picker#filter"
                            id="reactions-narrow-picker-search"
                            data-size="default"
                            aria-describedby="reactions-narrow-picker-search-prefix"
                            class="rx-input"
                          />
                        </div>
                      </div>
                      <div class="groups" data-action="keydown-&gt;emoji-picker#move">
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-narrow-picker-group-0"
                        >
                          <h3 class="title" id="reactions-narrow-picker-group-0">
                            よく使う
                          </h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="0"
                              aria-label="いいね"
                              title="いいね"
                              data-emoji="👍"
                              data-search="いいね good 賛成 了解"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👍</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="お祝い"
                              title="お祝い"
                              data-emoji="🎉"
                              data-search="お祝い party おめでとう"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🎉</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ハート"
                              title="ハート"
                              data-emoji="❤️"
                              data-search="ハート heart 好き"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ❤️</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="笑顔"
                              title="笑顔"
                              data-emoji="😄"
                              data-search="笑顔 smile うれしい"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😄</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="お願い"
                              title="お願い"
                              data-emoji="🙏"
                              data-search="お願い thanks ありがとう 感謝"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🙏</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="見ています"
                              title="見ています"
                              data-emoji="👀"
                              data-search="見ています eyes 確認中"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👀</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ロケット"
                              title="ロケット"
                              data-emoji="🚀"
                              data-search="ロケット rocket 公開 出発"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🚀</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="完了"
                              title="完了"
                              data-emoji="✅"
                              data-search="完了 done チェック 済み"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ✅
                            </button>
                          </div>
                        </section>
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-narrow-picker-group-1"
                        >
                          <h3 class="title" id="reactions-narrow-picker-group-1">顔</h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="にっこり"
                              title="にっこり"
                              data-emoji="😀"
                              data-search="にっこり grin"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😀</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="うれし泣き"
                              title="うれし泣き"
                              data-emoji="😂"
                              data-search="うれし泣き joy 笑"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😂</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ほほえみ"
                              title="ほほえみ"
                              data-emoji="😊"
                              data-search="ほほえみ blush"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😊</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="目がハート"
                              title="目がハート"
                              data-emoji="😍"
                              data-search="目がハート love"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😍</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="考え中"
                              title="考え中"
                              data-emoji="🤔"
                              data-search="考え中 thinking うーん"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🤔</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="驚き"
                              title="驚き"
                              data-emoji="😮"
                              data-search="驚き wow えっ"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😮</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="悲しい"
                              title="悲しい"
                              data-emoji="😢"
                              data-search="悲しい sad 涙"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😢</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="冷や汗"
                              title="冷や汗"
                              data-emoji="😅"
                              data-search="冷や汗 sweat 苦笑"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😅</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="サングラス"
                              title="サングラス"
                              data-emoji="😎"
                              data-search="サングラス cool"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😎</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="パーティー"
                              title="パーティー"
                              data-emoji="🥳"
                              data-search="パーティー party お祝い"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🥳</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="眠い"
                              title="眠い"
                              data-emoji="😴"
                              data-search="眠い sleep"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😴</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="少しほほえみ"
                              title="少しほほえみ"
                              data-emoji="🙂"
                              data-search="少しほほえみ slight smile"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🙂
                            </button>
                          </div>
                        </section>
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-narrow-picker-group-2"
                        >
                          <h3 class="title" id="reactions-narrow-picker-group-2">手</h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="拍手"
                              title="拍手"
                              data-emoji="👏"
                              data-search="拍手 clap すごい"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👏</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="よくない"
                              title="よくない"
                              data-emoji="👎"
                              data-search="よくない bad 反対"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👎</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="オーケー"
                              title="オーケー"
                              data-emoji="👌"
                              data-search="オーケー ok"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ピース"
                              title="ピース"
                              data-emoji="✌️"
                              data-search="ピース peace victory"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ✌️</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ばんざい"
                              title="ばんざい"
                              data-emoji="🙌"
                              data-search="ばんざい hooray やった"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🙌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="手を振る"
                              title="手を振る"
                              data-emoji="👋"
                              data-search="手を振る wave こんにちは さようなら"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👋</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="力こぶ"
                              title="力こぶ"
                              data-emoji="💪"
                              data-search="力こぶ strong がんばる"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              💪</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="握手"
                              title="握手"
                              data-emoji="🤝"
                              data-search="握手 handshake 合意"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🤝
                            </button>
                          </div>
                        </section>
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-narrow-picker-group-3"
                        >
                          <h3 class="title" id="reactions-narrow-picker-group-3">
                            物と記号
                          </h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="炎"
                              title="炎"
                              data-emoji="🔥"
                              data-search="炎 fire 熱い"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🔥</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="星"
                              title="星"
                              data-emoji="⭐"
                              data-search="星 star お気に入り"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ⭐</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ひらめき"
                              title="ひらめき"
                              data-emoji="💡"
                              data-search="ひらめき idea 電球"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              💡</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ピン"
                              title="ピン"
                              data-emoji="📌"
                              data-search="ピン pin 固定"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              📌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="クリップ"
                              title="クリップ"
                              data-emoji="📎"
                              data-search="クリップ clip 添付"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              📎</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="時計"
                              title="時計"
                              data-emoji="⏰"
                              data-search="時計 alarm 締め切り"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ⏰</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="コーヒー"
                              title="コーヒー"
                              data-emoji="☕"
                              data-search="コーヒー coffee 休憩"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ☕</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="的"
                              title="的"
                              data-emoji="🎯"
                              data-search="的 target 目標"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🎯</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="注意"
                              title="注意"
                              data-emoji="⚠️"
                              data-search="注意 warning"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ⚠️</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="質問"
                              title="質問"
                              data-emoji="❓"
                              data-search="質問 question はてな"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ❓</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="バツ"
                              title="バツ"
                              data-emoji="❌"
                              data-search="バツ no だめ"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ❌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="満点"
                              title="満点"
                              data-emoji="💯"
                              data-search="満点 100 完璧"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              💯
                            </button>
                          </div>
                        </section>
                        <p class="empty" data-emoji-picker-target="empty" hidden="">
                          当てはまる絵文字はありません
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        ><span class="label"><span class="title">右から左に読む場合</span></span>
      </summary>
      <div class="body">
        <div dir="rtl" lang="ar">
          <div
            class="rx-reactions"
            data-controller="reactions"
            data-reactions-me-value="أنا"
            data-action="emoji-picker:pick-&gt;reactions#pick"
          >
            <ul aria-label="التفاعلات" data-reactions-target="list">
              <li>
                <button
                  type="button"
                  class="reaction"
                  aria-pressed="true"
                  data-mine="true"
                  aria-label="إعجاب：هارو、أنا"
                  title="هارو、أنا"
                  data-content="👍"
                  data-name="إعجاب"
                  data-by='["هارو","أنا"]'
                  data-action="reactions#toggle"
                >
                  <span class="content" aria-hidden="true">👍</span
                  ><span class="count" aria-hidden="true">2</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="reaction"
                  aria-pressed="false"
                  data-mine="false"
                  aria-label="رائع：سارة"
                  title="سارة"
                  data-content="رائع"
                  data-by='["سارة"]'
                  data-action="reactions#toggle"
                >
                  <span class="content" aria-hidden="true">رائع</span
                  ><span class="count" aria-hidden="true">1</span>
                </button>
              </li>
            </ul>
            <div class="rx-popover" data-controller="popover" data-align="start">
              <span
                class="rx-tooltip"
                data-controller="tooltip"
                data-tooltip-delay-value="150"
                ><button
                  popovertarget="reactions-rtl"
                  style="
                    anchor-name:
                      --rx-tooltip-72-65-61-63-74-69-6f-6e-73-2d-72-74-6c-2d-74-6f-6f-6c-74-69-70,
                      --rx-popover-72-65-61-63-74-69-6f-6e-73-2d-72-74-6c;
                  "
                  data-popover-target="trigger"
                  data-tooltip-target="trigger"
                  aria-haspopup="dialog"
                  aria-controls="reactions-rtl"
                  aria-label="إضافة تفاعل"
                  data-icon-only="true"
                  class="rx-button"
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
                    <use href="/assets/rx-icons.svg#rx-smiley"></use>
                  </svg></button
                ><span
                  id="reactions-rtl-tooltip"
                  class="content rx-overlay"
                  role="tooltip"
                  popover="manual"
                  data-tooltip-target="content"
                  style="
                    position-anchor: --rx-tooltip-72-65-61-63-74-69-6f-6e-73-2d-72-74-6c-2d-74-6f-6f-6c-74-69-70;
                  "
                  >إضافة تفاعل</span
                ></span
              >
              <div
                id="reactions-rtl"
                popover="auto"
                class="panel rx-overlay"
                data-placement="anchor"
                style="
                  --rx-overlay-anchor: --rx-popover-72-65-61-63-74-69-6f-6e-73-2d-72-74-6c;
                "
                data-popover-target="panel"
                data-align="start"
                data-size="default"
                role="dialog"
                aria-labelledby="reactions-rtl-title"
              >
                <header class="heading">
                  <div class="heading-row">
                    <h3
                      id="reactions-rtl-title"
                      class="rx-visually-hidden"
                      tabindex="-1"
                    >
                      إضافة تفاعل
                    </h3>
                    <span class="close"
                      ><button
                        popovertarget="reactions-rtl"
                        popovertargetaction="hide"
                        data-icon-only="true"
                        aria-label="閉じる"
                        class="rx-button"
                        type="button"
                        data-variant="primary"
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
                        </svg></button
                    ></span>
                  </div>
                </header>
                <div class="body">
                  <div class="add">
                    <div class="rx-input-group text">
                      <div class="control" data-size="default">
                        <input
                          maxlength="16"
                          autocomplete="off"
                          autofocus=""
                          aria-label="リアクションを入力"
                          placeholder="リアクションを入力…"
                          data-reactions-target="text"
                          data-action="keydown.enter-&gt;reactions#addText"
                          id="reactions-rtl-text"
                          data-size="default"
                          class="rx-input"
                        />
                      </div>
                      <button
                        data-action="reactions#addText"
                        class="rx-button"
                        type="button"
                        data-variant="secondary"
                        data-size="default"
                      >
                        追加
                      </button>
                    </div>
                    <div
                      class="rx-emoji-picker"
                      role="group"
                      aria-label="絵文字を選ぶ"
                      data-controller="emoji-picker"
                    >
                      <div class="rx-input-group">
                        <div class="control" data-size="default">
                          <span class="affix" id="reactions-rtl-picker-search-prefix"
                            ><svg
                              class="rx-icon"
                              viewBox="0 0 256 256"
                              fill="currentColor"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <use
                                href="/assets/rx-icons.svg#rx-search"
                              ></use></svg></span
                          ><input
                            type="search"
                            aria-label="絵文字を探す…"
                            placeholder="絵文字を探す…"
                            autocomplete="off"
                            data-emoji-picker-target="input"
                            data-action="input-&gt;emoji-picker#filter"
                            id="reactions-rtl-picker-search"
                            data-size="default"
                            aria-describedby="reactions-rtl-picker-search-prefix"
                            class="rx-input"
                          />
                        </div>
                      </div>
                      <div class="groups" data-action="keydown-&gt;emoji-picker#move">
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-rtl-picker-group-0"
                        >
                          <h3 class="title" id="reactions-rtl-picker-group-0">
                            よく使う
                          </h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="0"
                              aria-label="いいね"
                              title="いいね"
                              data-emoji="👍"
                              data-search="いいね good 賛成 了解"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👍</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="お祝い"
                              title="お祝い"
                              data-emoji="🎉"
                              data-search="お祝い party おめでとう"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🎉</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ハート"
                              title="ハート"
                              data-emoji="❤️"
                              data-search="ハート heart 好き"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ❤️</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="笑顔"
                              title="笑顔"
                              data-emoji="😄"
                              data-search="笑顔 smile うれしい"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😄</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="お願い"
                              title="お願い"
                              data-emoji="🙏"
                              data-search="お願い thanks ありがとう 感謝"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🙏</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="見ています"
                              title="見ています"
                              data-emoji="👀"
                              data-search="見ています eyes 確認中"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👀</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ロケット"
                              title="ロケット"
                              data-emoji="🚀"
                              data-search="ロケット rocket 公開 出発"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🚀</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="完了"
                              title="完了"
                              data-emoji="✅"
                              data-search="完了 done チェック 済み"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ✅
                            </button>
                          </div>
                        </section>
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-rtl-picker-group-1"
                        >
                          <h3 class="title" id="reactions-rtl-picker-group-1">顔</h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="にっこり"
                              title="にっこり"
                              data-emoji="😀"
                              data-search="にっこり grin"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😀</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="うれし泣き"
                              title="うれし泣き"
                              data-emoji="😂"
                              data-search="うれし泣き joy 笑"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😂</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ほほえみ"
                              title="ほほえみ"
                              data-emoji="😊"
                              data-search="ほほえみ blush"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😊</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="目がハート"
                              title="目がハート"
                              data-emoji="😍"
                              data-search="目がハート love"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😍</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="考え中"
                              title="考え中"
                              data-emoji="🤔"
                              data-search="考え中 thinking うーん"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🤔</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="驚き"
                              title="驚き"
                              data-emoji="😮"
                              data-search="驚き wow えっ"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😮</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="悲しい"
                              title="悲しい"
                              data-emoji="😢"
                              data-search="悲しい sad 涙"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😢</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="冷や汗"
                              title="冷や汗"
                              data-emoji="😅"
                              data-search="冷や汗 sweat 苦笑"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😅</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="サングラス"
                              title="サングラス"
                              data-emoji="😎"
                              data-search="サングラス cool"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😎</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="パーティー"
                              title="パーティー"
                              data-emoji="🥳"
                              data-search="パーティー party お祝い"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🥳</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="眠い"
                              title="眠い"
                              data-emoji="😴"
                              data-search="眠い sleep"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              😴</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="少しほほえみ"
                              title="少しほほえみ"
                              data-emoji="🙂"
                              data-search="少しほほえみ slight smile"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🙂
                            </button>
                          </div>
                        </section>
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-rtl-picker-group-2"
                        >
                          <h3 class="title" id="reactions-rtl-picker-group-2">手</h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="拍手"
                              title="拍手"
                              data-emoji="👏"
                              data-search="拍手 clap すごい"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👏</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="よくない"
                              title="よくない"
                              data-emoji="👎"
                              data-search="よくない bad 反対"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👎</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="オーケー"
                              title="オーケー"
                              data-emoji="👌"
                              data-search="オーケー ok"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ピース"
                              title="ピース"
                              data-emoji="✌️"
                              data-search="ピース peace victory"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ✌️</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ばんざい"
                              title="ばんざい"
                              data-emoji="🙌"
                              data-search="ばんざい hooray やった"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🙌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="手を振る"
                              title="手を振る"
                              data-emoji="👋"
                              data-search="手を振る wave こんにちは さようなら"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              👋</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="力こぶ"
                              title="力こぶ"
                              data-emoji="💪"
                              data-search="力こぶ strong がんばる"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              💪</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="握手"
                              title="握手"
                              data-emoji="🤝"
                              data-search="握手 handshake 合意"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🤝
                            </button>
                          </div>
                        </section>
                        <section
                          class="group"
                          data-emoji-picker-target="group"
                          aria-labelledby="reactions-rtl-picker-group-3"
                        >
                          <h3 class="title" id="reactions-rtl-picker-group-3">
                            物と記号
                          </h3>
                          <div class="grid">
                            <button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="炎"
                              title="炎"
                              data-emoji="🔥"
                              data-search="炎 fire 熱い"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🔥</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="星"
                              title="星"
                              data-emoji="⭐"
                              data-search="星 star お気に入り"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ⭐</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ひらめき"
                              title="ひらめき"
                              data-emoji="💡"
                              data-search="ひらめき idea 電球"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              💡</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="ピン"
                              title="ピン"
                              data-emoji="📌"
                              data-search="ピン pin 固定"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              📌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="クリップ"
                              title="クリップ"
                              data-emoji="📎"
                              data-search="クリップ clip 添付"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              📎</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="時計"
                              title="時計"
                              data-emoji="⏰"
                              data-search="時計 alarm 締め切り"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ⏰</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="コーヒー"
                              title="コーヒー"
                              data-emoji="☕"
                              data-search="コーヒー coffee 休憩"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ☕</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="的"
                              title="的"
                              data-emoji="🎯"
                              data-search="的 target 目標"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              🎯</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="注意"
                              title="注意"
                              data-emoji="⚠️"
                              data-search="注意 warning"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ⚠️</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="質問"
                              title="質問"
                              data-emoji="❓"
                              data-search="質問 question はてな"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ❓</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="バツ"
                              title="バツ"
                              data-emoji="❌"
                              data-search="バツ no だめ"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              ❌</button
                            ><button
                              type="button"
                              class="emoji"
                              tabindex="-1"
                              aria-label="満点"
                              title="満点"
                              data-emoji="💯"
                              data-search="満点 100 完璧"
                              data-emoji-picker-target="emoji"
                              data-action="emoji-picker#pick"
                            >
                              💯
                            </button>
                          </div>
                        </section>
                        <p class="empty" data-emoji-picker-target="empty" hidden="">
                          当てはまる絵文字はありません
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
