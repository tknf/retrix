<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Tree

作業面の中で、階層を開閉して項目を選択します。

## 使いどころ

- 作業面の中で、資料やフォルダの階層を開閉しながら一件を選ぶ時に使います。
- アプリ全体の移動は`AppShell`のヘッダー、名前で探す移動は`CommandMenu`、表の行に階層がある時は`Treegrid`を使います。

## 使い方

`label`と`items`を渡し、`TreeController`を`tree`、`TreePresentationController`を`tree-presentation`として登録します。子を持つ項目には開閉のボタンが付きます。初めに選ぶ項目は`value`、初めに開く親は`expanded`で渡します。

項目を押すか、注目している項目でEnterを押すと、その項目を選び、`tree:change`を発火して`detail.value`を渡します。選んだ項目に応じて何を表示するかは利用側が担います。`href`を持つ項目は名前がリンクになり、名前を押すか、注目してEnterを押すと、選択と同時にリンク先へ移ります（リンクの`click`が起きるので、利用側はリンクの操作として受け取れます）。

行は12pxの文字で高さ約27px、角丸2pxの面で、ホバーすると淡い灰色にします。選んだ項目は黄色のハイライト、キーボードで注目している項目は淡い青緑で塗り、どちらも名前を黒い太字にします。`href`を持つ項目の名前は青緑のリンクの文字です。階層はガイド線を引かず、字下げだけで示します。

無効な項目は選べず、開閉のボタンも押せません。空白だけの`value`と、全階層を通じて二つ目以降に現れた`value`の項目は、子ごと出しません。残る項目がない時は「項目はありません。」の状態文を出します。

JavaScriptなしでは、開閉のボタンを隠してすべての階層を開いた状態で表示し、`href`の項目はリンクとして働きます。

## キーボード

| キー       | 動作                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------- |
| ↓ / ↑      | 次・前の見えている項目に注目します。無効な項目は飛ばします。                              |
| Home / End | 先頭・末尾の見えている項目に注目します。                                                  |
| →          | 閉じた親を開きます。開いた親では最初の子に注目します。右から左に書く時は←がこの役割です。 |
| ←          | 開いた親を閉じます。それ以外では親の項目に注目します。右から左に書く時は→がこの役割です。 |
| Enter      | 注目している項目を選びます。`href`を持つ項目はリンク先へ移ります。                        |
| 文字       | 名前がその文字で始まる、次の項目に注目します。続けて入力すると語で探します。              |

## アクセシビリティ

- 一覧は`role="tree"`で`label`を読み上げ名に持ち、Tabでフォーカスできます。項目は`treeitem`、子の並びは`group`です。
- Tabで止まるのは一覧だけです。中のリンクと開閉のボタンは、controllerが`tabindex="-1"`にしてTabの巡回から外します。JavaScriptなしでは、リンクはTabで止まります。
- フォーカスは一覧に置いたまま、注目している項目を`aria-activedescendant`で伝えます。選んだ項目は`aria-selected="true"`、親の開閉は`aria-expanded`で伝えます。
- 開閉のボタンは「（名前）を開閉」という読み上げ名を持ちます。無効な項目は`aria-disabled="true"`です。
- 項目がない時は、一覧の代わりに`role="status"`の状態文を出します。

## イベント

