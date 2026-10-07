<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Keycap

キーボードのキーの表記をそろえて表示します。

## 使いどころ

- 文中や操作の横で、キーボードの操作を示す時に使います。ショートカットキーの表示には、どのコンポーネントでもこれを使います。
- `DropdownMenu`・`FilterMenu` の `shortcut`、`ActionTile`・`ActionDock` の `shortcut` は、中でこの表示の小さい形を使います。

## 使い方

表記だけのコンポーネントです。`keys` の各キーを `kbd` にして並べます。各キーは控えめな `Button` と同じ作りの小さな四角で、平らな白に1px `#cccccc` の枠（角丸3px）を付け、下にぼかしの無い1px `#dddddd` の影を付けてキーの厚みを見せます。文字は11pxです。ショートカットの登録と実行は利用側が行います。

`size="small"` はタイルの角やメニューの行の終わりに添える表示で、文字は同じ11pxのまま、行高とキーの間・内側の余白を詰めます。`inverse` は色で塗った面の上に置く時に使い、地を塗らず影も付けず、文字と同じ色の淡い枠にします。

文字の基準線に揃えて文中に置き、幅が足りなければキーの間で折り返します。

## アクセシビリティ

- キーは `kbd` として並べます。「⌘」のような記号だけの表記は読み上げで伝わりにくいため、文中に読める名前を添えるか、`label` を渡します。`label` を渡すと、キーの表記を読み上げから外し、見えない文として `label` を置きます。外側の `span` は名前を持てない要素なので、`aria-label` を渡した時も `label` と同じ扱いにします。
- 操作の横に添えた表記が操作の名前と重なる時は、`aria-hidden="true"` で読み上げから外します。

## API

### Keycap

| 名前           | 型                     | 既定値      | 説明                                                                                                                                                                                           |
| -------------- | ---------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keys`（必須） | `readonly string[]`    |             | 同時に押すキーの表記。一つずつ`kbd`にして並べる。記号だけで読み上げにくい時は`label`を添える。                                                                                                 |
| `label`        | `string`               |             | 読み上げ用の名前（「CommandとS」など）。渡すと、キーの表記を読み上げから外し、見えない文としてこの名前を置く。外側の`span`は名前を持てない要素なので、`aria-label`を渡した時も同じ扱いにする。 |
| `size`         | `"default" \| "small"` | `"default"` | smallはタイルの角やメニューの行の末尾に添える小さな表示。                                                                                                                                      |
| `inverse`      | `boolean`              | `false`     | 色で塗った面の上に置く時。背景を塗らず、文字と同じ色の淡い縁にする。                                                                                                                           |

ほかに、`<span>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/keycap.css`

## コード

```tsx
import { Keycap } from "@tknf/retrix/hono";
export default () => (
  <div class="rx-stack" data-space="small">
    <p>
      <Keycap keys={["⌘", "S"]} label="CommandとS" /> で保存。Windowsでは{" "}
      <Keycap keys={["Ctrl", "S"]} /> を使います。
    </p>
    <p>
      <Keycap keys={["Esc"]} /> で編集に戻ります。
    </p>
    <p>
      次の項目へは <Keycap keys={["Tab"]} />
      、一つ前へは <Keycap keys={["Shift", "Tab"]} /> で移動します。
    </p>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack" data-space="small">
  <p>
    <span class="rx-keycap"
      ><kbd aria-hidden="true">⌘</kbd><kbd aria-hidden="true">S</kbd
      ><span class="rx-visually-hidden">CommandとS</span></span
    >
    で保存。Windowsでは
    <span class="rx-keycap"><kbd>Ctrl</kbd><kbd>S</kbd></span> を使います。
  </p>
  <p>
    <span class="rx-keycap"><kbd>Esc</kbd></span> で編集に戻ります。
  </p>
  <p>
    次の項目へは <span class="rx-keycap"><kbd>Tab</kbd></span
    >、一つ前へは
    <span class="rx-keycap"><kbd>Shift</kbd><kbd>Tab</kbd></span> で移動します。
  </p>
</div>
```

</details>
