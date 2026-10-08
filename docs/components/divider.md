<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Divider

内容の区切りに線を引き、見出しや操作を置きます。

## 使いどころ

- 公開済みと下書きの境など、内容の意味が切り替わる所に、区切りと短い名前を置く時に使います。
- 余白の調整には使わず、親の`gap`で間を取ります。
- 見出しと件数を持つまとまりは`Section`を使います。

## 使い方

`label`を省略すると、線だけの区切り（`actions`があれば線と操作）を出します。`label`を渡すと、先頭側に名前（BC2のCatch upの区分の見出しと同じ、茶色がかった灰色の小さな太字、11px）、残りの幅に線を引きます。名前には文字のほか、`InlineSelect`などの選択も置けます。

`line="solid"`は確定した区切りで、シートの見出しの下の罫線と同じ1px #dedede の線です。`line="dashed"`は灰色の破線で、ここから先はまだ確定していないことを示します。

`actions`には、区切りの先の項目をまとめて扱う操作（「すべて見る」の`ActionLink`など）だけを置きます。操作は線の末尾に置き、狭い場所では次の行の末尾側へ回します。

長い名前は折り返し、線は残りの幅に引きます。

## アクセシビリティ

- `label`も`actions`もない区切りは`hr`で、区切りとして読み上げます。
- `label`を持つ区切りは`div`で、名前は見出しではない文字として読みます。見出しで移動できるまとまりにする時は`Section`を使います。

## API

### Divider

| 名前      | 型                    | 既定値    | 説明                                                                                                                                |
| --------- | --------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `label`   | `Child`               |           | 線の先頭に置く名前。文字のほか、選択（InlineSelectなど）も置ける。                                                                  |
| `line`    | `"solid" \| "dashed"` | `"solid"` | solidは確定した区切り、dashedは破線（ここから先はまだ確定していない）。                                                             |
| `actions` | `Child`               |           | 線の末尾に置く操作（ActionLinkなど）。「最近のファイル ——— ［すべて見る］」のように、区切りの後の項目をまとめて扱う操作だけを置く。 |

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/divider.css`

## コード

```tsx
import { Divider, ActionLink, InlineSelect } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <p>現在の設定</p>
    <Divider label="補足" />
    <p>必要な場合だけ変更してください。</p>
    <Divider />
    <p>ここまでは公開済みの内容です。</p>
    <Divider label="ここから下書き" line="dashed" />
    <p>まだ確定していない内容は、破線の下に置きます。</p>
    <Divider line="dashed" />
    <Divider label="補足と説明を含む長い区切りの見出しは、狭い場所では折り返します" />
    <p>見出しが長い時も、線は残りの幅に引きます。</p>
    <Divider
      label="田中 遥から届いたファイル"
      actions={
        <ActionLink href="/" size="compact">
          すべて見る
        </ActionLink>
      }
    />
    <p>線の終わりには、区切りの後の項目をまとめて扱う操作だけを置きます。</p>
    <Divider
      label={
        <InlineSelect
          label="表示するスレッド"
          name="threads"
          value="all"
          options={[
            { value: "all", label: "田中 遥とのすべてのスレッド" },
            { value: "unread", label: "未読のスレッド" },
          ]}
        />
      }
      actions={
        <ActionLink href="/" size="compact">
          書く
        </ActionLink>
      }
    />
    <p>名前の代わりに文の中の選択を置くと、区切りの後の項目の並べ方を選べます。</p>
    <div dir="rtl" lang="ar" class="rx-stack">
      <Divider label="ملاحظة" />
      <Divider label="مسودة" line="dashed" />
    </div>
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <p>現在の設定</p>
  <div class="rx-divider"><span>補足</span></div>
  <p>必要な場合だけ変更してください。</p>
  <hr class="rx-divider" />
  <p>ここまでは公開済みの内容です。</p>
  <div class="rx-divider" data-line="dashed"><span>ここから下書き</span></div>
  <p>まだ確定していない内容は、破線の下に置きます。</p>
  <hr class="rx-divider" data-line="dashed" />
  <div class="rx-divider">
    <span>補足と説明を含む長い区切りの見出しは、狭い場所では折り返します</span>
  </div>
  <p>見出しが長い時も、線は残りの幅に引きます。</p>
  <div class="rx-divider">
    <span>田中 遥から届いたファイル</span
    ><span class="actions"
      ><a href="/" class="rx-button" data-variant="secondary" data-size="compact"
        >すべて見る</a
      ></span
    >
  </div>
  <p>線の終わりには、区切りの後の項目をまとめて扱う操作だけを置きます。</p>
  <div class="rx-divider">
    <span
      ><span class="rx-inline-select"
        ><select name="threads" aria-label="表示するスレッド">
          <option value="all" selected="">田中 遥とのすべてのスレッド</option>
          <option value="unread">未読のスレッド</option></select
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-caret"></use></svg></span></span
    ><span class="actions"
      ><a href="/" class="rx-button" data-variant="secondary" data-size="compact"
        >書く</a
      ></span
    >
  </div>
  <p>名前の代わりに文の中の選択を置くと、区切りの後の項目の並べ方を選べます。</p>
  <div dir="rtl" lang="ar" class="rx-stack">
    <div class="rx-divider"><span>ملاحظة</span></div>
    <div class="rx-divider" data-line="dashed"><span>مسودة</span></div>
  </div>
</div>
```

</details>
