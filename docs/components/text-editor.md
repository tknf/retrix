<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# TextEditor

書式ツールを並べた入力エリアです。

## 使いどころ

- 返信・日記・コメントなど、太字や箇条書きの付いた文の入力エリアを置く時に使います。
- 書式の要らない本文は `Textarea`、本文と添付・送信ボタンをまとめた入力エリアは `Composer` を使います。`Composer` の `editor` にこのコンポーネントを入れることもできます。

## 使い方

`id` と `label` を渡します。書式ツール（太字・斜体・取り消し線・リンク・見出し・引用・コード・箇条書き・番号付きの箇条書き・ファイルを添える・元に戻す・やり直す）を並べ、その下に入力エリアを置きます。全体は複数行の入力欄（`Textarea`）と同じ1pxの灰色（#c1c1c1）の枠と角丸5pxで囲み、影は付けません。フォーカスがある間は青い縁と淡い青の輪で示します。入力エリアの文字は続けて読む文章の大きさ（14px）です。ツールバーは淡い灰色の面で、罫線で入力エリアと分けます。書式ツールは控えめな `Button` と同じ平らな白・1pxの灰色の枠・下の1pxの影を持つボタンです。`tools` で並べるツールを選び、`"|"` で区切りを入れます。区切りは線を引かず、間隔だけで分けます。

`placement="bottom"` にするとツールバーを入力エリアの下に置きます。`actions` に渡した送信・下書きの保存などの操作は、ツールバーの末尾に置きます。

このコンポーネントは見た目とツールバーだけを持ち、特定のエディターに依存しません。書式を付ける動きは利用側のエディターに任せます。`editor` に任意のリッチテキストのエディターが描く入力エリア（`contenteditable` の要素）を渡し、ツールのボタンの `data-text-editor-tool`（`bold`・`italic`・`link`・`bullets` など）を読んでエディターの操作を呼びます。現在適用中の書式のツールに `data-active="true"` を付けると、オンのボタンと同じ平らな青緑の塗りに白い文字で示します。

`editor` を渡さなければ `textarea` を置きます。`name`・`placeholder`・`value`・`disabled` などの残りの属性は `textarea` に付き、`class` は外側の要素に付きます。`textarea` のままの時も、ツールを動かすのは利用側です（書式の記号を差し込むなど）。ツールを使わない時は `tools={[]}` にします。ツールも `actions` も無い時は、ツールバーを描きません。`disabled` はツールも押せなくし、入力エリアの面と枠はそのままにして文字だけを灰色にします。

ツールバーは `ToolbarController` を `toolbar` として登録して使います。書式を付ける動きのcontrollerは持ちません。送信する値は `textarea` の本文か、`editor` の側で用意した値です。JavaScriptが無い時は `textarea` に書いた文を送ります。

## キーボード

| キー         | 動作                                                                         |
| ------------ | ---------------------------------------------------------------------------- |
| Tab          | ツールバーへは一か所だけで入ります。                                         |
| ←・→         | 前後のツールへ移ります。端では反対の端へ回ります。右から左に読む時は逆です。 |
| Home・End    | 最初・最後の使えるツールへ移ります。                                         |
| Enter・Space | フォーカスのあるツールを押します。                                           |

## アクセシビリティ

- ツールバーは `role="toolbar"` で、「`label`の書式」を名前にし、`aria-controls` で `id` の入力エリアを指します。`editor` を渡す時は、入力エリアの要素に同じ `id` と、`aria-label` などの名前を付けます。
- ツールのボタンは名前を持ち、ホバーすると同じ名前を表示します。
- ツールバーは一つのTab停止点で、Tabで入ると前にいたツール（初めは先頭の使えるツール）に止まり、矢印キーでツールの間を移ります。`actions` の操作はツールとは別のTab停止点です。
- ツールはJavaScriptで動くものなので、controllerが付くまでは全てのツールを `tabindex="-1"` にして、Tabで止めません。

## API

### TextEditor

