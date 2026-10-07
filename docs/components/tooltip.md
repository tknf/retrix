<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Tooltip

操作に添える短い補足を、ホバーとフォーカスで表示します。

## 使いどころ

- 操作の意味を一言で補う時や、アイコンだけの操作に名前を見せる時に使います。
- リンクや操作を含む補足、読んでから操作する説明は、`Popover` や画面上の文にします。ホバーを外すと消える補足には、欠かせない情報を置きません。
- リンクや対象の概要を、操作できるパネルで見せる時は `HoverCard` を使います。

## 使い方

`trigger` は属性を受け取って操作を描く関数です。受け取った属性を、`Button` や `ActionLink` などフォーカスできる一つの操作へそのまま渡します。`id` は画面内で一意にします。

`TooltipController` を `tooltip` として登録すると、ホバー時とフォーカス時に、`delay` のミリ秒の後で補足を出します。ポインターとフォーカスが操作と補足の両方から離れると閉じます。操作と補足の間の隙間は補足の一部として扱うので、操作から補足の上へポインターを移しても閉じません。

`text` は短い一文にし、リンクや操作を入れません。補足の中にフォーカスできる要素があると、controllerは働かず、コンソールに警告を出します。

補足は操作の中央の下に出し、収まらなければ上や反対側へ回り込みます。幅は20remを上限にします。CSSのアンカーに対応しない環境では画面の下の中央に出します。

JavaScriptなしでは補足は出ません。補足の文は `aria-describedby` で操作の説明として読み上げられます。

## キーボード

| キー          | 動作                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Tab（操作へ） | 操作にフォーカスすると、補足を出します。                                                       |
| Escape        | 開いている補足を閉じます。ポインターを離すかフォーカスを外すまで、同じ操作では再び出しません。 |

## アクセシビリティ

- 補足は `role="tooltip"` で、操作の `aria-describedby` に結び付けます。操作の名前ではなく説明として読み上げます。
- 補足はフォーカスを受け取りません。操作の名前は、操作自身の文言か `aria-label` で付けます。

## イベント

| イベント               | 内容                                                                                                                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `tooltip:beforetoggle` | 補足を出す・閉じる直前。取り消せます。`detail` は `open`（次の状態）・`previousOpen`・`reason`（`pointer` または `keyboard`）です。 |
| `tooltip:toggle`       | 補足を出した・閉じた後。`detail` は `tooltip:beforetoggle` と同じです。                                                             |

## API

### Tooltip

短い非対話的な補足。操作や必須の説明はトリガー側に残す。

| 名前              | 型                                                | 既定値 | 説明                                                                                                                                               |
| ----------------- | ------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`（必須）      | `string`                                          |        | 補足のid。画面内で一意にする。                                                                                                                     |
| `text`（必須）    | `string`                                          |        | 補足の文。短い一文にし、リンクや操作を入れない。                                                                                                   |
| `trigger`（必須） | `(attributes: TooltipTriggerAttributes) => Child` |        | 操作を描く関数。受け取った属性をフォーカスできる一つの操作（ButtonやActionLink）へそのまま渡す。自分でstyleを持つ時は、受け取ったstyleと合わせる。 |
| `delay`           | `number`                                          | `150`  | ホバーしてから、またはフォーカスしてから補足を出すまでのミリ秒。0ならすぐ出す。負の数などは既定値に戻す。                                          |

登録するcontroller：`tooltip`（`TooltipController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/overlay.css`、`components/tooltip.css`

#### `TooltipTriggerAttributes`

| 名前                          | 型          | 既定値 | 説明                                                           |
| ----------------------------- | ----------- | ------ | -------------------------------------------------------------- |
| `aria-describedby`（必須）    | `string`    |        | 補足のid。補足を操作の説明として読み上げる。                   |
| `data-tooltip-target`（必須） | `"trigger"` |        | TooltipControllerが操作を見つける印。                          |
| `style`（必須）               | `string`    |        | 補足を操作の近くに置くためのCSSのアンカー名（`anchor-name`）。 |

## コード

```tsx
import { ActionLink, Button, Tooltip } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-cluster">
    <Tooltip
      id="tooltip-button"
      text="この設定は公開後も変更できます。"
      trigger={(attributes) => <Button {...attributes}>共有範囲</Button>}
    />
    <Tooltip
      id="tooltip-link"
      text="設定画面を開きます。"
      trigger={(attributes) => (
        <ActionLink {...attributes} href="/apps/settings">
          設定へ
        </ActionLink>
      )}
    />
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-cluster">
  <span class="rx-tooltip" data-controller="tooltip" data-tooltip-delay-value="150"
    ><button
      aria-describedby="tooltip-button"
      data-tooltip-target="trigger"
      style="anchor-name: --rx-tooltip-74-6f-6f-6c-74-69-70-2d-62-75-74-74-6f-6e"
      class="rx-button"
      type="button"
      data-variant="secondary"
      data-size="default"
    >
      共有範囲</button
    ><span
      id="tooltip-button"
      class="content rx-overlay"
      role="tooltip"
      popover="manual"
      data-tooltip-target="content"
      style="position-anchor: --rx-tooltip-74-6f-6f-6c-74-69-70-2d-62-75-74-74-6f-6e"
      >この設定は公開後も変更できます。</span
    ></span
  ><span class="rx-tooltip" data-controller="tooltip" data-tooltip-delay-value="150"
    ><a
      aria-describedby="tooltip-link"
      data-tooltip-target="trigger"
      style="anchor-name: --rx-tooltip-74-6f-6f-6c-74-69-70-2d-6c-69-6e-6b"
      href="/apps/settings"
      class="rx-button"
      data-variant="secondary"
      data-size="default"
      >設定へ</a
    ><span
      id="tooltip-link"
      class="content rx-overlay"
      role="tooltip"
      popover="manual"
      data-tooltip-target="content"
      style="position-anchor: --rx-tooltip-74-6f-6f-6c-74-69-70-2d-6c-69-6e-6b"
      >設定画面を開きます。</span
    ></span
  >
</div>
```

</details>
