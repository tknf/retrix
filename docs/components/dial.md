<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# Dial

つまみの周りに並べた選択肢から、一つを選びます。

## 使いどころ

- 自動で閉じるまでの日数や通知のまとめの間隔のように、3〜8個の決まった値から一つを選ぶ設定を、一目で分かる形で見せる時に使います。
- 値が多い時や細かい数を選ぶ時は `Range`、選択肢の名前が長い時や説明を添える時はラジオボタンの `Choice` を使います。

## 使い方

控えめなボタンと同じ作り（平らな白、1px #ccc の枠、下に1px #ddd の影）の円いつまみの周りに、`options` の `label` を灰色の目盛りとして並べ、つまみの縁の外に短い刻みを引きます。値は左下から時計回りに右下まで、270度の弧に等しく並べます。一つを選ぶと、その値を黒い太字にし（面で囲みません）、つまみの黒い針がその値へ回ります。

目盛りは3〜8個にします。弧に並べて読める数の上限で、それより多い時は `Range` を使います。9個以上を渡した場合、9個目以降を選ぶと違う目盛りを指さないよう針を隠し、選んだ値の黒い太字だけで示します。目盛りの文言は短い数や語にします。

実体は `name` を共有するラジオボタンのグループです。選んだ値を `name` で送信し、`value` を最初に選んでおきます。`unit` はつまみの下に小さな太字で単位を添え、`disabled` は使えなくし、つまみの形と塗りはそのままに、目盛りと単位の文字だけを灰色にします。

controllerの登録は要らず、JavaScriptが無い時も同じように動きます。

## キーボード

| キー     | 動作                                                     |
| -------- | -------------------------------------------------------- |
| Tab      | 選んでいる目盛りへ入ります（標準のラジオボタンの操作）。 |
| 矢印キー | 前・次の目盛りを選びます（標準のラジオボタンの操作）。   |

## アクセシビリティ

- `fieldset` の `legend` をグループの名前、各目盛りの `label` をラジオボタンの名前として読み上げます。
- `unit` は見た目だけで読み上げません。「30」だけで意味が伝わらない時は、`legend` に「自動で閉じるまで（日）」のように単位を含めます。
- ラジオボタンは見えなくしていますが、フォーカスは受け、フォーカスした目盛りにフォーカスリングを表示します。

## API

### Dial

控えめなボタンと同じ平らな白の円いつまみのダイヤル。周りの目盛りから一つを選ぶと、つまみの針がその値へ回る。実体は一つを選ぶラジオボタンのグループなので、送信・キーボードの操作（矢印キー）・読み上げは標準のまま使える。

| 名前              | 型                      | 既定値 | 説明                                                                                        |
| ----------------- | ----------------------- | ------ | ------------------------------------------------------------------------------------------- |
| `legend`（必須）  | `string`                |        | 選ぶものの名前。fieldsetのlegendになり、つまみの上に出す。                                  |
| `name`（必須）    | `string`                |        | ラジオボタンのname。選んだ値をこの名前で送信する。                                          |
| `options`（必須） | `readonly DialOption[]` |        | 目盛りの値。左下から時計回りに右下まで、3〜8個を並べる。9個目以降を選んだ時は針を出さない。 |
| `value`           | `string`                |        | 最初に選んでおく値。どの値にも合わなければ何も選ばず、針は最初の目盛りを指す。              |
| `unit`            | `string`                |        | つまみの下に添える単位（「日」など）。                                                      |
| `disabled`        | `boolean`               |        | 全ての目盛りを使えなくし、文字だけを灰色にする。                                            |

