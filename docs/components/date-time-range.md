<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# DateTimeRange

開始と終了の日時を並べて入力します。

## 使いどころ

- 予定や予約のように、開始と終了の日付と時刻をまとめて決める時に使います。
- 時刻の要らない単日・期間は `DatePicker`、日付か時刻の一つだけなら `Field` で包んだ `DateField`・`TimeField` を使います。

## 使い方

`legend` と、送信する名前の接頭辞 `name` を渡します。`start`・`end` には初めの `date`（`YYYY-MM-DD`）と `time`（`HH:MM`）を渡します。開始と終了を淡い背景の一つの枠に並べて矢印でつなぎ、それぞれ小さな名前の下に日付と時刻の欄を縦に並べます。欄は標準の日付・時刻入力（`DateField`・`TimeField`）です。

送信する値：`name="event"` なら、各欄の値を `event[start_date]`・`event[start_time]`・`event[end_date]`・`event[end_time]` で送ります。終日のSwitchはオンの時だけ `event[all_day]` に `1` を送り、オフの時は送りません。

`allDay` で終日のSwitchをオンにしておきます。終日の間は時刻の欄を隠しますが、欄に残っている値は送信されます。終日の時に時刻をどう扱うかはサーバー側で決めます。

`timezone` を渡すと、枠の下に地球のアイコンとタイムゾーンを添えます。表示だけで、送信はしません。

枠の幅が26rem未満の狭い場所では、開始と終了を縦に並べ、矢印を下に向けます。

開始と終了の前後関係や、未入力の検証は行いません。利用側とサーバー側で検証します。各欄の変更は `DateField`・`TimeField` のcontrollerが発火する `date-field:change`・`time-field:change` で受け取れます。

JavaScriptが無い時も、標準の日付・時刻入力とチェックボックスとして同じ名前で送信できます。

## アクセシビリティ

- 枠は `fieldset` で、`legend` がまとまりの名前です。日付と時刻の欄は「開始の日付」「終了の時刻」のように、`startLabel`・`endLabel` を先頭に付けた名前を持ちます。
- つなぎの矢印は読み上げません。終日のSwitchは `role="switch"` のcheckboxです。

## イベント

| イベント                  | 内容                                                                                                                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `date-field:beforechange` | 日付の欄を利用者が変えた時、確定の前に発火します。取り消せます（取り消すと元の値に戻します）。detailは `{ value, previousValue, reason }` で、`reason` は `pointer` か `keyboard` です。 |
| `date-field:change`       | 日付の欄の変更を確定した後に発火します。detailは `date-field:beforechange` と同じです。                                                                                                  |
| `time-field:beforechange` | 時刻の欄を利用者が変えた時、確定の前に発火します。取り消せます。detailは `{ value, previousValue, reason }` です。                                                                       |
| `time-field:change`       | 時刻の欄の変更を確定した後に発火します。detailは `time-field:beforechange` と同じです。                                                                                                  |

## API

### DateTimeRange

開始と終了の日付と時刻を矢印でつないで一つの枠に並べる。終日にすると時刻の欄を隠す。日付と時刻の欄は共通のDateField・TimeField。

| 名前             | 型        | 既定値   | 説明                                                                                                             |
| ---------------- | --------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `name`（必須）   | `string`  |          | 送信する名前の接頭辞。`${name}[start_date]`・`[start_time]`・`[end_date]`・`[end_time]`・`[all_day]`で送信する。 |
| `id`             | `string`  |          | ルートの `fieldset` に付けるID。                                                                                 |
| `legend`（必須） | `string`  |          | 枠全体の名前。legendに出す。                                                                                     |
| `start`          | `Point`   | `{}`     | 開始の初期の日付と時刻。                                                                                         |
| `end`            | `Point`   | `{}`     | 終了の初期の日付と時刻。                                                                                         |
| `allDay`         | `boolean` | `false`  | 終日のSwitchをオンにしておく。オンの間は時刻の欄を隠す。                                                         |
| `timezone`       | `string`  |          | 渡すと、末尾側に地球のアイコンとタイムゾーンを添える。                                                           |
| `startLabel`     | `string`  | `"開始"` | 開始側の小さなラベル。日付と時刻の欄の読み上げ名（「開始の日付」など）の接頭辞にも使う。                         |
| `endLabel`       | `string`  | `"終了"` | 終了側の小さなラベル。日付と時刻の欄の読み上げ名の接頭辞にも使う。                                               |
| `allDayLabel`    | `string`  | `"終日"` | 終日のSwitchの名前。                                                                                             |

