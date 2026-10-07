<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Comparison

変更前と変更後を並べて確認します。

## 使いどころ

- 設定や文面を変える前に、現在と変更後を並べて確かめさせる時に使います。
- 今の値だけを見せる時は `ValueList`、変更の経緯を時系列で読ませる時は `Timeline` を使います。

## 使い方

`label` と、`before`・`after` に変更前後の内容を渡します。中には `ValueList` や段落など任意の要素を置けます。`null` を渡した側は「未登録」と表示します。

`changed` は値が変わるかどうかで、差分の判定は利用側が行います。現在と変更後は、罫線の枠を持つ角の小さな淡い灰色の面に入れて並べます。`true` なら見出しの隣に「変更あり」を淡い青のピルで添え、変更後の面を黄色にして、二つの面の境に青緑の矢印を入れた白い丸を置きます。`false` なら「変更なし」を灰色のピルで添え、両方を淡い灰色の面のままにして、丸の中を灰色の等号にします。

変わる時の現在の側は、中に置いたコンポーネントも含めて灰色の文字で表示します。

配置先の幅が30rem以上なら左右に並べ、狭ければ現在→変更後の順に上下へ並べます。右から左に読むページでは矢印の向きを反転します。JavaScriptは使いません。

## アクセシビリティ

- ルートは `section` で `label` を名前にします。見出しは `h3`、前後の見出しは `h4` なので、ページの見出しの階層に合う場所に置きます。
- 「変更あり」「変更なし」は見出しの一部として読み上げます。間の矢印と等号は装飾です。

## API

### Comparison

| 名前             | 型        | 既定値     | 説明                                                                                                                                                                                         |
| ---------------- | --------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須）  | `string`  |            | 比べる項目の名前。見出し（h3）とルートのaria-labelにする。                                                                                                                                   |
| `before`（必須） | `Child`   |            | 変更前の内容。nullかundefinedなら「未登録」と書く。                                                                                                                                          |
| `after`（必須）  | `Child`   |            | 変更後の内容。nullかundefinedなら「未登録」と書く。                                                                                                                                          |
| `beforeLabel`    | `string`  | `"現在"`   | 変更前の見出し（h4）。                                                                                                                                                                       |
| `afterLabel`     | `string`  | `"変更後"` | 変更後の見出し（h4）。                                                                                                                                                                       |
| `changed`        | `boolean` | `true`     | 値が変わるかどうか。trueは見出しに「変更あり」を添え、変更後を淡い青の背景にして間に矢印を置く。 falseは「変更なし」を添え、両方を灰色の背景にして間に等号を置く。差分の判定は利用側が行う。 |

ほかに、`<section>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/comparison.css`

## コード

