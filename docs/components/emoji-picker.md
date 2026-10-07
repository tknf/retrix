<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# EmojiPicker

絵文字を検索して選ぶパネルです。

## 使いどころ

- リアクションや状態のアイコンとして、絵文字を一つ探して選ぶ時に使います。
- メッセージなどへリアクションを付ける時は、この絵文字パネルを中に持つ `Reactions` を使います。決まった少数の絵文字から選ぶだけなら、`groups` を絞って渡します。

## 使い方

`id` を渡して置きます。上に検索欄、下に種類ごとの見出しと絵文字の格子を並べます。見出しは小さな灰色の太字で、絵文字は枠も影も無い平らなセルに置き、ホバーすると淡い面を出し、押すと内側へへこませます。`groups` を渡さなければ、リアクションによく使う40個（`defaultEmojiGroups`）を並べます。全ての絵文字を並べたい時や、絵文字を絞りたい時は `groups` で渡します。

検索欄に打った言葉で、絵文字の `name` と `keywords` を絞り込みます。大文字と小文字は区別しません。当てはまる絵文字の無い種類は見出しごと隠し、一つも無い時は `emptyLabel` を出します。

絵文字を押すか、Enter・Spaceで選ぶと `emoji-picker:pick` を出します。絵文字パネルは選んだ後も開いたままで、選択の状態も持ちません。閉じる・付けるなどの続きは利用側がこのイベントを受けて行います。

絵文字パネル自体は開閉を持たないので、`Popover` の中に置くか、ページにそのまま置きます。`Popover` の中に置く時は `autofocus` を渡すと、開いた時に検索欄へ移り、すぐ打ち始められます。

JavaScriptが無い時は、格子と検索欄を表示するだけで、絞り込みと、選択時のイベントの発火は行いません。

## キーボード

| キー         | 動作                                                                                                                                                                   |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tab          | 格子へは一か所だけで入ります。初めは先頭の絵文字、絞り込んだ後は残った先頭の絵文字です。                                                                               |
| ←・→         | 前後の絵文字へ移ります。右から左に読む時は逆です。                                                                                                                     |
| ↑・↓         | 上・下の行の同じ列の絵文字へ移ります。行は表示中の位置から数え、種類をまたぐ時も列をそろえます。移り先の行が短い時はその行の最後へ移り、最初・最後の行では動きません。 |
| Home・End    | 表示中の最初・最後の絵文字へ移ります。                                                                                                                                 |
| Enter・Space | フォーカスのある絵文字を選びます。                                                                                                                                     |

## アクセシビリティ

- 絵文字パネルは `role="group"` で、`label` を名前にします。検索欄は `placeholder` を名前にします。
- 種類ごとのまとまりは見出しを名前にします。見出しは `h3` で固定です。
- 絵文字のボタンは `name` を名前にし、ホバーすると同じ名前を出します。絵文字そのものではなく名前を読み上げます。

## イベント

| イベント            | 内容                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------- |
| `emoji-picker:pick` | 絵文字を選んだ時に出します。detailは `{ emoji, name }` で、選んだ絵文字とその名前です。 |

## API

### EmojiPicker

絵文字を検索して選ぶ絵文字パネル。上に検索欄、下に種類ごとの絵文字のグリッドを並べる。選ぶとemoji-picker:pickイベントを発火し、絵文字と名前を渡す。Popoverの中に置いてリアクションを追加する時などに使う。グリッドの中は矢印キーで移動し、Enterかクリックで選ぶ。Tabでグリッドへ入る位置は一か所だけにする。

| 名前          | 型                      | 既定値                           | 説明                                                                                     |
| ------------- | ----------------------- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| `id`（必須）  | `string`                |                                  | 検索欄と種類の見出しのIDの接頭辞。ページ内で一意にする。                                 |
| `label`       | `string`                | `"絵文字を選ぶ"`                 | 絵文字パネル全体（role="group"）の読み上げ名。                                           |
| `groups`      | `readonly EmojiGroup[]` | `defaultEmojiGroups`             | 種類ごとの絵文字。渡さなければリアクションによく使う40個（defaultEmojiGroups）を並べる。 |
| `placeholder` | `string`                | `"絵文字を探す…"`                | 検索欄のプレースホルダー。欄の読み上げ名にも使う。                                       |
| `emptyLabel`  | `string`                | `"当てはまる絵文字はありません"` | 検索した言葉に当てはまる絵文字が無い時に出す文。                                         |
| `autofocus`   | `boolean`               | `false`                          | Popoverの中に置く時。開いた時に検索欄へフォーカスを移す。                                |