ほかに、`<fieldset>`へ標準のHTML属性を渡せます。

登録するcontroller：`date-field`（`DateFieldController`）、`time-field`（`TimeFieldController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/field.css`、`components/icon.css`、`components/switch.css`、`components/date-time-range.css`

#### `Point`

| 名前   | 型       | 既定値 | 説明                 |
| ------ | -------- | ------ | -------------------- |
| `date` | `string` |        | 日付（YYYY-MM-DD）。 |
| `time` | `string` |        | 時刻（HH:MM）。      |

## コード

```tsx
import { DateTimeRange, Disclosure, DisclosureGroup } from "@tknf/retrix/hono";

export default () => (
  <div class="rx-stack">
    <DateTimeRange
      legend="日時"
      name="event"
      start={{ date: "2026-09-29", time: "09:00" }}
      end={{ date: "2026-09-29", time: "10:00" }}
      timezone="東京（UTC+9）"
    />
    <DisclosureGroup label="場面の違い">
      <Disclosure summary="終日：時刻の欄を隠す" open>
        <DateTimeRange
          legend="休館日"
          name="holiday"
          start={{ date: "2026-10-12" }}
          end={{ date: "2026-10-13" }}
          allDay
        />
      </Disclosure>
      <Disclosure summary="狭い場所：開始と終了を縦に積む">
        <div style="max-inline-size: 20rem">
          <DateTimeRange
            legend="取材"
            name="interview"
            start={{ date: "2026-10-02", time: "14:00" }}
            end={{ date: "2026-10-02", time: "15:30" }}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <DateTimeRange
            legend="الموعد"
            name="rtl-event"
            startLabel="البداية"
            endLabel="النهاية"
            allDayLabel="طوال اليوم"
            start={{ date: "2026-09-29", time: "09:00" }}
            end={{ date: "2026-09-29", time: "10:00" }}
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
  <fieldset class="rx-date-time-range">
    <legend>日時</legend>
    <div class="range">
      <div class="point">
        <span class="caption">開始</span
        ><input
          name="event[start_date]"
          value="2026-09-29"
          aria-label="開始の日付"
          type="date"
          data-controller="date-field"
          class="rx-input"
        /><span class="time"
          ><input
            name="event[start_time]"
            value="09:00"
            aria-label="開始の時刻"
            type="time"
            data-controller="time-field"
            class="rx-input"
        /></span>
      </div>
      <span class="arrow" aria-hidden="true"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-arrow"></use></svg
      ></span>
      <div class="point">
        <span class="caption">終了</span
        ><input
          name="event[end_date]"
          value="2026-09-29"
          aria-label="終了の日付"
          type="date"
          data-controller="date-field"
          class="rx-input"
        /><span class="time"
          ><input
            name="event[end_time]"
            value="10:00"
            aria-label="終了の時刻"
            type="time"
            data-controller="time-field"
            class="rx-input"
        /></span>
      </div>
    </div>
    <div class="options">
      <span class="all-day"
        ><label class="rx-switch" for="rx-switch-:r1s:"
          ><input
            name="event[all_day]"
            value="1"
            id="rx-switch-:r1s:"
            type="checkbox"
            role="switch"
            aria-labelledby="rx-switch-:r1s:-label"
          /><span><span id="rx-switch-:r1s:-label">終日</span></span></label
        ></span
      ><span class="timezone"
        ><svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-globe"></use></svg
        >東京（UTC+9）</span
      >
    </div>
  </fieldset>
  <div class="rx-disclosure-group" role="group" aria-label="場面の違い">
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
        ><span class="label"><span class="title">終日：時刻の欄を隠す</span></span>
      </summary>
      <div class="body">
        <fieldset class="rx-date-time-range">
          <legend>休館日</legend>
          <div class="range">
            <div class="point">
              <span class="caption">開始</span
              ><input
                name="holiday[start_date]"
                value="2026-10-12"
                aria-label="開始の日付"
                type="date"
                data-controller="date-field"
                class="rx-input"
              /><span class="time"
                ><input
                  name="holiday[start_time]"
                  aria-label="開始の時刻"
                  type="time"
                  data-controller="time-field"
                  class="rx-input"
              /></span>
            </div>
            <span class="arrow" aria-hidden="true"
              ><svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-arrow"></use></svg
            ></span>
            <div class="point">
              <span class="caption">終了</span
              ><input
                name="holiday[end_date]"
                value="2026-10-13"
                aria-label="終了の日付"
                type="date"
                data-controller="date-field"
                class="rx-input"
              /><span class="time"
                ><input
                  name="holiday[end_time]"
                  aria-label="終了の時刻"
                  type="time"
                  data-controller="time-field"
                  class="rx-input"
              /></span>
            </div>
          </div>
          <div class="options">
            <span class="all-day"
              ><label class="rx-switch" for="rx-switch-:r1t:"
                ><input
                  name="holiday[all_day]"
                  value="1"
                  checked=""
                  id="rx-switch-:r1t:"
                  type="checkbox"
                  role="switch"
                  aria-labelledby="rx-switch-:r1t:-label"
                /><span><span id="rx-switch-:r1t:-label">終日</span></span></label
              ></span
            >
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
        ><span class="label"
          ><span class="title">狭い場所：開始と終了を縦に積む</span></span
        >
      </summary>
      <div class="body">
        <div style="max-inline-size: 20rem">
          <fieldset class="rx-date-time-range">
            <legend>取材</legend>
            <div class="range">
              <div class="point">
                <span class="caption">開始</span
                ><input
                  name="interview[start_date]"
                  value="2026-10-02"
                  aria-label="開始の日付"
                  type="date"
                  data-controller="date-field"
                  class="rx-input"
                /><span class="time"
                  ><input
                    name="interview[start_time]"
                    value="14:00"
                    aria-label="開始の時刻"
                    type="time"
                    data-controller="time-field"
                    class="rx-input"
                /></span>
              </div>
              <span class="arrow" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-arrow"></use></svg
              ></span>
              <div class="point">
                <span class="caption">終了</span
                ><input
                  name="interview[end_date]"
                  value="2026-10-02"
                  aria-label="終了の日付"
                  type="date"
                  data-controller="date-field"
                  class="rx-input"
                /><span class="time"
                  ><input
                    name="interview[end_time]"
                    value="15:30"
                    aria-label="終了の時刻"
                    type="time"
                    data-controller="time-field"
                    class="rx-input"
                /></span>
              </div>
            </div>
            <div class="options">
              <span class="all-day"
                ><label class="rx-switch" for="rx-switch-:r1u:"
                  ><input
                    name="interview[all_day]"
                    value="1"
                    id="rx-switch-:r1u:"
                    type="checkbox"
                    role="switch"
                    aria-labelledby="rx-switch-:r1u:-label"
                  /><span><span id="rx-switch-:r1u:-label">終日</span></span></label
                ></span
              >
            </div>
          </fieldset>
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
          <fieldset class="rx-date-time-range">
            <legend>الموعد</legend>
            <div class="range">
              <div class="point">
                <span class="caption">البداية</span
                ><input
                  name="rtl-event[start_date]"
                  value="2026-09-29"
                  aria-label="البدايةの日付"
                  type="date"
                  data-controller="date-field"
                  class="rx-input"
                /><span class="time"
                  ><input
                    name="rtl-event[start_time]"
                    value="09:00"
                    aria-label="البدايةの時刻"
                    type="time"
                    data-controller="time-field"
                    class="rx-input"
                /></span>
              </div>
              <span class="arrow" aria-hidden="true"
                ><svg
                  class="rx-icon"
                  viewBox="0 0 256 256"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <use href="/assets/rx-icons.svg#rx-arrow"></use></svg
              ></span>
              <div class="point">
                <span class="caption">النهاية</span
                ><input
                  name="rtl-event[end_date]"
                  value="2026-09-29"
                  aria-label="النهايةの日付"
                  type="date"
                  data-controller="date-field"
                  class="rx-input"
                /><span class="time"
                  ><input
                    name="rtl-event[end_time]"
                    value="10:00"
                    aria-label="النهايةの時刻"
                    type="time"
                    data-controller="time-field"
                    class="rx-input"
                /></span>
              </div>
            </div>
            <div class="options">
              <span class="all-day"
                ><label class="rx-switch" for="rx-switch-:r1v:"
                  ><input
                    name="rtl-event[all_day]"
                    value="1"
                    id="rx-switch-:r1v:"
                    type="checkbox"
                    role="switch"
                    aria-labelledby="rx-switch-:r1v:-label"
                  /><span
                    ><span id="rx-switch-:r1v:-label">طوال اليوم</span></span
                  ></label
                ></span
              >
            </div>
          </fieldset>
        </div>
      </div>
    </details>
  </div>
</div>
```

</details>