```tsx
import { Comparison, ValueList } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <Comparison
      label="公開範囲"
      changed={false}
      before={<p>標準</p>}
      after={<p>標準</p>}
    />
    <Comparison
      label="料金"
      before={
        <ValueList
          items={[
            { label: "平日", value: "1時間 800円" },
            { label: "土日", value: "1時間 1,000円" },
          ]}
        />
      }
      after={
        <ValueList
          items={[
            { label: "平日", value: "1時間 900円" },
            { label: "土日", value: "1時間 1,200円" },
          ]}
        />
      }
    />
    <Comparison
      label="未登録からの追加"
      before={null}
      after={<ValueList items={[{ label: "件数", value: 0 }]} />}
    />
    <Comparison
      label="海外拠点から届いた、2026年度秋の利用方法と受付変更に関する説明文"
      before={
        <p>
          予約の取り消しは3日前までを無料とし、それ以降は利用料の半額をいただきます。当日の変更は受け付けていません。
        </p>
      }
      after={
        <p>
          予約の取り消しは前日までを無料とし、当日の変更は受付で相談できるようにします。参照先：review-abcdefghijklmnopqrstuvwxyz0123456789
        </p>
      }
    />
    <div style="max-inline-size: 20rem">
      <Comparison
        label="狭い場所の比較"
        before={<p>9月30日</p>}
        after={<p>10月7日</p>}
      />
    </div>
    <div dir="rtl" lang="ar">
      <Comparison
        label="نطاق النشر"
        beforeLabel="الحالي"
        afterLabel="بعد التغيير"
        before={<p>الأعضاء فقط</p>}
        after={<p>الجميع</p>}
      />
    </div>
    <Comparison
      label="入れ子の比較"
      before={<p>現在の説明</p>}
      after={
        <Comparison label="補足" before={null} after={<p>補足を追加します。</p>} />
      }
    />
  </div>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<div class="rx-stack">
  <section class="rx-comparison" aria-label="公開範囲" data-changed="false">
    <h3 class="title">公開範囲<span class="state">変更なし</span></h3>
    <div class="pair">
      <div class="before">
        <h4>現在</h4>
        <div class="body"><p>標準</p></div>
      </div>
      <div class="after">
        <h4>変更後</h4>
        <div class="body"><p>標準</p></div>
      </div>
    </div>
  </section>
  <section class="rx-comparison" aria-label="料金" data-changed="true">
    <h3 class="title">料金<span class="state">変更あり</span></h3>
    <div class="pair">
      <div class="before">
        <h4>現在</h4>
        <div class="body">
          <dl class="rx-value-list">
            <div>
              <dt>平日</dt>
              <dd>1時間 800円</dd>
            </div>
            <div>
              <dt>土日</dt>
              <dd>1時間 1,000円</dd>
            </div>
          </dl>
        </div>
      </div>
      <div class="after">
        <h4>変更後</h4>
        <div class="body">
          <dl class="rx-value-list">
            <div>
              <dt>平日</dt>
              <dd>1時間 900円</dd>
            </div>
            <div>
              <dt>土日</dt>
              <dd>1時間 1,200円</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>
  <section class="rx-comparison" aria-label="未登録からの追加" data-changed="true">
    <h3 class="title">未登録からの追加<span class="state">変更あり</span></h3>
    <div class="pair">
      <div class="before">
        <h4>現在</h4>
        <div class="body"><p>未登録</p></div>
      </div>
      <div class="after">
        <h4>変更後</h4>
        <div class="body">
          <dl class="rx-value-list">
            <div>
              <dt>件数</dt>
              <dd>0</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </section>
  <section
    class="rx-comparison"
    aria-label="海外拠点から届いた、2026年度秋の利用方法と受付変更に関する説明文"
    data-changed="true"
  >
    <h3 class="title">
      海外拠点から届いた、2026年度秋の利用方法と受付変更に関する説明文<span
        class="state"
        >変更あり</span
      >
    </h3>
    <div class="pair">
      <div class="before">
        <h4>現在</h4>
        <div class="body">
          <p>
            予約の取り消しは3日前までを無料とし、それ以降は利用料の半額をいただきます。当日の変更は受け付けていません。
          </p>
        </div>
      </div>
      <div class="after">
        <h4>変更後</h4>
        <div class="body">
          <p>
            予約の取り消しは前日までを無料とし、当日の変更は受付で相談できるようにします。参照先：review-abcdefghijklmnopqrstuvwxyz0123456789
          </p>
        </div>
      </div>
    </div>
  </section>
  <div style="max-inline-size: 20rem">
    <section class="rx-comparison" aria-label="狭い場所の比較" data-changed="true">
      <h3 class="title">狭い場所の比較<span class="state">変更あり</span></h3>
      <div class="pair">
        <div class="before">
          <h4>現在</h4>
          <div class="body"><p>9月30日</p></div>
        </div>
        <div class="after">
          <h4>変更後</h4>
          <div class="body"><p>10月7日</p></div>
        </div>
      </div>
    </section>
  </div>
  <div dir="rtl" lang="ar">
    <section class="rx-comparison" aria-label="نطاق النشر" data-changed="true">
      <h3 class="title">نطاق النشر<span class="state">変更あり</span></h3>
      <div class="pair">
        <div class="before">
          <h4>الحالي</h4>
          <div class="body"><p>الأعضاء فقط</p></div>
        </div>
        <div class="after">
          <h4>بعد التغيير</h4>
          <div class="body"><p>الجميع</p></div>
        </div>
      </div>
    </section>
  </div>
  <section class="rx-comparison" aria-label="入れ子の比較" data-changed="true">
    <h3 class="title">入れ子の比較<span class="state">変更あり</span></h3>
    <div class="pair">
      <div class="before">
        <h4>現在</h4>
        <div class="body"><p>現在の説明</p></div>
      </div>
      <div class="after">
        <h4>変更後</h4>
        <div class="body">
          <section class="rx-comparison" aria-label="補足" data-changed="true">
            <h3 class="title">補足<span class="state">変更あり</span></h3>
            <div class="pair">
              <div class="before">
                <h4>現在</h4>
                <div class="body"><p>未登録</p></div>
              </div>
              <div class="after">
                <h4>変更後</h4>
                <div class="body"><p>補足を追加します。</p></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </section>
</div>
```

</details>