| イベント            | 内容                                                                                                                                                                                |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tree:beforechange` | 項目を選ぶ直前に発火します。`detail`は`value`・`previousValue`・`reason`（`pointer`または`keyboard`）です。取り消すと選択を変えません。選び済みの項目を選び直した時は発火しません。 |
| `tree:change`       | 項目を選んだ後に発火します。`detail`は`tree:beforechange`と同じです。                                                                                                               |
| `tree:beforetoggle` | 親を開閉する直前に発火します。`detail`は`value`・`expanded`（開く時は`true`）・`previousExpanded`・`reason`です。取り消すと開閉しません。                                           |
| `tree:toggle`       | 親を開閉した後に発火します。`detail`は`tree:beforetoggle`と同じです。                                                                                                               |

## API

### Tree

中央の作業面で階層を選ぶ。全体移動はCommandMenuが担う。

| 名前            | 型                    | 既定値 | 説明                                                                                         |
| --------------- | --------------------- | ------ | -------------------------------------------------------------------------------------------- |
| `id`            | `string`              |        | ルートのid。省略すると自動で作る。各項目のidの元になる。                                     |
| `label`（必須） | `string`              |        | treeの読み上げ名。空白だけの時は「項目一覧」にする。                                         |
| `items`（必須） | `readonly TreeItem[]` |        | 最上位の項目。重複や空の値を除いて一件も残らない時は、「項目はありません。」の状態文を出す。 |
| `value`         | `string`              | `""`   | 初めに選んでおく項目のvalue。見つからない値は選択なしとして扱う。                            |
| `expanded`      | `readonly string[]`   | `[]`   | 初めに開いておく親の項目のvalue。子を持たない値は無視する。                                  |

登録するcontroller：`tree`（`TreeController`）、`tree-presentation`（`TreePresentationController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/tree.css`

#### `TreeItem`

| 名前            | 型                    | 既定値 | 説明                                                                                                                             |
| --------------- | --------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `value`（必須） | `string`              |        | 項目を識別する値。tree:changeのdetail.valueで渡す。空白だけの値と、全階層を通じて二つ目以降に現れた値の項目は、子ごと出さない。  |
| `label`（必須） | `string`              |        | 項目の名前。空白だけの時はvalueを名前にする。                                                                                    |
| `href`          | `string`              |        | 名前をリンクにする時のURL。名前を押すか、フォーカスしてEnterを押すと、選ぶと同時にリンク先へ移る。無効な項目ではリンクにしない。 |
| `disabled`      | `boolean`             |        | 選べない項目。開閉のボタンも押せず、矢印キーの移動の対象から外す。                                                               |
| `children`      | `readonly TreeItem[]` |        | 子の項目。一件以上あると、開閉のボタンを付けた親になる。                                                                         |

## コード

```tsx
import { Disclosure, Tree } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <Tree
      id="document-tree"
      label="資料"
      value="guide"
      expanded={["guide"]}
      items={[
        {
          value: "guide",
          label: "利用案内",
          children: [
            { value: "start", label: "はじめに" },
            { value: "account", label: "アカウント" },
          ],
        },
        { value: "rules", label: "運用規約" },
      ]}
    />
    <Disclosure summary="空・重複値のある資料">
      <Tree label="空の資料" items={[]} />
      <Tree
        label="重複値のある資料"
        items={[
          {
            value: "guide",
            label: "案内",
            children: [{ value: "start", label: "はじめに" }],
          },
          {
            value: "rules",
            label: "規約",
            children: [
              { value: "start", label: "重複した項目" },
              { value: "policy", label: "運用方針" },
            ],
          },
          { value: "guide", label: "重複した案内" },
        ]}
      />
    </Disclosure>
    <Disclosure summary="リンクの項目・右から左に読む場合">
      <Tree
        id="linked-tree"
        label="リンクの資料"
        items={[
          {
            value: "linked-guide",
            label: "利用案内",
            href: "#linked-guide",
            children: [
              { value: "linked-start", label: "はじめに", href: "#linked-start" },
            ],
          },
          { value: "linked-rules", label: "運用規約", href: "#linked-rules" },
        ]}
      />
      <div dir="rtl" lang="ar">
        <Tree
          id="rtl-tree"
          label="المستندات"
          items={[
            {
              value: "rtl-guide",
              label: "الدليل",
              children: [{ value: "rtl-start", label: "البداية" }],
            },
            { value: "rtl-rules", label: "القواعد" },
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
  <ul
    id="document-tree"
    class="rx-tree"
    role="tree"
    aria-label="資料"
    tabindex="0"
    data-controller="tree tree-presentation"
    data-tree-value-value="guide"
    data-tree-expanded-value='["guide"]'
  >
    <li
      id="document-tree-item-0"
      role="treeitem"
      aria-labelledby="document-tree-item-0-label"
      data-tree-target="item"
      data-tree-value="guide"
    >
      <div class="row">
        <button
          data-icon-only="true"
          data-tree-target="toggle"
          aria-label="利用案内を開閉"
          class="rx-button toggle"
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
            <use href="/assets/rx-icons.svg#rx-caret"></use>
          </svg></button
        ><span id="document-tree-item-0-label" class="label">利用案内</span>
      </div>
      <ul role="group">
        <li
          id="document-tree-item-0-0"
          role="treeitem"
          aria-labelledby="document-tree-item-0-0-label"
          data-tree-target="item"
          data-tree-value="start"
        >
          <div class="row">
            <span class="spacer" aria-hidden="true"></span
            ><span id="document-tree-item-0-0-label" class="label">はじめに</span>
          </div>
        </li>
        <li
          id="document-tree-item-0-1"
          role="treeitem"
          aria-labelledby="document-tree-item-0-1-label"
          data-tree-target="item"
          data-tree-value="account"
        >
          <div class="row">
            <span class="spacer" aria-hidden="true"></span
            ><span id="document-tree-item-0-1-label" class="label">アカウント</span>
          </div>
        </li>
      </ul>
    </li>
    <li
      id="document-tree-item-1"
      role="treeitem"
      aria-labelledby="document-tree-item-1-label"
      data-tree-target="item"
      data-tree-value="rules"
    >
      <div class="row">
        <span class="spacer" aria-hidden="true"></span
        ><span id="document-tree-item-1-label" class="label">運用規約</span>
      </div>
    </li>
  </ul>
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
      ><span class="label"><span class="title">空・重複値のある資料</span></span>
    </summary>
    <div class="body">
      <div
        id="rx-tree-:r9:"
        class="rx-tree"
        data-empty="true"
        role="status"
        aria-label="空の資料"
      >
        項目はありません。
      </div>
      <ul
        id="rx-tree-:ra:"
        class="rx-tree"
        role="tree"
        aria-label="重複値のある資料"
        tabindex="0"
        data-controller="tree tree-presentation"
        data-tree-value-value=""
        data-tree-expanded-value="[]"
      >
        <li
          id="rx-tree-:ra:-item-0"
          role="treeitem"
          aria-labelledby="rx-tree-:ra:-item-0-label"
          data-tree-target="item"
          data-tree-value="guide"
        >
          <div class="row">
            <button
              data-icon-only="true"
              data-tree-target="toggle"
              aria-label="案内を開閉"
              class="rx-button toggle"
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
                <use href="/assets/rx-icons.svg#rx-caret"></use>
              </svg></button
            ><span id="rx-tree-:ra:-item-0-label" class="label">案内</span>
          </div>
          <ul role="group">
            <li
              id="rx-tree-:ra:-item-0-0"
              role="treeitem"
              aria-labelledby="rx-tree-:ra:-item-0-0-label"
              data-tree-target="item"
              data-tree-value="start"
            >
              <div class="row">
                <span class="spacer" aria-hidden="true"></span
                ><span id="rx-tree-:ra:-item-0-0-label" class="label">はじめに</span>
              </div>
            </li>
          </ul>
        </li>
        <li
          id="rx-tree-:ra:-item-1"
          role="treeitem"
          aria-labelledby="rx-tree-:ra:-item-1-label"
          data-tree-target="item"
          data-tree-value="rules"
        >
          <div class="row">
            <button
              data-icon-only="true"
              data-tree-target="toggle"
              aria-label="規約を開閉"
              class="rx-button toggle"
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
                <use href="/assets/rx-icons.svg#rx-caret"></use>
              </svg></button
            ><span id="rx-tree-:ra:-item-1-label" class="label">規約</span>
          </div>
          <ul role="group">
            <li
              id="rx-tree-:ra:-item-1-0"
              role="treeitem"
              aria-labelledby="rx-tree-:ra:-item-1-0-label"
              data-tree-target="item"
              data-tree-value="policy"
            >
              <div class="row">
                <span class="spacer" aria-hidden="true"></span
                ><span id="rx-tree-:ra:-item-1-0-label" class="label">運用方針</span>
              </div>
            </li>
          </ul>
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
        ><span class="title">リンクの項目・右から左に読む場合</span></span
      >
    </summary>
    <div class="body">
      <ul
        id="linked-tree"
        class="rx-tree"
        role="tree"
        aria-label="リンクの資料"
        tabindex="0"
        data-controller="tree tree-presentation"
        data-tree-value-value=""
        data-tree-expanded-value="[]"
      >
        <li
          id="linked-tree-item-0"
          role="treeitem"
          aria-labelledby="linked-tree-item-0-label"
          data-tree-target="item"
          data-tree-value="linked-guide"
        >
          <div class="row">
            <button
              data-icon-only="true"
              data-tree-target="toggle"
              aria-label="利用案内を開閉"
              class="rx-button toggle"
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
                <use href="/assets/rx-icons.svg#rx-caret"></use>
              </svg></button
            ><a id="linked-tree-item-0-label" href="#linked-guide">利用案内</a>
          </div>
          <ul role="group">
            <li
              id="linked-tree-item-0-0"
              role="treeitem"
              aria-labelledby="linked-tree-item-0-0-label"
              data-tree-target="item"
              data-tree-value="linked-start"
            >
              <div class="row">
                <span class="spacer" aria-hidden="true"></span
                ><a id="linked-tree-item-0-0-label" href="#linked-start">はじめに</a>
              </div>
            </li>
          </ul>
        </li>
        <li
          id="linked-tree-item-1"
          role="treeitem"
          aria-labelledby="linked-tree-item-1-label"
          data-tree-target="item"
          data-tree-value="linked-rules"
        >
          <div class="row">
            <span class="spacer" aria-hidden="true"></span
            ><a id="linked-tree-item-1-label" href="#linked-rules">運用規約</a>
          </div>
        </li>
      </ul>
      <div dir="rtl" lang="ar">
        <ul
          id="rtl-tree"
          class="rx-tree"
          role="tree"
          aria-label="المستندات"
          tabindex="0"
          data-controller="tree tree-presentation"
          data-tree-value-value=""
          data-tree-expanded-value="[]"
        >
          <li
            id="rtl-tree-item-0"
            role="treeitem"
            aria-labelledby="rtl-tree-item-0-label"
            data-tree-target="item"
            data-tree-value="rtl-guide"
          >
            <div class="row">
              <button
                data-icon-only="true"
                data-tree-target="toggle"
                aria-label="الدليلを開閉"
                class="rx-button toggle"
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
                  <use href="/assets/rx-icons.svg#rx-caret"></use>
                </svg></button
              ><span id="rtl-tree-item-0-label" class="label">الدليل</span>
            </div>
            <ul role="group">
              <li
                id="rtl-tree-item-0-0"
                role="treeitem"
                aria-labelledby="rtl-tree-item-0-0-label"
                data-tree-target="item"
                data-tree-value="rtl-start"
              >
                <div class="row">
                  <span class="spacer" aria-hidden="true"></span
                  ><span id="rtl-tree-item-0-0-label" class="label">البداية</span>
                </div>
              </li>
            </ul>
          </li>
          <li
            id="rtl-tree-item-1"
            role="treeitem"
            aria-labelledby="rtl-tree-item-1-label"
            data-tree-target="item"
            data-tree-value="rtl-rules"
          >
            <div class="row">
              <span class="spacer" aria-hidden="true"></span
              ><span id="rtl-tree-item-1-label" class="label">القواعد</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </details>
</div>
```

</details>