返信や日記、コメントに使う、書式ツールを並べた入力エリア。見た目とツールバーだけを持ち、特定のエディターには依存しない。書式を付ける動きは利用側のエディターに任せ、ツールのボタンのdata-text-editor-tool（"bold"など）を読んでエディターの操作を呼び、今の書式のツールには data-active="true"を付ける。textareaのままの時も、ツールを動かすのは利用側（記号を差し込むなど）。ツールを使わない時はtoolsを空にする。ツールも操作も無い時は、ツールバーを描かない。ツールバーはToolbarControllerで一つのTab停止点にし、矢印キーでツールの間を移る。ツールはJavaScriptで動くものなので、controllerが付くまではTabで止めない。

| 名前            | 型                                    | 既定値                                                                                                                                  | 説明                                                                                                                                                                                                           |
| --------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`（必須）    | `string`                              |                                                                                                                                         | 入力エリアのID。textareaに付け、ツールバーのaria-controlsが指す。 editorを渡す時は、その入力エリアの要素に同じIDを付ける。                                                                                     |
| `label`（必須） | `string`                              |                                                                                                                                         | 入力エリアの読み上げ名。ツールバーの名前（「〜の書式」）にも使う。editorを渡した時は入力エリアに付かない。                                                                                                     |
| `tools`         | `readonly (TextEditorTool \| "\|")[]` | `[ "bold", "italic", "strike", "link", "\|", "heading", "quote", "code", "bullets", "numbers", "\|", "attach", "\|", "undo", "redo", ]` | ツールバーに並べるツール。"\|"で区切りを入れる。                                                                                                                                                               |
| `placement`     | `"top" \| "bottom"`                   | `"top"`                                                                                                                                 | ツールを入力エリアの上（コメントなど、既定）と下（返信・日記など）のどちらに置くか。                                                                                                                           |
| `editor`        | `Child`                               |                                                                                                                                         | 入力エリアの代わりに置くエディター（リッチテキストエディターが描くcontenteditableの要素）。渡さなければtextareaを置く。ツールバーのidは`${id}-toolbar`。エディターとのつなぎ方は、下のTextEditorの説明を参照。 |
| `actions`       | `Child`                               |                                                                                                                                         | ツールバーの末尾に置く操作（送信・下書きの保存など）。                                                                                                                                                         |

ほかに、`<textarea>`へ標準のHTML属性を渡せます。

登録するcontroller：`toolbar`（`ToolbarController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/icon.css`、`components/text-editor.css`

#### `TextEditorTool`

値：`| "bold" | "italic" | "strike" | "link" | "heading" | "quote" | "code" | "bullets" | "numbers" | "attach" | "undo" | "redo"`

## コード

```tsx
import {
  TextEditor,
  Composer,
  SplitButton,
  Button,
  Disclosure,
  DisclosureGroup,
} from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <TextEditor
      id="comment-editor"
      label="コメント"
      name="comment"
      placeholder="コメントを書く…"
    />
    <DisclosureGroup label="置き方と書式ツールの違い">
      <Disclosure summary="書式ツールを下に置き、送る操作を並べる" open>
        <TextEditor
          id="reply-editor"
          label="返信"
          name="reply"
          placeholder="返信を書く…"
          placement="bottom"
          actions={
            <SplitButton
              id="reply-send"
              label="送る"
              type="submit"
              items={[
                { value: "schedule", label: "送る日時を決める" },
                { value: "draft", label: "下書きとして保存" },
              ]}
            />
          }
        />
      </Disclosure>
      <Disclosure summary="書式ツールを絞る">
        <TextEditor
          id="note-editor"
          label="メモ"
          name="note"
          placeholder="メモを書く…"
          tools={["bold", "italic", "link", "|", "bullets"]}
        />
      </Disclosure>
      <Disclosure summary="Composerの入力エリアに入れる">
        <Composer
          id="composer-with-editor"
          label="お知らせ"
          name="announcement"
          submitLabel="投稿する"
          editor={
            <TextEditor
              id="announcement-editor"
              label="お知らせ"
              name="announcement"
              placeholder="お知らせを書く…"
            />
          }
        />
      </Disclosure>
      <Disclosure summary="狭い場所：ツールバーは折り返す">
        <div style="max-inline-size: 18rem">
          <TextEditor
            id="narrow-editor"
            label="狭い場所のメモ"
            name="narrow"
            placeholder="書く…"
            actions={<Button size="compact">保存</Button>}
          />
        </div>
      </Disclosure>
      <Disclosure summary="使えない時・右から左に読む場合">
        <div class="rx-stack" data-space="small">
          <TextEditor
            id="disabled-editor"
            label="締め切ったコメント"
            name="closed"
            disabled
          />
          <div dir="rtl" lang="ar">
            <TextEditor
              id="rtl-editor"
              label="تعليق"
              name="rtl"
              placeholder="اكتب تعليقًا…"
            />
          </div>
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
  <div class="rx-text-editor" data-placement="top">
    <div
      class="toolbar"
      id="comment-editor-toolbar"
      role="toolbar"
      aria-label="コメントの書式"
      aria-controls="comment-editor"
      data-controller="toolbar"
    >
      <span class="group"
        ><button
          data-icon-only="true"
          aria-label="太字"
          title="太字"
          tabindex="-1"
          data-toolbar-target="control"
          data-text-editor-tool="bold"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-bold"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="斜体"
          title="斜体"
          tabindex="-1"
          data-toolbar-target="control"
          data-text-editor-tool="italic"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-italic"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="取り消し線"
          title="取り消し線"
          tabindex="-1"
          data-toolbar-target="control"
          data-text-editor-tool="strike"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-strike"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="リンク"
          title="リンク"
          tabindex="-1"
          data-toolbar-target="control"
          data-text-editor-tool="link"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-link"></use>
          </svg></button></span
      ><span class="group"
        ><button
          data-icon-only="true"
          aria-label="見出し"
          title="見出し"
          tabindex="-1"
          data-toolbar-target="control"
          data-text-editor-tool="heading"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-heading"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="引用"
          title="引用"
          tabindex="-1"
          data-toolbar-target="control"
          data-text-editor-tool="quote"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-quote"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="コード"
          title="コード"
          tabindex="-1"
          data-toolbar-target="control"
          data-text-editor-tool="code"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-code"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="箇条書き"
          title="箇条書き"
          tabindex="-1"
          data-toolbar-target="control"
          data-text-editor-tool="bullets"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-bullets"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="番号付きの箇条書き"
          title="番号付きの箇条書き"
          tabindex="-1"
          data-toolbar-target="control"
          data-text-editor-tool="numbers"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-numbers"></use>
          </svg></button></span
      ><span class="group"
        ><button
          data-icon-only="true"
          aria-label="ファイルを添える"
          title="ファイルを添える"
          tabindex="-1"
          data-toolbar-target="control"
          data-text-editor-tool="attach"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-attach"></use>
          </svg></button></span
      ><span class="group"
        ><button
          data-icon-only="true"
          aria-label="元に戻す"
          title="元に戻す"
          tabindex="-1"
          data-toolbar-target="control"
          data-text-editor-tool="undo"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-undo"></use>
          </svg></button
        ><button
          data-icon-only="true"
          aria-label="やり直す"
          title="やり直す"
          tabindex="-1"
          data-toolbar-target="control"
          data-text-editor-tool="redo"
          class="rx-button"
          type="button"
          data-variant="link"
          data-size="compact"
        >
          <svg
            class="rx-icon"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <use href="/assets/rx-icons.svg#rx-redo"></use>
          </svg></button
      ></span>
    </div>
    <div class="area">
      <textarea
        name="comment"
        placeholder="コメントを書く…"
        id="comment-editor"
        class="input"
        aria-label="コメント"
      ></textarea>
    </div>
  </div>
  <div class="rx-disclosure-group" role="group" aria-label="置き方と書式ツールの違い">
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
          ><span class="title">書式ツールを下に置き、送る操作を並べる</span></span
        >
      </summary>
      <div class="body">
        <div class="rx-text-editor" data-placement="bottom">
          <div
            class="toolbar"
            id="reply-editor-toolbar"
            role="toolbar"
            aria-label="返信の書式"
            aria-controls="reply-editor"
            data-controller="toolbar"
          >
            <span class="group"
              ><button
                data-icon-only="true"
                aria-label="太字"
                title="太字"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="bold"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-bold"></use>
                </svg></button
              ><button
                data-icon-only="true"
                aria-label="斜体"
                title="斜体"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="italic"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-italic"></use>
                </svg></button
              ><button
                data-icon-only="true"
                aria-label="取り消し線"
                title="取り消し線"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="strike"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-strike"></use>
                </svg></button
              ><button
                data-icon-only="true"
                aria-label="リンク"
                title="リンク"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="link"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-link"></use>
                </svg></button></span
            ><span class="group"
              ><button
                data-icon-only="true"
                aria-label="見出し"
                title="見出し"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="heading"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-heading"></use>
                </svg></button
              ><button
                data-icon-only="true"
                aria-label="引用"
                title="引用"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="quote"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-quote"></use>
                </svg></button
              ><button
                data-icon-only="true"
                aria-label="コード"
                title="コード"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="code"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-code"></use>
                </svg></button
              ><button
                data-icon-only="true"
                aria-label="箇条書き"
                title="箇条書き"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="bullets"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-bullets"></use>
                </svg></button
              ><button
                data-icon-only="true"
                aria-label="番号付きの箇条書き"
                title="番号付きの箇条書き"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="numbers"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-numbers"></use>
                </svg></button></span
            ><span class="group"
              ><button
                data-icon-only="true"
                aria-label="ファイルを添える"
                title="ファイルを添える"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="attach"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-attach"></use>
                </svg></button></span
            ><span class="group"
              ><button
                data-icon-only="true"
                aria-label="元に戻す"
                title="元に戻す"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="undo"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-undo"></use>
                </svg></button
              ><button
                data-icon-only="true"
                aria-label="やり直す"
                title="やり直す"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="redo"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-redo"></use>
                </svg></button></span
            ><span class="actions"
              ><div class="rx-split-button" data-variant="primary">
                <button
                  id="reply-send"
                  class="rx-button main"
                  type="submit"
                  data-variant="primary"
                  data-size="default"
                >
                  送る
                </button>
                <div
                  class="rx-dropdown-menu"
                  data-controller="dropdown-menu"
                  data-state="closed"
                  data-align="end"
                >
                  <button
                    id="reply-send-menu-trigger"
                    data-dropdown-menu-target="trigger"
                    aria-controls="reply-send-menu"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    aria-label="ほかのやり方"
                    data-icon-only="true"
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
                      <use href="/assets/rx-icons.svg#rx-caret"></use>
                    </svg>
                  </button>
                  <div
                    class="shield"
                    data-dropdown-menu-target="shield"
                    popover="manual"
                    tabindex="-1"
                    hidden=""
                  ></div>
                  <menu
                    id="reply-send-menu"
                    class="rx-menu"
                    data-dropdown-menu-target="menu"
                    data-menu-panel="root"
                    role="menu"
                    popover="manual"
                    aria-labelledby="reply-send-menu-trigger"
                    tabindex="-1"
                    hidden=""
                  >
                    <li role="none">
                      <button
                        id="reply-send-menu-0-item"
                        role="menuitem"
                        aria-label="送る日時を決める"
                        data-menu-kind="action"
                        data-menu-label="送る日時を決める"
                        tabindex="-1"
                        data-dropdown-menu-target="item"
                        data-dropdown-menu-value="schedule"
                        class="rx-button item"
                        type="button"
                        data-variant="secondary"
                        data-size="default"
                      >
                        <span class="content"
                          ><span class="heading"
                            ><span class="text"
                              ><span>送る日時を決める</span></span
                            ></span
                          ></span
                        >
                      </button>
                    </li>
                    <li role="none">
                      <button
                        id="reply-send-menu-1-item"
                        role="menuitem"
                        aria-label="下書きとして保存"
                        data-menu-kind="action"
                        data-menu-label="下書きとして保存"
                        tabindex="-1"
                        data-dropdown-menu-target="item"
                        data-dropdown-menu-value="draft"
                        class="rx-button item"
                        type="button"
                        data-variant="secondary"
                        data-size="default"
                      >
                        <span class="content"
                          ><span class="heading"
                            ><span class="text"
                              ><span>下書きとして保存</span></span
                            ></span
                          ></span
                        >
                      </button>
                    </li>
                  </menu>
                </div>
              </div></span
            >
          </div>
          <div class="area">
            <textarea
              name="reply"
              placeholder="返信を書く…"
              id="reply-editor"
              class="input"
              aria-label="返信"
            ></textarea>
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
        ><span class="label"><span class="title">書式ツールを絞る</span></span>
      </summary>
      <div class="body">
        <div class="rx-text-editor" data-placement="top">
          <div
            class="toolbar"
            id="note-editor-toolbar"
            role="toolbar"
            aria-label="メモの書式"
            aria-controls="note-editor"
            data-controller="toolbar"
          >
            <span class="group"
              ><button
                data-icon-only="true"
                aria-label="太字"
                title="太字"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="bold"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-bold"></use>
                </svg></button
              ><button
                data-icon-only="true"
                aria-label="斜体"
                title="斜体"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="italic"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-italic"></use>
                </svg></button
              ><button
                data-icon-only="true"
                aria-label="リンク"
                title="リンク"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="link"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-link"></use>
                </svg></button></span
            ><span class="group"
              ><button
                data-icon-only="true"
                aria-label="箇条書き"
                title="箇条書き"
                tabindex="-1"
                data-toolbar-target="control"
                data-text-editor-tool="bullets"
                class="rx-button"
                type="button"
                data-variant="link"
                data-size="compact"
              >
                <svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-bullets"></use>
                </svg></button
            ></span>
          </div>
          <div class="area">
            <textarea
              name="note"
              placeholder="メモを書く…"
              id="note-editor"
              class="input"
              aria-label="メモ"
            ></textarea>
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
          ><span class="title">Composerの入力エリアに入れる</span></span
        >
      </summary>
      <div class="body">
        <form id="composer-with-editor" class="rx-composer" aria-busy="false">
          <div class="rx-field">
            <div class="heading">
              <span class="label" id="composer-with-editor-body-label">お知らせ</span>
            </div>
            <div
              class="editor"
              role="group"
              aria-labelledby="composer-with-editor-body-label"
            >
              <div class="rx-text-editor" data-placement="top">
                <div
                  class="toolbar"
                  id="announcement-editor-toolbar"
                  role="toolbar"
                  aria-label="お知らせの書式"
                  aria-controls="announcement-editor"
                  data-controller="toolbar"
                >
                  <span class="group"
                    ><button
                      data-icon-only="true"
                      aria-label="太字"
                      title="太字"
                      tabindex="-1"
                      data-toolbar-target="control"
                      data-text-editor-tool="bold"
                      class="rx-button"
                      type="button"
                      data-variant="link"
                      data-size="compact"
                    >
                      <svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-bold"></use>
                      </svg></button
                    ><button
                      data-icon-only="true"
                      aria-label="斜体"
                      title="斜体"
                      tabindex="-1"
                      data-toolbar-target="control"
                      data-text-editor-tool="italic"
                      class="rx-button"
                      type="button"
                      data-variant="link"
                      data-size="compact"
                    >
                      <svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-italic"></use>
                      </svg></button
                    ><button
                      data-icon-only="true"
                      aria-label="取り消し線"
                      title="取り消し線"
                      tabindex="-1"
                      data-toolbar-target="control"
                      data-text-editor-tool="strike"
                      class="rx-button"
                      type="button"
                      data-variant="link"
                      data-size="compact"
                    >
                      <svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-strike"></use>
                      </svg></button
                    ><button
                      data-icon-only="true"
                      aria-label="リンク"
                      title="リンク"
                      tabindex="-1"
                      data-toolbar-target="control"
                      data-text-editor-tool="link"
                      class="rx-button"
                      type="button"
                      data-variant="link"
                      data-size="compact"
                    >
                      <svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-link"></use>
                      </svg></button></span
                  ><span class="group"
                    ><button
                      data-icon-only="true"
                      aria-label="見出し"
                      title="見出し"
                      tabindex="-1"
                      data-toolbar-target="control"
                      data-text-editor-tool="heading"
                      class="rx-button"
                      type="button"
                      data-variant="link"
                      data-size="compact"
                    >
                      <svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-heading"></use>
                      </svg></button
                    ><button
                      data-icon-only="true"
                      aria-label="引用"
                      title="引用"
                      tabindex="-1"
                      data-toolbar-target="control"
                      data-text-editor-tool="quote"
                      class="rx-button"
                      type="button"
                      data-variant="link"
                      data-size="compact"
                    >
                      <svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-quote"></use>
                      </svg></button
                    ><button
                      data-icon-only="true"
                      aria-label="コード"
                      title="コード"
                      tabindex="-1"
                      data-toolbar-target="control"
                      data-text-editor-tool="code"
                      class="rx-button"
                      type="button"
                      data-variant="link"
                      data-size="compact"
                    >
                      <svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-code"></use>
                      </svg></button
                    ><button
                      data-icon-only="true"
                      aria-label="箇条書き"
                      title="箇条書き"
                      tabindex="-1"
                      data-toolbar-target="control"
                      data-text-editor-tool="bullets"
                      class="rx-button"
                      type="button"
                      data-variant="link"
                      data-size="compact"
                    >
                      <svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-bullets"></use>
                      </svg></button
                    ><button
                      data-icon-only="true"
                      aria-label="番号付きの箇条書き"
                      title="番号付きの箇条書き"
                      tabindex="-1"
                      data-toolbar-target="control"
                      data-text-editor-tool="numbers"
                      class="rx-button"
                      type="button"
                      data-variant="link"
                      data-size="compact"
                    >
                      <svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-numbers"></use>
                      </svg></button></span
                  ><span class="group"
                    ><button
                      data-icon-only="true"
                      aria-label="ファイルを添える"
                      title="ファイルを添える"
                      tabindex="-1"
                      data-toolbar-target="control"
                      data-text-editor-tool="attach"
                      class="rx-button"
                      type="button"
                      data-variant="link"
                      data-size="compact"
                    >
                      <svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-attach"></use>
                      </svg></button></span
                  ><span class="group"
                    ><button
                      data-icon-only="true"
                      aria-label="元に戻す"
                      title="元に戻す"
                      tabindex="-1"
                      data-toolbar-target="control"
                      data-text-editor-tool="undo"
                      class="rx-button"
                      type="button"
                      data-variant="link"
                      data-size="compact"
                    >
                      <svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-undo"></use>
                      </svg></button
                    ><button
                      data-icon-only="true"
                      aria-label="やり直す"
                      title="やり直す"
                      tabindex="-1"
                      data-toolbar-target="control"
                      data-text-editor-tool="redo"
                      class="rx-button"
                      type="button"
                      data-variant="link"
                      data-size="compact"
                    >
                      <svg
                        class="rx-icon"
                        viewBox="0 0 256 256"
                        fill="currentColor"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <use href="/assets/rx-icons.svg#rx-redo"></use>
                      </svg></button
                  ></span>
                </div>
                <div class="area">
                  <textarea
                    name="announcement"
                    placeholder="お知らせを書く…"
                    id="announcement-editor"
                    class="input"
                    aria-label="お知らせ"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <button
              class="rx-button"
              type="submit"
              data-variant="primary"
              data-size="default"
            >
              投稿する
            </button>
          </div>
        </form>
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
          ><span class="title">狭い場所：ツールバーは折り返す</span></span
        >
      </summary>
      <div class="body">
        <div style="max-inline-size: 18rem">
          <div class="rx-text-editor" data-placement="top">
            <div
              class="toolbar"
              id="narrow-editor-toolbar"
              role="toolbar"
              aria-label="狭い場所のメモの書式"
              aria-controls="narrow-editor"
              data-controller="toolbar"
            >
              <span class="group"
                ><button
                  data-icon-only="true"
                  aria-label="太字"
                  title="太字"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="bold"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-bold"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="斜体"
                  title="斜体"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="italic"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-italic"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="取り消し線"
                  title="取り消し線"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="strike"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-strike"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="リンク"
                  title="リンク"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="link"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-link"></use>
                  </svg></button></span
              ><span class="group"
                ><button
                  data-icon-only="true"
                  aria-label="見出し"
                  title="見出し"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="heading"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-heading"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="引用"
                  title="引用"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="quote"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-quote"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="コード"
                  title="コード"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="code"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-code"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="箇条書き"
                  title="箇条書き"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="bullets"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-bullets"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="番号付きの箇条書き"
                  title="番号付きの箇条書き"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="numbers"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-numbers"></use>
                  </svg></button></span
              ><span class="group"
                ><button
                  data-icon-only="true"
                  aria-label="ファイルを添える"
                  title="ファイルを添える"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="attach"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-attach"></use>
                  </svg></button></span
              ><span class="group"
                ><button
                  data-icon-only="true"
                  aria-label="元に戻す"
                  title="元に戻す"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="undo"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-undo"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="やり直す"
                  title="やり直す"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="redo"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-redo"></use>
                  </svg></button></span
              ><span class="actions"
                ><button
                  class="rx-button"
                  type="button"
                  data-variant="secondary"
                  data-size="compact"
                >
                  保存
                </button></span
              >
            </div>
            <div class="area">
              <textarea
                name="narrow"
                placeholder="書く…"
                id="narrow-editor"
                class="input"
                aria-label="狭い場所のメモ"
              ></textarea>
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
          ><span class="title">使えない時・右から左に読む場合</span></span
        >
      </summary>
      <div class="body">
        <div class="rx-stack" data-space="small">
          <div class="rx-text-editor" data-placement="top">
            <div
              class="toolbar"
              id="disabled-editor-toolbar"
              role="toolbar"
              aria-label="締め切ったコメントの書式"
              aria-controls="disabled-editor"
              data-controller="toolbar"
            >
              <span class="group"
                ><button
                  data-icon-only="true"
                  aria-label="太字"
                  title="太字"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="bold"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-bold"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="斜体"
                  title="斜体"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="italic"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-italic"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="取り消し線"
                  title="取り消し線"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="strike"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-strike"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="リンク"
                  title="リンク"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="link"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-link"></use>
                  </svg></button></span
              ><span class="group"
                ><button
                  data-icon-only="true"
                  aria-label="見出し"
                  title="見出し"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="heading"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-heading"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="引用"
                  title="引用"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="quote"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-quote"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="コード"
                  title="コード"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="code"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-code"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="箇条書き"
                  title="箇条書き"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="bullets"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-bullets"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="番号付きの箇条書き"
                  title="番号付きの箇条書き"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="numbers"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-numbers"></use>
                  </svg></button></span
              ><span class="group"
                ><button
                  data-icon-only="true"
                  aria-label="ファイルを添える"
                  title="ファイルを添える"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="attach"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-attach"></use>
                  </svg></button></span
              ><span class="group"
                ><button
                  data-icon-only="true"
                  aria-label="元に戻す"
                  title="元に戻す"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="undo"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-undo"></use>
                  </svg></button
                ><button
                  data-icon-only="true"
                  aria-label="やり直す"
                  title="やり直す"
                  tabindex="-1"
                  data-toolbar-target="control"
                  data-text-editor-tool="redo"
                  class="rx-button"
                  type="button"
                  data-variant="link"
                  data-size="compact"
                  disabled=""
                >
                  <svg
                    class="rx-icon"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <use href="/assets/rx-icons.svg#rx-redo"></use>
                  </svg></button
              ></span>
            </div>
            <div class="area">
              <textarea
                name="closed"
                disabled=""
                id="disabled-editor"
                class="input"
                aria-label="締め切ったコメント"
              ></textarea>
            </div>
          </div>
          <div dir="rtl" lang="ar">
            <div class="rx-text-editor" data-placement="top">
              <div
                class="toolbar"
                id="rtl-editor-toolbar"
                role="toolbar"
                aria-label="تعليقの書式"
                aria-controls="rtl-editor"
                data-controller="toolbar"
              >
                <span class="group"
                  ><button
                    data-icon-only="true"
                    aria-label="太字"
                    title="太字"
                    tabindex="-1"
                    data-toolbar-target="control"
                    data-text-editor-tool="bold"
                    class="rx-button"
                    type="button"
                    data-variant="link"
                    data-size="compact"
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-bold"></use>
                    </svg></button
                  ><button
                    data-icon-only="true"
                    aria-label="斜体"
                    title="斜体"
                    tabindex="-1"
                    data-toolbar-target="control"
                    data-text-editor-tool="italic"
                    class="rx-button"
                    type="button"
                    data-variant="link"
                    data-size="compact"
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-italic"></use>
                    </svg></button
                  ><button
                    data-icon-only="true"
                    aria-label="取り消し線"
                    title="取り消し線"
                    tabindex="-1"
                    data-toolbar-target="control"
                    data-text-editor-tool="strike"
                    class="rx-button"
                    type="button"
                    data-variant="link"
                    data-size="compact"
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-strike"></use>
                    </svg></button
                  ><button
                    data-icon-only="true"
                    aria-label="リンク"
                    title="リンク"
                    tabindex="-1"
                    data-toolbar-target="control"
                    data-text-editor-tool="link"
                    class="rx-button"
                    type="button"
                    data-variant="link"
                    data-size="compact"
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-link"></use>
                    </svg></button></span
                ><span class="group"
                  ><button
                    data-icon-only="true"
                    aria-label="見出し"
                    title="見出し"
                    tabindex="-1"
                    data-toolbar-target="control"
                    data-text-editor-tool="heading"
                    class="rx-button"
                    type="button"
                    data-variant="link"
                    data-size="compact"
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-heading"></use>
                    </svg></button
                  ><button
                    data-icon-only="true"
                    aria-label="引用"
                    title="引用"
                    tabindex="-1"
                    data-toolbar-target="control"
                    data-text-editor-tool="quote"
                    class="rx-button"
                    type="button"
                    data-variant="link"
                    data-size="compact"
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-quote"></use>
                    </svg></button
                  ><button
                    data-icon-only="true"
                    aria-label="コード"
                    title="コード"
                    tabindex="-1"
                    data-toolbar-target="control"
                    data-text-editor-tool="code"
                    class="rx-button"
                    type="button"
                    data-variant="link"
                    data-size="compact"
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-code"></use>
                    </svg></button
                  ><button
                    data-icon-only="true"
                    aria-label="箇条書き"
                    title="箇条書き"
                    tabindex="-1"
                    data-toolbar-target="control"
                    data-text-editor-tool="bullets"
                    class="rx-button"
                    type="button"
                    data-variant="link"
                    data-size="compact"
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-bullets"></use>
                    </svg></button
                  ><button
                    data-icon-only="true"
                    aria-label="番号付きの箇条書き"
                    title="番号付きの箇条書き"
                    tabindex="-1"
                    data-toolbar-target="control"
                    data-text-editor-tool="numbers"
                    class="rx-button"
                    type="button"
                    data-variant="link"
                    data-size="compact"
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-numbers"></use>
                    </svg></button></span
                ><span class="group"
                  ><button
                    data-icon-only="true"
                    aria-label="ファイルを添える"
                    title="ファイルを添える"
                    tabindex="-1"
                    data-toolbar-target="control"
                    data-text-editor-tool="attach"
                    class="rx-button"
                    type="button"
                    data-variant="link"
                    data-size="compact"
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-attach"></use>
                    </svg></button></span
                ><span class="group"
                  ><button
                    data-icon-only="true"
                    aria-label="元に戻す"
                    title="元に戻す"
                    tabindex="-1"
                    data-toolbar-target="control"
                    data-text-editor-tool="undo"
                    class="rx-button"
                    type="button"
                    data-variant="link"
                    data-size="compact"
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-undo"></use>
                    </svg></button
                  ><button
                    data-icon-only="true"
                    aria-label="やり直す"
                    title="やり直す"
                    tabindex="-1"
                    data-toolbar-target="control"
                    data-text-editor-tool="redo"
                    class="rx-button"
                    type="button"
                    data-variant="link"
                    data-size="compact"
                  >
                    <svg
                      class="rx-icon"
                      viewBox="0 0 256 256"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <use href="/assets/rx-icons.svg#rx-redo"></use>
                    </svg></button
                ></span>
              </div>
              <div class="area">
                <textarea
                  name="rtl"
                  placeholder="اكتب تعليقًا…"
                  id="rtl-editor"
                  class="input"
                  aria-label="تعليق"
                ></textarea>
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