ほかに、`<fieldset>`へ標準のHTML属性を渡せます。

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/dial.css`

#### `DialOption`

| 名前            | 型       | 既定値 | 説明                                                                 |
| --------------- | -------- | ------ | -------------------------------------------------------------------- |
| `value`（必須） | `string` |        | 送信する値。                                                         |
| `label`（必須） | `string` |        | 目盛りに出す文言。短い数や語にする。ラジオボタンの読み上げ名になる。 |

## コード

```tsx
import { Dial, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

const days = ["3", "7", "11", "30", "90", "365"].map((value) => ({
  value,
  label: value,
}));

export default () => (
  <div class="rx-stack">
    <Dial
      legend="自動で閉じるまで"
      name="auto-close"
      options={days}
      value="30"
      unit="日"
    />
    <DisclosureGroup label="目盛りの数と状態の違い">
      <Disclosure summary="目盛りが三つ" open>
        <Dial
          legend="通知のまとめ"
          name="digest"
          value="daily"
          options={[
            { value: "hourly", label: "毎時" },
            { value: "daily", label: "毎日" },
            { value: "weekly", label: "毎週" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="目盛りが八つ">
        <Dial
          legend="保存する期間"
          name="retention"
          value="90"
          unit="日"
          options={["1", "3", "7", "14", "30", "90", "180", "365"].map((value) => ({
            value,
            label: value,
          }))}
        />
      </Disclosure>
      <Disclosure summary="使えない時">
        <Dial
          legend="自動で閉じるまで"
          name="disabled-dial"
          options={days}
          value="7"
          unit="日"
          disabled
        />
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Dial
            legend="الإغلاق التلقائي"
            name="rtl-dial"
            options={days}
            value="90"
            unit="يوم"
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
  <fieldset class="rx-dial" style="--rx-dial-count: 6">
    <legend>自動で閉じるまで</legend>
    <div class="face">
      <label class="stop" style="--rx-dial-i: 0"
        ><input type="radio" name="auto-close" value="3" /><span class="value"
          >3</span
        ></label
      ><label class="stop" style="--rx-dial-i: 1"
        ><input type="radio" name="auto-close" value="7" /><span class="value"
          >7</span
        ></label
      ><label class="stop" style="--rx-dial-i: 2"
        ><input type="radio" name="auto-close" value="11" /><span class="value"
          >11</span
        ></label
      ><label class="stop" style="--rx-dial-i: 3"
        ><input type="radio" name="auto-close" value="30" checked="" /><span
          class="value"
          >30</span
        ></label
      ><label class="stop" style="--rx-dial-i: 4"
        ><input type="radio" name="auto-close" value="90" /><span class="value"
          >90</span
        ></label
      ><label class="stop" style="--rx-dial-i: 5"
        ><input type="radio" name="auto-close" value="365" /><span class="value"
          >365</span
        ></label
      ><span class="knob" aria-hidden="true"
        ><span class="tick" style="--rx-dial-i: 0"></span
        ><span class="tick" style="--rx-dial-i: 1"></span
        ><span class="tick" style="--rx-dial-i: 2"></span
        ><span class="tick" style="--rx-dial-i: 3"></span
        ><span class="tick" style="--rx-dial-i: 4"></span
        ><span class="tick" style="--rx-dial-i: 5"></span><span class="pointer"></span
      ></span>
    </div>
    <span class="unit" aria-hidden="true">日</span>
  </fieldset>
  <div class="rx-disclosure-group" role="group" aria-label="目盛りの数と状態の違い">
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
        ><span class="label"><span class="title">目盛りが三つ</span></span>
      </summary>
      <div class="body">
        <fieldset class="rx-dial" style="--rx-dial-count: 3">
          <legend>通知のまとめ</legend>
          <div class="face">
            <label class="stop" style="--rx-dial-i: 0"
              ><input type="radio" name="digest" value="hourly" /><span class="value"
                >毎時</span
              ></label
            ><label class="stop" style="--rx-dial-i: 1"
              ><input type="radio" name="digest" value="daily" checked="" /><span
                class="value"
                >毎日</span
              ></label
            ><label class="stop" style="--rx-dial-i: 2"
              ><input type="radio" name="digest" value="weekly" /><span class="value"
                >毎週</span
              ></label
            ><span class="knob" aria-hidden="true"
              ><span class="tick" style="--rx-dial-i: 0"></span
              ><span class="tick" style="--rx-dial-i: 1"></span
              ><span class="tick" style="--rx-dial-i: 2"></span
              ><span class="pointer"></span
            ></span>
          </div>
        </fieldset>
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
        ><span class="label"><span class="title">目盛りが八つ</span></span>
      </summary>
      <div class="body">
        <fieldset class="rx-dial" style="--rx-dial-count: 8">
          <legend>保存する期間</legend>
          <div class="face">
            <label class="stop" style="--rx-dial-i: 0"
              ><input type="radio" name="retention" value="1" /><span class="value"
                >1</span
              ></label
            ><label class="stop" style="--rx-dial-i: 1"
              ><input type="radio" name="retention" value="3" /><span class="value"
                >3</span
              ></label
            ><label class="stop" style="--rx-dial-i: 2"
              ><input type="radio" name="retention" value="7" /><span class="value"
                >7</span
              ></label
            ><label class="stop" style="--rx-dial-i: 3"
              ><input type="radio" name="retention" value="14" /><span class="value"
                >14</span
              ></label
            ><label class="stop" style="--rx-dial-i: 4"
              ><input type="radio" name="retention" value="30" /><span class="value"
                >30</span
              ></label
            ><label class="stop" style="--rx-dial-i: 5"
              ><input type="radio" name="retention" value="90" checked="" /><span
                class="value"
                >90</span
              ></label
            ><label class="stop" style="--rx-dial-i: 6"
              ><input type="radio" name="retention" value="180" /><span class="value"
                >180</span
              ></label
            ><label class="stop" style="--rx-dial-i: 7"
              ><input type="radio" name="retention" value="365" /><span class="value"
                >365</span
              ></label
            ><span class="knob" aria-hidden="true"
              ><span class="tick" style="--rx-dial-i: 0"></span
              ><span class="tick" style="--rx-dial-i: 1"></span
              ><span class="tick" style="--rx-dial-i: 2"></span
              ><span class="tick" style="--rx-dial-i: 3"></span
              ><span class="tick" style="--rx-dial-i: 4"></span
              ><span class="tick" style="--rx-dial-i: 5"></span
              ><span class="tick" style="--rx-dial-i: 6"></span
              ><span class="tick" style="--rx-dial-i: 7"></span
              ><span class="pointer"></span
            ></span>
          </div>
          <span class="unit" aria-hidden="true">日</span>
        </fieldset>
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
        ><span class="label"><span class="title">使えない時</span></span>
      </summary>
      <div class="body">
        <fieldset class="rx-dial" style="--rx-dial-count: 6" disabled="">
          <legend>自動で閉じるまで</legend>
          <div class="face">
            <label class="stop" style="--rx-dial-i: 0"
              ><input type="radio" name="disabled-dial" value="3" /><span class="value"
                >3</span
              ></label
            ><label class="stop" style="--rx-dial-i: 1"
              ><input type="radio" name="disabled-dial" value="7" checked="" /><span
                class="value"
                >7</span
              ></label
            ><label class="stop" style="--rx-dial-i: 2"
              ><input type="radio" name="disabled-dial" value="11" /><span class="value"
                >11</span
              ></label
            ><label class="stop" style="--rx-dial-i: 3"
              ><input type="radio" name="disabled-dial" value="30" /><span class="value"
                >30</span
              ></label
            ><label class="stop" style="--rx-dial-i: 4"
              ><input type="radio" name="disabled-dial" value="90" /><span class="value"
                >90</span
              ></label
            ><label class="stop" style="--rx-dial-i: 5"
              ><input type="radio" name="disabled-dial" value="365" /><span
                class="value"
                >365</span
              ></label
            ><span class="knob" aria-hidden="true"
              ><span class="tick" style="--rx-dial-i: 0"></span
              ><span class="tick" style="--rx-dial-i: 1"></span
              ><span class="tick" style="--rx-dial-i: 2"></span
              ><span class="tick" style="--rx-dial-i: 3"></span
              ><span class="tick" style="--rx-dial-i: 4"></span
              ><span class="tick" style="--rx-dial-i: 5"></span
              ><span class="pointer"></span
            ></span>
          </div>
          <span class="unit" aria-hidden="true">日</span>
        </fieldset>
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
          <fieldset class="rx-dial" style="--rx-dial-count: 6">
            <legend>الإغلاق التلقائي</legend>
            <div class="face">
              <label class="stop" style="--rx-dial-i: 0"
                ><input type="radio" name="rtl-dial" value="3" /><span class="value"
                  >3</span
                ></label
              ><label class="stop" style="--rx-dial-i: 1"
                ><input type="radio" name="rtl-dial" value="7" /><span class="value"
                  >7</span
                ></label
              ><label class="stop" style="--rx-dial-i: 2"
                ><input type="radio" name="rtl-dial" value="11" /><span class="value"
                  >11</span
                ></label
              ><label class="stop" style="--rx-dial-i: 3"
                ><input type="radio" name="rtl-dial" value="30" /><span class="value"
                  >30</span
                ></label
              ><label class="stop" style="--rx-dial-i: 4"
                ><input type="radio" name="rtl-dial" value="90" checked="" /><span
                  class="value"
                  >90</span
                ></label
              ><label class="stop" style="--rx-dial-i: 5"
                ><input type="radio" name="rtl-dial" value="365" /><span class="value"
                  >365</span
                ></label
              ><span class="knob" aria-hidden="true"
                ><span class="tick" style="--rx-dial-i: 0"></span
                ><span class="tick" style="--rx-dial-i: 1"></span
                ><span class="tick" style="--rx-dial-i: 2"></span
                ><span class="tick" style="--rx-dial-i: 3"></span
                ><span class="tick" style="--rx-dial-i: 4"></span
                ><span class="tick" style="--rx-dial-i: 5"></span
                ><span class="pointer"></span
              ></span>
            </div>
            <span class="unit" aria-hidden="true">يوم</span>
          </fieldset>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