ほかに、`<div>`へ標準のHTML属性を渡せます。

登録するcontroller：`emoji-picker`（`EmojiPickerController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/icon.css`、`components/input-group.css`、`components/emoji-picker.css`

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
import { EmojiPicker, Popover, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <EmojiPicker id="emoji-picker-main" />
    <DisclosureGroup label="置き場所・中身・狭い場所・右から左">
      <Disclosure summary="Popoverで開く（リアクションを追加する時の形）" open>
        <Popover
          id="emoji-picker-popover"
          label="絵文字を選ぶ"
          icon="smiley"
          size="compact"
          initialFocus="content"
        >
          <EmojiPicker id="emoji-picker-in-popover" autofocus />
        </Popover>
      </Disclosure>
      <Disclosure summary="種類を絞った絵文字パネル">
        <EmojiPicker
          id="emoji-picker-status"
          label="状態を選ぶ"
          placeholder="状態を探す…"
          groups={[
            {
              label: "状態",
              emojis: [
                { emoji: "✅", name: "完了", keywords: ["done"] },
                { emoji: "🚧", name: "作業中", keywords: ["wip"] },
                { emoji: "⏸️", name: "保留", keywords: ["pause"] },
                { emoji: "❌", name: "中止", keywords: ["cancel"] },
              ],
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：列が減る">
        <div style="max-inline-size: 12rem">
          <EmojiPicker id="emoji-picker-narrow" />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <EmojiPicker
            id="emoji-picker-rtl"
            label="اختر رمزًا تعبيريًا"
            placeholder="ابحث عن رمز…"
            emptyLabel="لا توجد رموز مطابقة"
            groups={[
              {
                label: "شائع",
                emojis: [
                  { emoji: "👍", name: "إعجاب" },
                  { emoji: "🎉", name: "احتفال" },
                  { emoji: "❤️", name: "قلب" },
                  { emoji: "🙏", name: "شكرًا" },
                ],
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
  <div
    class="rx-emoji-picker"
    role="group"
    aria-label="絵文字を選ぶ"
    data-controller="emoji-picker"
  >
    <div class="rx-input-group">
      <div class="control" data-size="default">
        <span class="affix" id="emoji-picker-main-search-prefix"
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
          id="emoji-picker-main-search"
          data-size="default"
          aria-describedby="emoji-picker-main-search-prefix"
          class="rx-input"
        />
      </div>
    </div>
    <div class="groups" data-action="keydown-&gt;emoji-picker#move">
      <section
        class="group"
        data-emoji-picker-target="group"
        aria-labelledby="emoji-picker-main-group-0"
      >
        <h3 class="title" id="emoji-picker-main-group-0">よく使う</h3>
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
        aria-labelledby="emoji-picker-main-group-1"
      >
        <h3 class="title" id="emoji-picker-main-group-1">顔</h3>
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
        aria-labelledby="emoji-picker-main-group-2"
      >
        <h3 class="title" id="emoji-picker-main-group-2">手</h3>
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
        aria-labelledby="emoji-picker-main-group-3"
      >
        <h3 class="title" id="emoji-picker-main-group-3">物と記号</h3>
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
  <div
    class="rx-disclosure-group"
    role="group"
    aria-label="置き場所・中身・狭い場所・右から左"
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
          ><span class="title"
            >Popoverで開く（リアクションを追加する時の形）</span
          ></span
        >
      </summary>
      <div class="body">
        <div class="rx-popover" data-controller="popover" data-align="start">
          <button
            popovertarget="emoji-picker-popover"
            style="
              anchor-name: --rx-popover-65-6d-6f-6a-69-2d-70-69-63-6b-65-72-2d-70-6f-70-6f-76-65-72;
            "
            data-popover-target="trigger"
            aria-haspopup="dialog"
            aria-controls="emoji-picker-popover"
            class="rx-button"
            type="button"
            data-variant="secondary"
            data-size="default"
          >
            <svg
              class="rx-icon"
              viewBox="0 0 256 256"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <use href="/assets/rx-icons.svg#rx-smiley"></use></svg
            >絵文字を選ぶ
          </button>
          <div
            id="emoji-picker-popover"
            popover="auto"
            class="panel rx-overlay"
            data-placement="anchor"
            style="
              --rx-overlay-anchor: --rx-popover-65-6d-6f-6a-69-2d-70-69-63-6b-65-72-2d-70-6f-70-6f-76-65-72;
            "
            data-popover-target="panel"
            data-align="start"
            data-size="compact"
            role="dialog"
            aria-labelledby="emoji-picker-popover-title"
          >
            <header class="heading">
              <div class="heading-row">
                <h3 id="emoji-picker-popover-title" tabindex="-1">絵文字を選ぶ</h3>
                <span class="close"
                  ><button
                    popovertarget="emoji-picker-popover"
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
              <div
                class="rx-emoji-picker"
                role="group"
                aria-label="絵文字を選ぶ"
                data-controller="emoji-picker"
              >
                <div class="rx-input-group">
                  <div class="control" data-size="default">
                    <span class="affix" id="emoji-picker-in-popover-search-prefix"
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
                      autofocus=""
                      data-emoji-picker-target="input"
                      data-action="input-&gt;emoji-picker#filter"
                      id="emoji-picker-in-popover-search"
                      data-size="default"
                      aria-describedby="emoji-picker-in-popover-search-prefix"
                      class="rx-input"
                    />
                  </div>
                </div>
                <div class="groups" data-action="keydown-&gt;emoji-picker#move">
                  <section
                    class="group"
                    data-emoji-picker-target="group"
                    aria-labelledby="emoji-picker-in-popover-group-0"
                  >
                    <h3 class="title" id="emoji-picker-in-popover-group-0">よく使う</h3>
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
                    aria-labelledby="emoji-picker-in-popover-group-1"
                  >
                    <h3 class="title" id="emoji-picker-in-popover-group-1">顔</h3>
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
                    aria-labelledby="emoji-picker-in-popover-group-2"
                  >
                    <h3 class="title" id="emoji-picker-in-popover-group-2">手</h3>
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
                    aria-labelledby="emoji-picker-in-popover-group-3"
                  >
                    <h3 class="title" id="emoji-picker-in-popover-group-3">物と記号</h3>
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
        ><span class="label"><span class="title">種類を絞った絵文字パネル</span></span>
      </summary>
      <div class="body">
        <div
          class="rx-emoji-picker"
          role="group"
          aria-label="状態を選ぶ"
          data-controller="emoji-picker"
        >
          <div class="rx-input-group">
            <div class="control" data-size="default">
              <span class="affix" id="emoji-picker-status-search-prefix"
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
                aria-label="状態を探す…"
                placeholder="状態を探す…"
                autocomplete="off"
                data-emoji-picker-target="input"
                data-action="input-&gt;emoji-picker#filter"
                id="emoji-picker-status-search"
                data-size="default"
                aria-describedby="emoji-picker-status-search-prefix"
                class="rx-input"
              />
            </div>
          </div>
          <div class="groups" data-action="keydown-&gt;emoji-picker#move">
            <section
              class="group"
              data-emoji-picker-target="group"
              aria-labelledby="emoji-picker-status-group-0"
            >
              <h3 class="title" id="emoji-picker-status-group-0">状態</h3>
              <div class="grid">
                <button
                  type="button"
                  class="emoji"
                  tabindex="0"
                  aria-label="完了"
                  title="完了"
                  data-emoji="✅"
                  data-search="完了 done"
                  data-emoji-picker-target="emoji"
                  data-action="emoji-picker#pick"
                >
                  ✅</button
                ><button
                  type="button"
                  class="emoji"
                  tabindex="-1"
                  aria-label="作業中"
                  title="作業中"
                  data-emoji="🚧"
                  data-search="作業中 wip"
                  data-emoji-picker-target="emoji"
                  data-action="emoji-picker#pick"
                >
                  🚧</button
                ><button
                  type="button"
                  class="emoji"
                  tabindex="-1"
                  aria-label="保留"
                  title="保留"
                  data-emoji="⏸️"
                  data-search="保留 pause"
                  data-emoji-picker-target="emoji"
                  data-action="emoji-picker#pick"
                >
                  ⏸️</button
                ><button
                  type="button"
                  class="emoji"
                  tabindex="-1"
                  aria-label="中止"
                  title="中止"
                  data-emoji="❌"
                  data-search="中止 cancel"
                  data-emoji-picker-target="emoji"
                  data-action="emoji-picker#pick"
                >
                  ❌
                </button>
              </div>
            </section>
            <p class="empty" data-emoji-picker-target="empty" hidden="">
              当てはまる絵文字はありません
            </p>
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
        ><span class="label"><span class="title">狭い場所：列が減る</span></span>
      </summary>
      <div class="body">
        <div style="max-inline-size: 12rem">
          <div
            class="rx-emoji-picker"
            role="group"
            aria-label="絵文字を選ぶ"
            data-controller="emoji-picker"
          >
            <div class="rx-input-group">
              <div class="control" data-size="default">
                <span class="affix" id="emoji-picker-narrow-search-prefix"
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
                  id="emoji-picker-narrow-search"
                  data-size="default"
                  aria-describedby="emoji-picker-narrow-search-prefix"
                  class="rx-input"
                />
              </div>
            </div>
            <div class="groups" data-action="keydown-&gt;emoji-picker#move">
              <section
                class="group"
                data-emoji-picker-target="group"
                aria-labelledby="emoji-picker-narrow-group-0"
              >
                <h3 class="title" id="emoji-picker-narrow-group-0">よく使う</h3>
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
                aria-labelledby="emoji-picker-narrow-group-1"
              >
                <h3 class="title" id="emoji-picker-narrow-group-1">顔</h3>
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
                aria-labelledby="emoji-picker-narrow-group-2"
              >
                <h3 class="title" id="emoji-picker-narrow-group-2">手</h3>
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
                aria-labelledby="emoji-picker-narrow-group-3"
              >
                <h3 class="title" id="emoji-picker-narrow-group-3">物と記号</h3>
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
            class="rx-emoji-picker"
            role="group"
            aria-label="اختر رمزًا تعبيريًا"
            data-controller="emoji-picker"
          >
            <div class="rx-input-group">
              <div class="control" data-size="default">
                <span class="affix" id="emoji-picker-rtl-search-prefix"
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
                  aria-label="ابحث عن رمز…"
                  placeholder="ابحث عن رمز…"
                  autocomplete="off"
                  data-emoji-picker-target="input"
                  data-action="input-&gt;emoji-picker#filter"
                  id="emoji-picker-rtl-search"
                  data-size="default"
                  aria-describedby="emoji-picker-rtl-search-prefix"
                  class="rx-input"
                />
              </div>
            </div>
            <div class="groups" data-action="keydown-&gt;emoji-picker#move">
              <section
                class="group"
                data-emoji-picker-target="group"
                aria-labelledby="emoji-picker-rtl-group-0"
              >
                <h3 class="title" id="emoji-picker-rtl-group-0">شائع</h3>
                <div class="grid">
                  <button
                    type="button"
                    class="emoji"
                    tabindex="0"
                    aria-label="إعجاب"
                    title="إعجاب"
                    data-emoji="👍"
                    data-search="إعجاب"
                    data-emoji-picker-target="emoji"
                    data-action="emoji-picker#pick"
                  >
                    👍</button
                  ><button
                    type="button"
                    class="emoji"
                    tabindex="-1"
                    aria-label="احتفال"
                    title="احتفال"
                    data-emoji="🎉"
                    data-search="احتفال"
                    data-emoji-picker-target="emoji"
                    data-action="emoji-picker#pick"
                  >
                    🎉</button
                  ><button
                    type="button"
                    class="emoji"
                    tabindex="-1"
                    aria-label="قلب"
                    title="قلب"
                    data-emoji="❤️"
                    data-search="قلب"
                    data-emoji-picker-target="emoji"
                    data-action="emoji-picker#pick"
                  >
                    ❤️</button
                  ><button
                    type="button"
                    class="emoji"
                    tabindex="-1"
                    aria-label="شكرًا"
                    title="شكرًا"
                    data-emoji="🙏"
                    data-search="شكرًا"
                    data-emoji-picker-target="emoji"
                    data-action="emoji-picker#pick"
                  >
                    🙏
                  </button>
                </div>
              </section>
              <p class="empty" data-emoji-picker-target="empty" hidden="">
                لا توجد رموز مطابقة
              </p>
            </div>
          </div>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
