<!-- このファイルはvp run docs:componentsで生成します。直接編集しないでください。 -->

# DatePicker

日付や期間を、一つの入力欄で選びます。

## 使いどころ

- 日付を一つ、または開始日と終了日の期間を、一つの欄とカレンダーで選ぶ時に使います。
- 一日で終わることも数日にわたることもある項目（予定の日付など）は `mode="flexible"` にして、単日か期間かを利用者が決められるようにします。
- 開始日と終了日が別々の項目で、片方または両方が任意の時は、`range` ではなく `single` を二つ置き、`minFrom`・`maxFrom` で前後をつなぎます。
- 時刻も一緒に決める時は `DateTimeRange`、月や週の予定を見渡して日付を探す時は `Calendar` を使います。

## 使い方

`mode` で形を選び、送る名前と初めの値を渡します。`single` は `name` と `value`、`range` は `startName`・`endName` と `start`・`end`、`flexible` は `startName`・`endName`・`kindName` と初めの `selection` です。欄には単日を `YYYY/MM/DD`、期間を `YYYY/MM/DD – YYYY/MM/DD` で表示します。

欄の端のボタンでカレンダーを開きます。カレンダーで選んだ日付はその場で送信フィールドへ反映し、閉じても保持します。`range` では開いて最初に選んだ日が開始日、その後に選んだ日が終了日になり、開始日より前の日を選ぶと開始日も動きます。上部の終了日の欄にフォーカスすると、終了日から選び直せます。`flexible` は下部の「終了日」スイッチで期間に切り替えます。開始日がある時にShift＋クリックすると、その日までの期間になります。「クリア」は選択を空にして閉じます。

日付は直接入力もできます。欄には `YYYY/MM/DD`（`YYYY-MM-DD` も可）、期間は二つの日付を「–」で区切って入力します（「~」「〜」「 - 」も受け付けます）。カレンダー上部の欄では `2026/9/1` のようなゼロ埋めしない日付も受け付けます。入力途中の不正な文字列は送信値に反映せず、欄の下に直し方を出します。

送信する値：日付は指定した名前へ `YYYY-MM-DD` で送り、表示用の文字列は送りません。`single` は `name` の一つ、`range` は `startName`・`endName` の二つを送ります。`flexible` はそれに加えて `kindName` へ `single` か `range` を送り、同じ日の期間も `range` のまま保ちます。未入力の日付と、`flexible` の単日の終了日は空文字を送ります。空の扱いはサーバー側で決めます。`date[start]` のような角括弧を含む名前もそのまま送り、入れ子への変換はサーバー側で行います。

`required` は未入力を誤りにし、`range` では開始日と終了日の両方を求めます。存在しない日付、範囲外の日付、開始日より前の終了日も誤りです。誤りは欄の下に理由を出し、直すまでフォームの送信を止めます。`readonly` は値を表示したまま送り、カレンダーは開きません。`disabled` は欄全体を使えなくし、値を送りません。

日付同士の上限・下限：`min`・`max` は固定の範囲です。`minFrom` は参照する日の当日以降、`maxFrom` は当日以前を許可します。参照先はDatePickerのルートID、または `YYYY-MM-DD` を値に持つ通常の `input` のIDで、ラベル・name・必須かどうかから関係を推測しません。`{ id, offsetDays }` で日数の差を付け（`1` で翌日以降、`-1` で前日以前）、期間の終了日を参照する時は `bound: "end"` にします。固定の `min`・`max` と併せると、両方を満たす日だけを許可します。

例えば受付日に `maxFrom="response"`、対応予定日に `minFrom="received"` を渡すと、受付日は対応予定日以前、対応予定日は受付日以降に限られます。原稿締切に `maxFrom={{ id: "release", offsetDays: -1 }}`、公開予定日に `minFrom={{ id: "manuscript", offsetDays: 1 }}` を渡すと、締切は公開日の前日まで、公開日は締切の翌日以降になります。

連動は参照先の変更・`refresh()`・フォームのリセットに追従し、相手の値は書き換えません。参照先が空・不正・ページに無い時は、その条件を外します。上限が下限より前になると選べる日が無くなり、欄の下にその旨を出します。条件から外れた既存の値は残したまま誤りを出し、直すまで送信を止めます。前後関係は保存先でも検証します。

変更のイベント：値を確定する前に取り消せる `date-picker:beforechange` を、確定した後に `date-picker:change` を発火します。送信フィールドにも標準の `input`・`change` を発火するので、フォームの変更の検知はそのまま使えます。外から送信フィールドの値を変えた時は、そのフィールドに `input`・`change` を発火するか、controllerの `refresh()` を呼んで表示を合わせます。フォームのリセットでは初めの値に戻します。

JavaScriptが無い時やPopover APIを使えないブラウザでは、標準の日付入力（`type="date"`）を表示します。`range` と `flexible` は開始日・終了日の二つの欄を置き、`flexible` には「日付の形式」の選択を加えます。送る名前と値の形は同じです。`minFrom`・`maxFrom` は連動しないので、サーバー側でも検証します。

## キーボード

| キー                               | 動作                                                                                                              |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Enter・Space（開くボタン）         | カレンダーを開き、上部の日付の欄へ移ります。指で操作する画面（`pointer: coarse`）では、選んでいる日付へ移ります。 |
| Enter（上部の欄）                  | 入力した日付を確定し、誤りが無ければ閉じます。                                                                    |
| ↓（上部の欄）                      | 日付のグリッドへ移ります。                                                                                        |
| ←・→                               | 前後の日へ移ります。右から左に読む時は逆です。月をまたぐと表示の月も移ります。                                    |
| ↑・↓                               | 前後の週の同じ曜日へ移ります。                                                                                    |
| Home・End                          | その週の月曜・日曜へ移ります。                                                                                    |
| PageUp・PageDown                   | 前後の月の同じ日へ移ります。                                                                                      |
| Shift＋PageUp・PageDown            | 前後の年の同じ日へ移ります。                                                                                      |
| Enter・Space（日付）               | その日を選びます。                                                                                                |
| Shift＋Enter・Shift＋Space（日付） | `flexible` で開始日がある時、その日までの期間にします。                                                           |
| Esc                                | カレンダーを閉じ、開くボタンへ戻ります。                                                                          |

## アクセシビリティ

- `label` は欄の `legend` になり、表示の欄・開くボタン（「〜のカレンダーを開く」）・カレンダー（`role="dialog"`、「〜を選択」）の名前にも使います。開くボタンは `aria-haspopup="dialog"` と `aria-expanded` を持ちます。
- 日付のグリッドは `role="grid"` で、表示中の年月を名前にし、月を移ると年月を読み上げます。各日は「2026年9月12日」の形の名前を持ち、選んだ日に `aria-pressed="true"`、今日に `aria-current="date"` を付けます。Tabでグリッドへ入る日は一つだけです。
- 選んでいる状態（「開始日を選んでください。」など）と上部の欄の誤りは `role="status"` で伝えます。
- 欄の誤りは表示の欄と送信フィールドに `aria-invalid` を付け、`aria-describedby` に誤りの文を加えます。`help` も同じく関連付けます。
- フォーカスがカレンダーの外へ出ると閉じます。

## イベント

| イベント                   | 内容                                                                                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `date-picker:beforechange` | 値を確定する前に発火します。取り消せます（取り消すと表示を元に戻します）。detailは `{ selection, previousSelection }` で、どちらも `{ kind, start, end? }` の形です。 |
| `date-picker:change`       | 値を確定した後に発火します。detailは `date-picker:beforechange` と同じです。                                                                                          |
| `date-picker:sync`         | 表示を送信フィールドの値に合わせ直した時に発火します。detailはありません。`minFrom`・`maxFrom` の連動はこのイベントを受けて追従します。                               |

## API

### DatePicker

| 名前                    | 型                                   | 既定値     | 説明                                                                                                                                                                                      |
| ----------------------- | ------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`（必須）         | `string`                             |            | 欄の名前。legendに出し、カレンダーを開くボタンとカレンダーの読み上げ名にも使う。                                                                                                          |
| `min`                   | `string`                             |            | 選べる最も早い日（YYYY-MM-DD）。minFromと併用すると、遅い方が下限になる。                                                                                                                 |
| `max`                   | `string`                             |            | 選べる最も遅い日（YYYY-MM-DD）。maxFromと併用すると、早い方が上限になる。                                                                                                                 |
| `minFrom`               | `string \| DatePickerBoundReference` |            | 下限を別の日付から取る。DatePickerのルートID、またはYYYY-MM-DDを値に持つinputのIDを渡す。参照先の日（offsetDaysを足した日）以降を許可する。参照先が空・不正・未配置なら、この条件を外す。 |
| `maxFrom`               | `string \| DatePickerBoundReference` |            | 上限を別の日付から取る。DatePickerのルートID、またはYYYY-MM-DDを値に持つinputのIDを渡す。参照先の日（offsetDaysを足した日）以前を許可する。参照先が空・不正・未配置なら、この条件を外す。 |
| `required`              | `boolean`                            |            | 未入力をエラーにする。rangeでは開始日・終了日の両方を求める。                                                                                                                             |
| `readonly`              | `boolean`                            |            | 値を見せたまま編集を止める。カレンダーは開かず、値は送信する。                                                                                                                            |
| `help`                  | `string`                             |            | 欄の下に出す補足。入力欄のaria-describedbyに関連付ける。                                                                                                                                  |
| `mode`（形による）      | `"single" \| "range" \| "flexible"`  | `"single"` | singleは単日、rangeは期間、flexibleは単日と期間を利用者が切り替える。                                                                                                                     |
| `name`（形による）      | `string`                             |            | 日付をYYYY-MM-DDで送るフィールドの名前。                                                                                                                                                  |
| `value`                 | `string`                             |            | 初期の日付（YYYY-MM-DD）。                                                                                                                                                                |
| `startName`（形による） | `string`                             |            | 開始日をYYYY-MM-DDで送るフィールドの名前。flexibleでも同じ。                                                                                                                              |
| `endName`（形による）   | `string`                             |            | 終了日をYYYY-MM-DDで送るフィールドの名前。flexibleの単日では空文字を送る。                                                                                                                |
| `start`                 | `string`                             |            | 初期の開始日（YYYY-MM-DD）。                                                                                                                                                              |
| `end`                   | `string`                             |            | 初期の終了日（YYYY-MM-DD）。                                                                                                                                                              |
| `kindName`（形による）  | `string`                             |            | 選んだ形（singleまたはrange）を送るフィールドの名前。                                                                                                                                     |
| `selection`（形による） | `DatePickerSelection`                |            | 初期の形と日付。同日の期間もrangeのまま保つ。                                                                                                                                             |

ほかに、`<fieldset>`へ標準のHTML属性を渡せます。

登録するcontroller：`date-picker`（`DatePickerController`）

読み込むCSS：`layers.css`、`reset.css`、`tokens.css`、`base.css`、`layout.css`、`components/button.css`、`components/overlay.css`、`components/field.css`、`components/icon.css`、`components/switch.css`、`components/date-picker.css`

#### `DatePickerBoundReference`

idはDatePickerのルート、または通常の日付inputを参照する。

| 名前         | 型                 | 既定値 | 説明                                                                          |
| ------------ | ------------------ | ------ | ----------------------------------------------------------------------------- |
| `id`（必須） | `string`           |        | 参照するDatePickerのルートID、またはYYYY-MM-DDを値に持つinputのID。           |
| `bound`      | `"start" \| "end"` |        | 参照先が期間の時に、開始日と終了日のどちらを使うか。通常のinputでは使わない。 |
| `offsetDays` | `number`           |        | 参照先の日に足す日数。1で翌日から、-1で前日まで、のように差を付ける。         |

#### `DatePickerSelection`

単日と同日の期間も、呼び出し側が指定した種別のまま扱う。

kind: "single"

| 名前            | 型         | 既定値 | 説明                                 |
| --------------- | ---------- | ------ | ------------------------------------ |
| `kind`（必須）  | `"single"` |        | 単日。                               |
| `start`（必須） | `string`   |        | 日付（YYYY-MM-DD）。未入力は空文字。 |

kind: "range"

| 名前            | 型        | 既定値 | 説明                                             |
| --------------- | --------- | ------ | ------------------------------------------------ |
| `kind`（必須）  | `"range"` |        | 期間。開始日と終了日が同じ日でも期間として扱う。 |
| `start`（必須） | `string`  |        | 開始日（YYYY-MM-DD）。未入力は空文字。           |
| `end`（必須）   | `string`  |        | 終了日（YYYY-MM-DD）。未入力は空文字。           |

## コード

```tsx
import { Disclosure, Button, DatePicker, FieldGroup } from "@tknf/retrix/hono";

export default () => (
  <form id="date-picker-examples" class="rx-stack" aria-label="日付の選択例">
    <DatePicker
      id="picker-single"
      mode="single"
      label="公開日"
      name="published_on"
      value="2026-09-12"
      required
      help="日付をひとつ選択します。"
    />
    <DatePicker
      id="picker-range"
      mode="range"
      label="集計期間"
      startName="report_start"
      endName="report_end"
      start="2026-09-01"
      end="2026-09-30"
      required
      help="開始日・終了日の両方を指定します。"
    />
    <DatePicker
      id="picker-flexible"
      form="date-picker-examples"
      mode="flexible"
      label="予定日"
      startName="schedule[start]"
      endName="schedule[end]"
      kindName="schedule[kind]"
      selection={{ kind: "single", start: "2026-09-12" }}
      help="1日だけの予定にも、数日にわたる予定にも使えます。"
    />
    <FieldGroup
      legend="開始日・終了日を別々に指定"
      description="開始日は必須、終了日は任意です。互いの日付を上限・下限として連動します。"
    >
      <DatePicker
        id="picker-independent-start"
        label="開始日"
        name="starts_on"
        maxFrom="picker-independent-end"
        value="2026-09-01"
        required
      />
      <DatePicker
        id="picker-independent-end"
        label="終了日"
        name="ends_on"
        minFrom="picker-independent-start"
      />
    </FieldGroup>
    <FieldGroup
      legend="項目名を問わず前後を連動"
      description="原稿締切は公開日の前日まで。公開日は原稿締切の翌日以降です。"
    >
      <DatePicker
        id="picker-deadline"
        label="原稿締切"
        name="manuscript_deadline"
        value="2026-09-15"
        maxFrom={{ id: "picker-release", offsetDays: -1 }}
      />
      <DatePicker
        id="picker-release"
        label="公開予定日"
        name="release_on"
        value="2026-09-20"
        minFrom={{ id: "picker-deadline", offsetDays: 1 }}
      />
    </FieldGroup>
    <Button type="reset">初期値に戻す</Button>
    <Disclosure summary="未入力・同日・境界・利用不可">
      <div class="rx-stack">
        <DatePicker label="未入力の日付" name="empty_date" />
        <DatePicker
          label="未入力の期間"
          mode="range"
          startName="empty_start"
          endName="empty_end"
        />
        <DatePicker
          id="picker-same"
          label="同日の期間"
          mode="flexible"
          startName="same[start]"
          endName="same[end]"
          kindName="same[kind]"
          selection={{ kind: "range", start: "2026-09-12", end: "2026-09-12" }}
        />
        <DatePicker
          id="picker-bounded"
          label="9月の期間"
          mode="range"
          startName="bounded_start"
          endName="bounded_end"
          start="2026-09-01"
          end="2026-09-30"
          min="2026-09-01"
          max="2026-09-30"
        />
        <DatePicker
          label="利用不可の日付"
          name="disabled_date"
          value="2026-09-12"
          disabled
        />
        <DatePicker
          label="読み取り専用の日付"
          name="readonly_date"
          value="2026-09-12"
          readonly
        />
      </div>
    </Disclosure>
  </form>
);
```

<details>
<summary>出力されるHTML</summary>

```html
<form id="date-picker-examples" class="rx-stack" aria-label="日付の選択例">
  <fieldset
    id="picker-single"
    class="rx-date-picker"
    data-controller="date-picker"
    data-enhancement="pending"
    data-date-picker-choice-value="single"
    data-date-picker-mode-value="single"
  >
    <legend id="picker-single-label" class="label">公開日</legend>
    <div class="control" data-date-picker-target="control">
      <input
        id="picker-single-input"
        value="2026/09/12"
        aria-labelledby="picker-single-label"
        aria-describedby="picker-single-help"
        required=""
        placeholder="日付を選択"
        autocomplete="off"
        spellcheck="false"
        data-date-picker-target="display"
        disabled=""
        class="rx-input"
      /><button
        class="toggle"
        type="button"
        popovertarget="picker-single-calendar"
        aria-label="公開日のカレンダーを開く"
        aria-haspopup="dialog"
        data-date-picker-target="trigger"
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-calendar"></use>
        </svg>
      </button>
    </div>
    <div class="fallback" data-date-picker-target="fallback">
      <div class="rx-field">
        <div class="heading"><label for="picker-single-start">公開日</label></div>
        <input
          id="picker-single-start"
          aria-describedby="picker-single-help"
          type="date"
          name="published_on"
          value="2026-09-12"
          required=""
          data-date-picker-target="start"
          class="rx-input"
        />
      </div>
      <div hidden="">
        <div class="rx-field">
          <div class="heading"><label for="picker-single-end">終了日</label></div>
          <input
            id="picker-single-end"
            aria-describedby="picker-single-help"
            type="date"
            value=""
            disabled=""
            data-date-picker-target="end"
            class="rx-input"
          />
        </div>
      </div>
      <input type="hidden" value="single" data-date-picker-target="kind" />
    </div>
    <div class="messages">
      <p class="help" id="picker-single-help"><span>日付をひとつ選択します。</span></p>
      <p
        class="error"
        id="picker-single-error"
        data-date-picker-target="error"
        hidden=""
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
        ><span data-date-picker-target="errorText"></span>
      </p>
    </div>
    <div
      id="picker-single-calendar"
      class="panel"
      popover="auto"
      role="dialog"
      aria-label="公開日を選択"
      data-positioned="false"
      data-date-picker-target="panel"
    >
      <div class="editors" data-date-picker-target="editors">
        <input
          aria-label="日付"
          placeholder="YYYY/MM/DD"
          autocomplete="off"
          spellcheck="false"
          data-date-picker-target="editorStart"
          data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
          class="rx-input"
        /><input
          aria-label="終了日"
          placeholder="YYYY/MM/DD"
          autocomplete="off"
          spellcheck="false"
          data-date-picker-target="editorEnd"
          hidden=""
          data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
          class="rx-input"
        />
      </div>
      <p
        id="picker-single-editor-error"
        class="editor-error"
        data-date-picker-target="editorError"
        role="status"
        hidden=""
      ></p>
      <div class="month">
        <strong
          id="picker-single-month"
          data-date-picker-target="month"
          aria-live="polite"
        ></strong
        ><button
          class="rx-button button"
          type="button"
          data-action="date-picker#currentMonth"
          data-date-picker-target="today"
        >
          今日</button
        ><button
          class="rx-button button previous"
          type="button"
          data-icon-only="true"
          aria-label="前の月"
          data-action="date-picker#previousMonth"
          data-date-picker-target="previous"
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
        ><button
          class="rx-button button next"
          type="button"
          data-icon-only="true"
          aria-label="次の月"
          data-action="date-picker#nextMonth"
          data-date-picker-target="next"
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
      </div>
      <p class="selection" role="status" data-date-picker-target="selection"></p>
      <table class="grid" role="grid" aria-labelledby="picker-single-month">
        <thead>
          <tr>
            <th scope="col" aria-label="月曜日">月</th>
            <th scope="col" aria-label="火曜日">火</th>
            <th scope="col" aria-label="水曜日">水</th>
            <th scope="col" aria-label="木曜日">木</th>
            <th scope="col" aria-label="金曜日">金</th>
            <th scope="col" aria-label="土曜日">土</th>
            <th scope="col" aria-label="日曜日">日</th>
          </tr>
        </thead>
        <tbody data-date-picker-target="days"></tbody>
      </table>
      <div class="actions">
        <button
          class="rx-button button"
          type="button"
          data-action="date-picker#clearSelection"
        >
          <span>クリア</span>
        </button>
      </div>
    </div>
  </fieldset>
  <fieldset
    id="picker-range"
    class="rx-date-picker"
    data-controller="date-picker"
    data-enhancement="pending"
    data-date-picker-choice-value="range"
    data-date-picker-mode-value="range"
  >
    <legend id="picker-range-label" class="label">集計期間</legend>
    <div class="control" data-date-picker-target="control">
      <input
        id="picker-range-input"
        value="2026/09/01 – 2026/09/30"
        aria-labelledby="picker-range-label"
        aria-describedby="picker-range-help"
        required=""
        placeholder="期間を選択"
        autocomplete="off"
        spellcheck="false"
        data-date-picker-target="display"
        disabled=""
        class="rx-input"
      /><button
        class="toggle"
        type="button"
        popovertarget="picker-range-calendar"
        aria-label="集計期間のカレンダーを開く"
        aria-haspopup="dialog"
        data-date-picker-target="trigger"
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-calendar"></use>
        </svg>
      </button>
    </div>
    <div class="fallback" data-date-picker-target="fallback">
      <div class="rx-field">
        <div class="heading"><label for="picker-range-start">開始日</label></div>
        <input
          id="picker-range-start"
          aria-describedby="picker-range-help"
          type="date"
          name="report_start"
          value="2026-09-01"
          required=""
          data-date-picker-target="start"
          class="rx-input"
        />
      </div>
      <div>
        <div class="rx-field">
          <div class="heading"><label for="picker-range-end">終了日</label></div>
          <input
            id="picker-range-end"
            aria-describedby="picker-range-help"
            type="date"
            name="report_end"
            value="2026-09-30"
            required=""
            data-date-picker-target="end"
            class="rx-input"
          />
        </div>
      </div>
      <input type="hidden" value="range" data-date-picker-target="kind" />
    </div>
    <div class="messages">
      <p class="help" id="picker-range-help">
        <span>開始日・終了日の両方を指定します。</span>
      </p>
      <p
        class="error"
        id="picker-range-error"
        data-date-picker-target="error"
        hidden=""
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
        ><span data-date-picker-target="errorText"></span>
      </p>
    </div>
    <div
      id="picker-range-calendar"
      class="panel"
      popover="auto"
      role="dialog"
      aria-label="集計期間を選択"
      data-positioned="false"
      data-date-picker-target="panel"
    >
      <div class="editors" data-date-picker-target="editors">
        <input
          aria-label="開始日"
          placeholder="YYYY/MM/DD"
          autocomplete="off"
          spellcheck="false"
          data-date-picker-target="editorStart"
          data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
          class="rx-input"
        /><input
          aria-label="終了日"
          placeholder="YYYY/MM/DD"
          autocomplete="off"
          spellcheck="false"
          data-date-picker-target="editorEnd"
          data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
          class="rx-input"
        />
      </div>
      <p
        id="picker-range-editor-error"
        class="editor-error"
        data-date-picker-target="editorError"
        role="status"
        hidden=""
      ></p>
      <div class="month">
        <strong
          id="picker-range-month"
          data-date-picker-target="month"
          aria-live="polite"
        ></strong
        ><button
          class="rx-button button"
          type="button"
          data-action="date-picker#currentMonth"
          data-date-picker-target="today"
        >
          今日</button
        ><button
          class="rx-button button previous"
          type="button"
          data-icon-only="true"
          aria-label="前の月"
          data-action="date-picker#previousMonth"
          data-date-picker-target="previous"
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
        ><button
          class="rx-button button next"
          type="button"
          data-icon-only="true"
          aria-label="次の月"
          data-action="date-picker#nextMonth"
          data-date-picker-target="next"
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
      </div>
      <p class="selection" role="status" data-date-picker-target="selection"></p>
      <table class="grid" role="grid" aria-labelledby="picker-range-month">
        <thead>
          <tr>
            <th scope="col" aria-label="月曜日">月</th>
            <th scope="col" aria-label="火曜日">火</th>
            <th scope="col" aria-label="水曜日">水</th>
            <th scope="col" aria-label="木曜日">木</th>
            <th scope="col" aria-label="金曜日">金</th>
            <th scope="col" aria-label="土曜日">土</th>
            <th scope="col" aria-label="日曜日">日</th>
          </tr>
        </thead>
        <tbody data-date-picker-target="days"></tbody>
      </table>
      <div class="actions">
        <button
          class="rx-button button"
          type="button"
          data-action="date-picker#clearSelection"
        >
          <span>クリア</span>
        </button>
      </div>
    </div>
  </fieldset>
  <fieldset
    form="date-picker-examples"
    id="picker-flexible"
    class="rx-date-picker"
    data-controller="date-picker"
    data-enhancement="pending"
    data-date-picker-choice-value="flexible"
    data-date-picker-mode-value="single"
  >
    <legend id="picker-flexible-label" class="label">予定日</legend>
    <div class="control" data-date-picker-target="control">
      <input
        id="picker-flexible-input"
        value="2026/09/12"
        aria-labelledby="picker-flexible-label"
        aria-describedby="picker-flexible-help"
        form="date-picker-examples"
        placeholder="日付を選択"
        autocomplete="off"
        spellcheck="false"
        data-date-picker-target="display"
        disabled=""
        class="rx-input"
      /><button
        class="toggle"
        type="button"
        popovertarget="picker-flexible-calendar"
        aria-label="予定日のカレンダーを開く"
        aria-haspopup="dialog"
        data-date-picker-target="trigger"
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-calendar"></use>
        </svg>
      </button>
    </div>
    <div class="fallback" data-date-picker-target="fallback">
      <div class="rx-field">
        <div class="heading"><label for="picker-flexible-start">開始日</label></div>
        <input
          id="picker-flexible-start"
          aria-describedby="picker-flexible-help"
          type="date"
          name="schedule[start]"
          value="2026-09-12"
          form="date-picker-examples"
          data-date-picker-target="start"
          class="rx-input"
        />
      </div>
      <div>
        <div class="rx-field">
          <div class="heading"><label for="picker-flexible-end">終了日</label></div>
          <input
            id="picker-flexible-end"
            aria-describedby="picker-flexible-help"
            type="date"
            name="schedule[end]"
            value=""
            form="date-picker-examples"
            data-date-picker-target="end"
            class="rx-input"
          />
        </div>
      </div>
      <div class="rx-field">
        <div class="heading"><label for="picker-flexible-kind">日付の形式</label></div>
        <select
          id="picker-flexible-kind"
          name="schedule[kind]"
          form="date-picker-examples"
          data-date-picker-target="kind"
          class="rx-input"
        >
          <option value="single" selected="">単日</option>
          <option value="range">期間</option>
        </select>
      </div>
    </div>
    <div class="messages">
      <p class="help" id="picker-flexible-help">
        <span>1日だけの予定にも、数日にわたる予定にも使えます。</span>
      </p>
      <p
        class="error"
        id="picker-flexible-error"
        data-date-picker-target="error"
        hidden=""
      >
        <svg
          class="rx-icon"
          viewBox="0 0 256 256"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
        ><span data-date-picker-target="errorText"></span>
      </p>
    </div>
    <div
      id="picker-flexible-calendar"
      class="panel"
      popover="auto"
      role="dialog"
      aria-label="予定日を選択"
      data-positioned="false"
      data-date-picker-target="panel"
    >
      <div class="editors" data-date-picker-target="editors">
        <input
          aria-label="開始日"
          placeholder="YYYY/MM/DD"
          autocomplete="off"
          spellcheck="false"
          data-date-picker-target="editorStart"
          data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
          class="rx-input"
        /><input
          aria-label="終了日"
          placeholder="YYYY/MM/DD"
          autocomplete="off"
          spellcheck="false"
          data-date-picker-target="editorEnd"
          hidden=""
          data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
          class="rx-input"
        />
      </div>
      <p
        id="picker-flexible-editor-error"
        class="editor-error"
        data-date-picker-target="editorError"
        role="status"
        hidden=""
      ></p>
      <div class="month">
        <strong
          id="picker-flexible-month"
          data-date-picker-target="month"
          aria-live="polite"
        ></strong
        ><button
          class="rx-button button"
          type="button"
          data-action="date-picker#currentMonth"
          data-date-picker-target="today"
        >
          今日</button
        ><button
          class="rx-button button previous"
          type="button"
          data-icon-only="true"
          aria-label="前の月"
          data-action="date-picker#previousMonth"
          data-date-picker-target="previous"
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
        ><button
          class="rx-button button next"
          type="button"
          data-icon-only="true"
          aria-label="次の月"
          data-action="date-picker#nextMonth"
          data-date-picker-target="next"
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
      </div>
      <p class="selection" role="status" data-date-picker-target="selection"></p>
      <table class="grid" role="grid" aria-labelledby="picker-flexible-month">
        <thead>
          <tr>
            <th scope="col" aria-label="月曜日">月</th>
            <th scope="col" aria-label="火曜日">火</th>
            <th scope="col" aria-label="水曜日">水</th>
            <th scope="col" aria-label="木曜日">木</th>
            <th scope="col" aria-label="金曜日">金</th>
            <th scope="col" aria-label="土曜日">土</th>
            <th scope="col" aria-label="日曜日">日</th>
          </tr>
        </thead>
        <tbody data-date-picker-target="days"></tbody>
      </table>
      <div class="actions">
        <label class="rx-switch" for="picker-flexible-range-toggle"
          ><input
            data-date-picker-target="rangeToggle"
            data-action="date-picker#toggleRange"
            id="picker-flexible-range-toggle"
            type="checkbox"
            role="switch"
            aria-labelledby="picker-flexible-range-toggle-label"
          /><span
            ><span id="picker-flexible-range-toggle-label">終了日</span></span
          ></label
        ><button
          class="rx-button button"
          type="button"
          data-action="date-picker#clearSelection"
        >
          <span>クリア</span>
        </button>
      </div>
    </div>
  </fieldset>
  <fieldset class="rx-field-group">
    <legend>開始日・終了日を別々に指定</legend>
    <div class="layout">
      <p class="description">
        開始日は必須、終了日は任意です。互いの日付を上限・下限として連動します。
      </p>
      <div class="fields">
        <fieldset
          id="picker-independent-start"
          class="rx-date-picker"
          data-controller="date-picker"
          data-enhancement="pending"
          data-date-picker-choice-value="single"
          data-date-picker-mode-value="single"
          data-date-picker-max-from-value="picker-independent-end"
        >
          <legend id="picker-independent-start-label" class="label">開始日</legend>
          <div class="control" data-date-picker-target="control">
            <input
              id="picker-independent-start-input"
              value="2026/09/01"
              aria-labelledby="picker-independent-start-label"
              required=""
              placeholder="日付を選択"
              autocomplete="off"
              spellcheck="false"
              data-date-picker-target="display"
              disabled=""
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              popovertarget="picker-independent-start-calendar"
              aria-label="開始日のカレンダーを開く"
              aria-haspopup="dialog"
              data-date-picker-target="trigger"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use>
              </svg>
            </button>
          </div>
          <div class="fallback" data-date-picker-target="fallback">
            <div class="rx-field">
              <div class="heading">
                <label for="picker-independent-start-start">開始日</label>
              </div>
              <input
                id="picker-independent-start-start"
                type="date"
                name="starts_on"
                value="2026-09-01"
                required=""
                data-date-picker-target="start"
                class="rx-input"
              />
            </div>
            <div hidden="">
              <div class="rx-field">
                <div class="heading">
                  <label for="picker-independent-start-end">終了日</label>
                </div>
                <input
                  id="picker-independent-start-end"
                  type="date"
                  value=""
                  disabled=""
                  data-date-picker-target="end"
                  class="rx-input"
                />
              </div>
            </div>
            <input type="hidden" value="single" data-date-picker-target="kind" />
          </div>
          <div class="messages">
            <p
              class="error"
              id="picker-independent-start-error"
              data-date-picker-target="error"
              hidden=""
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span data-date-picker-target="errorText"></span>
            </p>
          </div>
          <div
            id="picker-independent-start-calendar"
            class="panel"
            popover="auto"
            role="dialog"
            aria-label="開始日を選択"
            data-positioned="false"
            data-date-picker-target="panel"
          >
            <div class="editors" data-date-picker-target="editors">
              <input
                aria-label="日付"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorStart"
                data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              /><input
                aria-label="終了日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorEnd"
                hidden=""
                data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              />
            </div>
            <p
              id="picker-independent-start-editor-error"
              class="editor-error"
              data-date-picker-target="editorError"
              role="status"
              hidden=""
            ></p>
            <div class="month">
              <strong
                id="picker-independent-start-month"
                data-date-picker-target="month"
                aria-live="polite"
              ></strong
              ><button
                class="rx-button button"
                type="button"
                data-action="date-picker#currentMonth"
                data-date-picker-target="today"
              >
                今日</button
              ><button
                class="rx-button button previous"
                type="button"
                data-icon-only="true"
                aria-label="前の月"
                data-action="date-picker#previousMonth"
                data-date-picker-target="previous"
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
              ><button
                class="rx-button button next"
                type="button"
                data-icon-only="true"
                aria-label="次の月"
                data-action="date-picker#nextMonth"
                data-date-picker-target="next"
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
            </div>
            <p class="selection" role="status" data-date-picker-target="selection"></p>
            <table
              class="grid"
              role="grid"
              aria-labelledby="picker-independent-start-month"
            >
              <thead>
                <tr>
                  <th scope="col" aria-label="月曜日">月</th>
                  <th scope="col" aria-label="火曜日">火</th>
                  <th scope="col" aria-label="水曜日">水</th>
                  <th scope="col" aria-label="木曜日">木</th>
                  <th scope="col" aria-label="金曜日">金</th>
                  <th scope="col" aria-label="土曜日">土</th>
                  <th scope="col" aria-label="日曜日">日</th>
                </tr>
              </thead>
              <tbody data-date-picker-target="days"></tbody>
            </table>
            <div class="actions">
              <button
                class="rx-button button"
                type="button"
                data-action="date-picker#clearSelection"
              >
                <span>クリア</span>
              </button>
            </div>
          </div>
        </fieldset>
        <fieldset
          id="picker-independent-end"
          class="rx-date-picker"
          data-controller="date-picker"
          data-enhancement="pending"
          data-date-picker-choice-value="single"
          data-date-picker-mode-value="single"
          data-date-picker-min-from-value="picker-independent-start"
        >
          <legend id="picker-independent-end-label" class="label">終了日</legend>
          <div class="control" data-date-picker-target="control">
            <input
              id="picker-independent-end-input"
              value=""
              aria-labelledby="picker-independent-end-label"
              placeholder="日付を選択"
              autocomplete="off"
              spellcheck="false"
              data-date-picker-target="display"
              disabled=""
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              popovertarget="picker-independent-end-calendar"
              aria-label="終了日のカレンダーを開く"
              aria-haspopup="dialog"
              data-date-picker-target="trigger"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use>
              </svg>
            </button>
          </div>
          <div class="fallback" data-date-picker-target="fallback">
            <div class="rx-field">
              <div class="heading">
                <label for="picker-independent-end-start">終了日</label>
              </div>
              <input
                id="picker-independent-end-start"
                type="date"
                name="ends_on"
                value=""
                data-date-picker-target="start"
                class="rx-input"
              />
            </div>
            <div hidden="">
              <div class="rx-field">
                <div class="heading">
                  <label for="picker-independent-end-end">終了日</label>
                </div>
                <input
                  id="picker-independent-end-end"
                  type="date"
                  value=""
                  disabled=""
                  data-date-picker-target="end"
                  class="rx-input"
                />
              </div>
            </div>
            <input type="hidden" value="single" data-date-picker-target="kind" />
          </div>
          <div class="messages">
            <p
              class="error"
              id="picker-independent-end-error"
              data-date-picker-target="error"
              hidden=""
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span data-date-picker-target="errorText"></span>
            </p>
          </div>
          <div
            id="picker-independent-end-calendar"
            class="panel"
            popover="auto"
            role="dialog"
            aria-label="終了日を選択"
            data-positioned="false"
            data-date-picker-target="panel"
          >
            <div class="editors" data-date-picker-target="editors">
              <input
                aria-label="日付"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorStart"
                data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              /><input
                aria-label="終了日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorEnd"
                hidden=""
                data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              />
            </div>
            <p
              id="picker-independent-end-editor-error"
              class="editor-error"
              data-date-picker-target="editorError"
              role="status"
              hidden=""
            ></p>
            <div class="month">
              <strong
                id="picker-independent-end-month"
                data-date-picker-target="month"
                aria-live="polite"
              ></strong
              ><button
                class="rx-button button"
                type="button"
                data-action="date-picker#currentMonth"
                data-date-picker-target="today"
              >
                今日</button
              ><button
                class="rx-button button previous"
                type="button"
                data-icon-only="true"
                aria-label="前の月"
                data-action="date-picker#previousMonth"
                data-date-picker-target="previous"
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
              ><button
                class="rx-button button next"
                type="button"
                data-icon-only="true"
                aria-label="次の月"
                data-action="date-picker#nextMonth"
                data-date-picker-target="next"
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
            </div>
            <p class="selection" role="status" data-date-picker-target="selection"></p>
            <table
              class="grid"
              role="grid"
              aria-labelledby="picker-independent-end-month"
            >
              <thead>
                <tr>
                  <th scope="col" aria-label="月曜日">月</th>
                  <th scope="col" aria-label="火曜日">火</th>
                  <th scope="col" aria-label="水曜日">水</th>
                  <th scope="col" aria-label="木曜日">木</th>
                  <th scope="col" aria-label="金曜日">金</th>
                  <th scope="col" aria-label="土曜日">土</th>
                  <th scope="col" aria-label="日曜日">日</th>
                </tr>
              </thead>
              <tbody data-date-picker-target="days"></tbody>
            </table>
            <div class="actions">
              <button
                class="rx-button button"
                type="button"
                data-action="date-picker#clearSelection"
              >
                <span>クリア</span>
              </button>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  </fieldset>
  <fieldset class="rx-field-group">
    <legend>項目名を問わず前後を連動</legend>
    <div class="layout">
      <p class="description">
        原稿締切は公開日の前日まで。公開日は原稿締切の翌日以降です。
      </p>
      <div class="fields">
        <fieldset
          id="picker-deadline"
          class="rx-date-picker"
          data-controller="date-picker"
          data-enhancement="pending"
          data-date-picker-choice-value="single"
          data-date-picker-mode-value="single"
          data-date-picker-max-from-value="picker-release"
          data-date-picker-max-offset-value="-1"
        >
          <legend id="picker-deadline-label" class="label">原稿締切</legend>
          <div class="control" data-date-picker-target="control">
            <input
              id="picker-deadline-input"
              value="2026/09/15"
              aria-labelledby="picker-deadline-label"
              placeholder="日付を選択"
              autocomplete="off"
              spellcheck="false"
              data-date-picker-target="display"
              disabled=""
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              popovertarget="picker-deadline-calendar"
              aria-label="原稿締切のカレンダーを開く"
              aria-haspopup="dialog"
              data-date-picker-target="trigger"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use>
              </svg>
            </button>
          </div>
          <div class="fallback" data-date-picker-target="fallback">
            <div class="rx-field">
              <div class="heading">
                <label for="picker-deadline-start">原稿締切</label>
              </div>
              <input
                id="picker-deadline-start"
                type="date"
                name="manuscript_deadline"
                value="2026-09-15"
                data-date-picker-target="start"
                class="rx-input"
              />
            </div>
            <div hidden="">
              <div class="rx-field">
                <div class="heading">
                  <label for="picker-deadline-end">終了日</label>
                </div>
                <input
                  id="picker-deadline-end"
                  type="date"
                  value=""
                  disabled=""
                  data-date-picker-target="end"
                  class="rx-input"
                />
              </div>
            </div>
            <input type="hidden" value="single" data-date-picker-target="kind" />
          </div>
          <div class="messages">
            <p
              class="error"
              id="picker-deadline-error"
              data-date-picker-target="error"
              hidden=""
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span data-date-picker-target="errorText"></span>
            </p>
          </div>
          <div
            id="picker-deadline-calendar"
            class="panel"
            popover="auto"
            role="dialog"
            aria-label="原稿締切を選択"
            data-positioned="false"
            data-date-picker-target="panel"
          >
            <div class="editors" data-date-picker-target="editors">
              <input
                aria-label="日付"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorStart"
                data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              /><input
                aria-label="終了日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorEnd"
                hidden=""
                data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              />
            </div>
            <p
              id="picker-deadline-editor-error"
              class="editor-error"
              data-date-picker-target="editorError"
              role="status"
              hidden=""
            ></p>
            <div class="month">
              <strong
                id="picker-deadline-month"
                data-date-picker-target="month"
                aria-live="polite"
              ></strong
              ><button
                class="rx-button button"
                type="button"
                data-action="date-picker#currentMonth"
                data-date-picker-target="today"
              >
                今日</button
              ><button
                class="rx-button button previous"
                type="button"
                data-icon-only="true"
                aria-label="前の月"
                data-action="date-picker#previousMonth"
                data-date-picker-target="previous"
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
              ><button
                class="rx-button button next"
                type="button"
                data-icon-only="true"
                aria-label="次の月"
                data-action="date-picker#nextMonth"
                data-date-picker-target="next"
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
            </div>
            <p class="selection" role="status" data-date-picker-target="selection"></p>
            <table class="grid" role="grid" aria-labelledby="picker-deadline-month">
              <thead>
                <tr>
                  <th scope="col" aria-label="月曜日">月</th>
                  <th scope="col" aria-label="火曜日">火</th>
                  <th scope="col" aria-label="水曜日">水</th>
                  <th scope="col" aria-label="木曜日">木</th>
                  <th scope="col" aria-label="金曜日">金</th>
                  <th scope="col" aria-label="土曜日">土</th>
                  <th scope="col" aria-label="日曜日">日</th>
                </tr>
              </thead>
              <tbody data-date-picker-target="days"></tbody>
            </table>
            <div class="actions">
              <button
                class="rx-button button"
                type="button"
                data-action="date-picker#clearSelection"
              >
                <span>クリア</span>
              </button>
            </div>
          </div>
        </fieldset>
        <fieldset
          id="picker-release"
          class="rx-date-picker"
          data-controller="date-picker"
          data-enhancement="pending"
          data-date-picker-choice-value="single"
          data-date-picker-mode-value="single"
          data-date-picker-min-from-value="picker-deadline"
          data-date-picker-min-offset-value="1"
        >
          <legend id="picker-release-label" class="label">公開予定日</legend>
          <div class="control" data-date-picker-target="control">
            <input
              id="picker-release-input"
              value="2026/09/20"
              aria-labelledby="picker-release-label"
              placeholder="日付を選択"
              autocomplete="off"
              spellcheck="false"
              data-date-picker-target="display"
              disabled=""
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              popovertarget="picker-release-calendar"
              aria-label="公開予定日のカレンダーを開く"
              aria-haspopup="dialog"
              data-date-picker-target="trigger"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use>
              </svg>
            </button>
          </div>
          <div class="fallback" data-date-picker-target="fallback">
            <div class="rx-field">
              <div class="heading">
                <label for="picker-release-start">公開予定日</label>
              </div>
              <input
                id="picker-release-start"
                type="date"
                name="release_on"
                value="2026-09-20"
                data-date-picker-target="start"
                class="rx-input"
              />
            </div>
            <div hidden="">
              <div class="rx-field">
                <div class="heading">
                  <label for="picker-release-end">終了日</label>
                </div>
                <input
                  id="picker-release-end"
                  type="date"
                  value=""
                  disabled=""
                  data-date-picker-target="end"
                  class="rx-input"
                />
              </div>
            </div>
            <input type="hidden" value="single" data-date-picker-target="kind" />
          </div>
          <div class="messages">
            <p
              class="error"
              id="picker-release-error"
              data-date-picker-target="error"
              hidden=""
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span data-date-picker-target="errorText"></span>
            </p>
          </div>
          <div
            id="picker-release-calendar"
            class="panel"
            popover="auto"
            role="dialog"
            aria-label="公開予定日を選択"
            data-positioned="false"
            data-date-picker-target="panel"
          >
            <div class="editors" data-date-picker-target="editors">
              <input
                aria-label="日付"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorStart"
                data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              /><input
                aria-label="終了日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorEnd"
                hidden=""
                data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              />
            </div>
            <p
              id="picker-release-editor-error"
              class="editor-error"
              data-date-picker-target="editorError"
              role="status"
              hidden=""
            ></p>
            <div class="month">
              <strong
                id="picker-release-month"
                data-date-picker-target="month"
                aria-live="polite"
              ></strong
              ><button
                class="rx-button button"
                type="button"
                data-action="date-picker#currentMonth"
                data-date-picker-target="today"
              >
                今日</button
              ><button
                class="rx-button button previous"
                type="button"
                data-icon-only="true"
                aria-label="前の月"
                data-action="date-picker#previousMonth"
                data-date-picker-target="previous"
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
              ><button
                class="rx-button button next"
                type="button"
                data-icon-only="true"
                aria-label="次の月"
                data-action="date-picker#nextMonth"
                data-date-picker-target="next"
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
            </div>
            <p class="selection" role="status" data-date-picker-target="selection"></p>
            <table class="grid" role="grid" aria-labelledby="picker-release-month">
              <thead>
                <tr>
                  <th scope="col" aria-label="月曜日">月</th>
                  <th scope="col" aria-label="火曜日">火</th>
                  <th scope="col" aria-label="水曜日">水</th>
                  <th scope="col" aria-label="木曜日">木</th>
                  <th scope="col" aria-label="金曜日">金</th>
                  <th scope="col" aria-label="土曜日">土</th>
                  <th scope="col" aria-label="日曜日">日</th>
                </tr>
              </thead>
              <tbody data-date-picker-target="days"></tbody>
            </table>
            <div class="actions">
              <button
                class="rx-button button"
                type="button"
                data-action="date-picker#clearSelection"
              >
                <span>クリア</span>
              </button>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  </fieldset>
  <button class="rx-button" type="reset" data-variant="secondary" data-size="default">
    初期値に戻す
  </button>
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
        ><span class="title">未入力・同日・境界・利用不可</span></span
      >
    </summary>
    <div class="body">
      <div class="rx-stack">
        <fieldset
          id="rx-date-picker-:r1l:"
          class="rx-date-picker"
          data-controller="date-picker"
          data-enhancement="pending"
          data-date-picker-choice-value="single"
          data-date-picker-mode-value="single"
        >
          <legend id="rx-date-picker-:r1l:-label" class="label">未入力の日付</legend>
          <div class="control" data-date-picker-target="control">
            <input
              id="rx-date-picker-:r1l:-input"
              value=""
              aria-labelledby="rx-date-picker-:r1l:-label"
              placeholder="日付を選択"
              autocomplete="off"
              spellcheck="false"
              data-date-picker-target="display"
              disabled=""
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              popovertarget="rx-date-picker-:r1l:-calendar"
              aria-label="未入力の日付のカレンダーを開く"
              aria-haspopup="dialog"
              data-date-picker-target="trigger"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use>
              </svg>
            </button>
          </div>
          <div class="fallback" data-date-picker-target="fallback">
            <div class="rx-field">
              <div class="heading">
                <label for="rx-date-picker-:r1l:-start">未入力の日付</label>
              </div>
              <input
                id="rx-date-picker-:r1l:-start"
                type="date"
                name="empty_date"
                value=""
                data-date-picker-target="start"
                class="rx-input"
              />
            </div>
            <div hidden="">
              <div class="rx-field">
                <div class="heading">
                  <label for="rx-date-picker-:r1l:-end">終了日</label>
                </div>
                <input
                  id="rx-date-picker-:r1l:-end"
                  type="date"
                  value=""
                  disabled=""
                  data-date-picker-target="end"
                  class="rx-input"
                />
              </div>
            </div>
            <input type="hidden" value="single" data-date-picker-target="kind" />
          </div>
          <div class="messages">
            <p
              class="error"
              id="rx-date-picker-:r1l:-error"
              data-date-picker-target="error"
              hidden=""
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span data-date-picker-target="errorText"></span>
            </p>
          </div>
          <div
            id="rx-date-picker-:r1l:-calendar"
            class="panel"
            popover="auto"
            role="dialog"
            aria-label="未入力の日付を選択"
            data-positioned="false"
            data-date-picker-target="panel"
          >
            <div class="editors" data-date-picker-target="editors">
              <input
                aria-label="日付"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorStart"
                data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              /><input
                aria-label="終了日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorEnd"
                hidden=""
                data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              />
            </div>
            <p
              id="rx-date-picker-:r1l:-editor-error"
              class="editor-error"
              data-date-picker-target="editorError"
              role="status"
              hidden=""
            ></p>
            <div class="month">
              <strong
                id="rx-date-picker-:r1l:-month"
                data-date-picker-target="month"
                aria-live="polite"
              ></strong
              ><button
                class="rx-button button"
                type="button"
                data-action="date-picker#currentMonth"
                data-date-picker-target="today"
              >
                今日</button
              ><button
                class="rx-button button previous"
                type="button"
                data-icon-only="true"
                aria-label="前の月"
                data-action="date-picker#previousMonth"
                data-date-picker-target="previous"
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
              ><button
                class="rx-button button next"
                type="button"
                data-icon-only="true"
                aria-label="次の月"
                data-action="date-picker#nextMonth"
                data-date-picker-target="next"
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
            </div>
            <p class="selection" role="status" data-date-picker-target="selection"></p>
            <table
              class="grid"
              role="grid"
              aria-labelledby="rx-date-picker-:r1l:-month"
            >
              <thead>
                <tr>
                  <th scope="col" aria-label="月曜日">月</th>
                  <th scope="col" aria-label="火曜日">火</th>
                  <th scope="col" aria-label="水曜日">水</th>
                  <th scope="col" aria-label="木曜日">木</th>
                  <th scope="col" aria-label="金曜日">金</th>
                  <th scope="col" aria-label="土曜日">土</th>
                  <th scope="col" aria-label="日曜日">日</th>
                </tr>
              </thead>
              <tbody data-date-picker-target="days"></tbody>
            </table>
            <div class="actions">
              <button
                class="rx-button button"
                type="button"
                data-action="date-picker#clearSelection"
              >
                <span>クリア</span>
              </button>
            </div>
          </div>
        </fieldset>
        <fieldset
          id="rx-date-picker-:r1m:"
          class="rx-date-picker"
          data-controller="date-picker"
          data-enhancement="pending"
          data-date-picker-choice-value="range"
          data-date-picker-mode-value="range"
        >
          <legend id="rx-date-picker-:r1m:-label" class="label">未入力の期間</legend>
          <div class="control" data-date-picker-target="control">
            <input
              id="rx-date-picker-:r1m:-input"
              value=""
              aria-labelledby="rx-date-picker-:r1m:-label"
              placeholder="期間を選択"
              autocomplete="off"
              spellcheck="false"
              data-date-picker-target="display"
              disabled=""
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              popovertarget="rx-date-picker-:r1m:-calendar"
              aria-label="未入力の期間のカレンダーを開く"
              aria-haspopup="dialog"
              data-date-picker-target="trigger"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use>
              </svg>
            </button>
          </div>
          <div class="fallback" data-date-picker-target="fallback">
            <div class="rx-field">
              <div class="heading">
                <label for="rx-date-picker-:r1m:-start">開始日</label>
              </div>
              <input
                id="rx-date-picker-:r1m:-start"
                type="date"
                name="empty_start"
                value=""
                data-date-picker-target="start"
                class="rx-input"
              />
            </div>
            <div>
              <div class="rx-field">
                <div class="heading">
                  <label for="rx-date-picker-:r1m:-end">終了日</label>
                </div>
                <input
                  id="rx-date-picker-:r1m:-end"
                  type="date"
                  name="empty_end"
                  value=""
                  data-date-picker-target="end"
                  class="rx-input"
                />
              </div>
            </div>
            <input type="hidden" value="range" data-date-picker-target="kind" />
          </div>
          <div class="messages">
            <p
              class="error"
              id="rx-date-picker-:r1m:-error"
              data-date-picker-target="error"
              hidden=""
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span data-date-picker-target="errorText"></span>
            </p>
          </div>
          <div
            id="rx-date-picker-:r1m:-calendar"
            class="panel"
            popover="auto"
            role="dialog"
            aria-label="未入力の期間を選択"
            data-positioned="false"
            data-date-picker-target="panel"
          >
            <div class="editors" data-date-picker-target="editors">
              <input
                aria-label="開始日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorStart"
                data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              /><input
                aria-label="終了日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorEnd"
                data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              />
            </div>
            <p
              id="rx-date-picker-:r1m:-editor-error"
              class="editor-error"
              data-date-picker-target="editorError"
              role="status"
              hidden=""
            ></p>
            <div class="month">
              <strong
                id="rx-date-picker-:r1m:-month"
                data-date-picker-target="month"
                aria-live="polite"
              ></strong
              ><button
                class="rx-button button"
                type="button"
                data-action="date-picker#currentMonth"
                data-date-picker-target="today"
              >
                今日</button
              ><button
                class="rx-button button previous"
                type="button"
                data-icon-only="true"
                aria-label="前の月"
                data-action="date-picker#previousMonth"
                data-date-picker-target="previous"
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
              ><button
                class="rx-button button next"
                type="button"
                data-icon-only="true"
                aria-label="次の月"
                data-action="date-picker#nextMonth"
                data-date-picker-target="next"
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
            </div>
            <p class="selection" role="status" data-date-picker-target="selection"></p>
            <table
              class="grid"
              role="grid"
              aria-labelledby="rx-date-picker-:r1m:-month"
            >
              <thead>
                <tr>
                  <th scope="col" aria-label="月曜日">月</th>
                  <th scope="col" aria-label="火曜日">火</th>
                  <th scope="col" aria-label="水曜日">水</th>
                  <th scope="col" aria-label="木曜日">木</th>
                  <th scope="col" aria-label="金曜日">金</th>
                  <th scope="col" aria-label="土曜日">土</th>
                  <th scope="col" aria-label="日曜日">日</th>
                </tr>
              </thead>
              <tbody data-date-picker-target="days"></tbody>
            </table>
            <div class="actions">
              <button
                class="rx-button button"
                type="button"
                data-action="date-picker#clearSelection"
              >
                <span>クリア</span>
              </button>
            </div>
          </div>
        </fieldset>
        <fieldset
          id="picker-same"
          class="rx-date-picker"
          data-controller="date-picker"
          data-enhancement="pending"
          data-date-picker-choice-value="flexible"
          data-date-picker-mode-value="range"
        >
          <legend id="picker-same-label" class="label">同日の期間</legend>
          <div class="control" data-date-picker-target="control">
            <input
              id="picker-same-input"
              value="2026/09/12 – 2026/09/12"
              aria-labelledby="picker-same-label"
              placeholder="日付を選択"
              autocomplete="off"
              spellcheck="false"
              data-date-picker-target="display"
              disabled=""
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              popovertarget="picker-same-calendar"
              aria-label="同日の期間のカレンダーを開く"
              aria-haspopup="dialog"
              data-date-picker-target="trigger"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use>
              </svg>
            </button>
          </div>
          <div class="fallback" data-date-picker-target="fallback">
            <div class="rx-field">
              <div class="heading"><label for="picker-same-start">開始日</label></div>
              <input
                id="picker-same-start"
                type="date"
                name="same[start]"
                value="2026-09-12"
                data-date-picker-target="start"
                class="rx-input"
              />
            </div>
            <div>
              <div class="rx-field">
                <div class="heading"><label for="picker-same-end">終了日</label></div>
                <input
                  id="picker-same-end"
                  type="date"
                  name="same[end]"
                  value="2026-09-12"
                  data-date-picker-target="end"
                  class="rx-input"
                />
              </div>
            </div>
            <div class="rx-field">
              <div class="heading">
                <label for="picker-same-kind">日付の形式</label>
              </div>
              <select
                id="picker-same-kind"
                name="same[kind]"
                data-date-picker-target="kind"
                class="rx-input"
              >
                <option value="single">単日</option>
                <option value="range" selected="">期間</option>
              </select>
            </div>
          </div>
          <div class="messages">
            <p
              class="error"
              id="picker-same-error"
              data-date-picker-target="error"
              hidden=""
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span data-date-picker-target="errorText"></span>
            </p>
          </div>
          <div
            id="picker-same-calendar"
            class="panel"
            popover="auto"
            role="dialog"
            aria-label="同日の期間を選択"
            data-positioned="false"
            data-date-picker-target="panel"
          >
            <div class="editors" data-date-picker-target="editors">
              <input
                aria-label="開始日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorStart"
                data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              /><input
                aria-label="終了日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorEnd"
                data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              />
            </div>
            <p
              id="picker-same-editor-error"
              class="editor-error"
              data-date-picker-target="editorError"
              role="status"
              hidden=""
            ></p>
            <div class="month">
              <strong
                id="picker-same-month"
                data-date-picker-target="month"
                aria-live="polite"
              ></strong
              ><button
                class="rx-button button"
                type="button"
                data-action="date-picker#currentMonth"
                data-date-picker-target="today"
              >
                今日</button
              ><button
                class="rx-button button previous"
                type="button"
                data-icon-only="true"
                aria-label="前の月"
                data-action="date-picker#previousMonth"
                data-date-picker-target="previous"
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
              ><button
                class="rx-button button next"
                type="button"
                data-icon-only="true"
                aria-label="次の月"
                data-action="date-picker#nextMonth"
                data-date-picker-target="next"
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
            </div>
            <p class="selection" role="status" data-date-picker-target="selection"></p>
            <table class="grid" role="grid" aria-labelledby="picker-same-month">
              <thead>
                <tr>
                  <th scope="col" aria-label="月曜日">月</th>
                  <th scope="col" aria-label="火曜日">火</th>
                  <th scope="col" aria-label="水曜日">水</th>
                  <th scope="col" aria-label="木曜日">木</th>
                  <th scope="col" aria-label="金曜日">金</th>
                  <th scope="col" aria-label="土曜日">土</th>
                  <th scope="col" aria-label="日曜日">日</th>
                </tr>
              </thead>
              <tbody data-date-picker-target="days"></tbody>
            </table>
            <div class="actions">
              <label class="rx-switch" for="picker-same-range-toggle"
                ><input
                  data-date-picker-target="rangeToggle"
                  data-action="date-picker#toggleRange"
                  id="picker-same-range-toggle"
                  type="checkbox"
                  role="switch"
                  aria-labelledby="picker-same-range-toggle-label"
                /><span
                  ><span id="picker-same-range-toggle-label">終了日</span></span
                ></label
              ><button
                class="rx-button button"
                type="button"
                data-action="date-picker#clearSelection"
              >
                <span>クリア</span>
              </button>
            </div>
          </div>
        </fieldset>
        <fieldset
          id="picker-bounded"
          class="rx-date-picker"
          data-controller="date-picker"
          data-enhancement="pending"
          data-date-picker-choice-value="range"
          data-date-picker-mode-value="range"
          data-date-picker-min-date-value="2026-09-01"
          data-date-picker-max-date-value="2026-09-30"
        >
          <legend id="picker-bounded-label" class="label">9月の期間</legend>
          <div class="control" data-date-picker-target="control">
            <input
              id="picker-bounded-input"
              value="2026/09/01 – 2026/09/30"
              aria-labelledby="picker-bounded-label"
              placeholder="期間を選択"
              autocomplete="off"
              spellcheck="false"
              data-date-picker-target="display"
              disabled=""
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              popovertarget="picker-bounded-calendar"
              aria-label="9月の期間のカレンダーを開く"
              aria-haspopup="dialog"
              data-date-picker-target="trigger"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use>
              </svg>
            </button>
          </div>
          <div class="fallback" data-date-picker-target="fallback">
            <div class="rx-field">
              <div class="heading">
                <label for="picker-bounded-start">開始日</label>
              </div>
              <input
                id="picker-bounded-start"
                type="date"
                name="bounded_start"
                value="2026-09-01"
                min="2026-09-01"
                max="2026-09-30"
                data-date-picker-target="start"
                class="rx-input"
              />
            </div>
            <div>
              <div class="rx-field">
                <div class="heading">
                  <label for="picker-bounded-end">終了日</label>
                </div>
                <input
                  id="picker-bounded-end"
                  type="date"
                  name="bounded_end"
                  value="2026-09-30"
                  min="2026-09-01"
                  max="2026-09-30"
                  data-date-picker-target="end"
                  class="rx-input"
                />
              </div>
            </div>
            <input type="hidden" value="range" data-date-picker-target="kind" />
          </div>
          <div class="messages">
            <p
              class="error"
              id="picker-bounded-error"
              data-date-picker-target="error"
              hidden=""
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span data-date-picker-target="errorText"></span>
            </p>
          </div>
          <div
            id="picker-bounded-calendar"
            class="panel"
            popover="auto"
            role="dialog"
            aria-label="9月の期間を選択"
            data-positioned="false"
            data-date-picker-target="panel"
          >
            <div class="editors" data-date-picker-target="editors">
              <input
                aria-label="開始日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorStart"
                data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              /><input
                aria-label="終了日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorEnd"
                data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              />
            </div>
            <p
              id="picker-bounded-editor-error"
              class="editor-error"
              data-date-picker-target="editorError"
              role="status"
              hidden=""
            ></p>
            <div class="month">
              <strong
                id="picker-bounded-month"
                data-date-picker-target="month"
                aria-live="polite"
              ></strong
              ><button
                class="rx-button button"
                type="button"
                data-action="date-picker#currentMonth"
                data-date-picker-target="today"
              >
                今日</button
              ><button
                class="rx-button button previous"
                type="button"
                data-icon-only="true"
                aria-label="前の月"
                data-action="date-picker#previousMonth"
                data-date-picker-target="previous"
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
              ><button
                class="rx-button button next"
                type="button"
                data-icon-only="true"
                aria-label="次の月"
                data-action="date-picker#nextMonth"
                data-date-picker-target="next"
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
            </div>
            <p class="selection" role="status" data-date-picker-target="selection"></p>
            <table class="grid" role="grid" aria-labelledby="picker-bounded-month">
              <thead>
                <tr>
                  <th scope="col" aria-label="月曜日">月</th>
                  <th scope="col" aria-label="火曜日">火</th>
                  <th scope="col" aria-label="水曜日">水</th>
                  <th scope="col" aria-label="木曜日">木</th>
                  <th scope="col" aria-label="金曜日">金</th>
                  <th scope="col" aria-label="土曜日">土</th>
                  <th scope="col" aria-label="日曜日">日</th>
                </tr>
              </thead>
              <tbody data-date-picker-target="days"></tbody>
            </table>
            <div class="actions">
              <button
                class="rx-button button"
                type="button"
                data-action="date-picker#clearSelection"
              >
                <span>クリア</span>
              </button>
            </div>
          </div>
        </fieldset>
        <fieldset
          disabled=""
          id="rx-date-picker-:r1q:"
          class="rx-date-picker"
          data-controller="date-picker"
          data-enhancement="pending"
          data-date-picker-choice-value="single"
          data-date-picker-mode-value="single"
        >
          <legend id="rx-date-picker-:r1q:-label" class="label">利用不可の日付</legend>
          <div class="control" data-date-picker-target="control">
            <input
              id="rx-date-picker-:r1q:-input"
              value="2026/09/12"
              aria-labelledby="rx-date-picker-:r1q:-label"
              placeholder="日付を選択"
              autocomplete="off"
              spellcheck="false"
              data-date-picker-target="display"
              disabled=""
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              popovertarget="rx-date-picker-:r1q:-calendar"
              aria-label="利用不可の日付のカレンダーを開く"
              aria-haspopup="dialog"
              disabled=""
              data-date-picker-target="trigger"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use>
              </svg>
            </button>
          </div>
          <div class="fallback" data-date-picker-target="fallback">
            <div class="rx-field">
              <div class="heading">
                <label for="rx-date-picker-:r1q:-start">利用不可の日付</label>
              </div>
              <input
                id="rx-date-picker-:r1q:-start"
                type="date"
                name="disabled_date"
                value="2026-09-12"
                data-date-picker-target="start"
                class="rx-input"
              />
            </div>
            <div hidden="">
              <div class="rx-field">
                <div class="heading">
                  <label for="rx-date-picker-:r1q:-end">終了日</label>
                </div>
                <input
                  id="rx-date-picker-:r1q:-end"
                  type="date"
                  value=""
                  disabled=""
                  data-date-picker-target="end"
                  class="rx-input"
                />
              </div>
            </div>
            <input type="hidden" value="single" data-date-picker-target="kind" />
          </div>
          <div class="messages">
            <p
              class="error"
              id="rx-date-picker-:r1q:-error"
              data-date-picker-target="error"
              hidden=""
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span data-date-picker-target="errorText"></span>
            </p>
          </div>
          <div
            id="rx-date-picker-:r1q:-calendar"
            class="panel"
            popover="auto"
            role="dialog"
            aria-label="利用不可の日付を選択"
            data-positioned="false"
            data-date-picker-target="panel"
          >
            <div class="editors" data-date-picker-target="editors">
              <input
                aria-label="日付"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorStart"
                data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              /><input
                aria-label="終了日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorEnd"
                hidden=""
                data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              />
            </div>
            <p
              id="rx-date-picker-:r1q:-editor-error"
              class="editor-error"
              data-date-picker-target="editorError"
              role="status"
              hidden=""
            ></p>
            <div class="month">
              <strong
                id="rx-date-picker-:r1q:-month"
                data-date-picker-target="month"
                aria-live="polite"
              ></strong
              ><button
                class="rx-button button"
                type="button"
                data-action="date-picker#currentMonth"
                data-date-picker-target="today"
              >
                今日</button
              ><button
                class="rx-button button previous"
                type="button"
                data-icon-only="true"
                aria-label="前の月"
                data-action="date-picker#previousMonth"
                data-date-picker-target="previous"
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
              ><button
                class="rx-button button next"
                type="button"
                data-icon-only="true"
                aria-label="次の月"
                data-action="date-picker#nextMonth"
                data-date-picker-target="next"
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
            </div>
            <p class="selection" role="status" data-date-picker-target="selection"></p>
            <table
              class="grid"
              role="grid"
              aria-labelledby="rx-date-picker-:r1q:-month"
            >
              <thead>
                <tr>
                  <th scope="col" aria-label="月曜日">月</th>
                  <th scope="col" aria-label="火曜日">火</th>
                  <th scope="col" aria-label="水曜日">水</th>
                  <th scope="col" aria-label="木曜日">木</th>
                  <th scope="col" aria-label="金曜日">金</th>
                  <th scope="col" aria-label="土曜日">土</th>
                  <th scope="col" aria-label="日曜日">日</th>
                </tr>
              </thead>
              <tbody data-date-picker-target="days"></tbody>
            </table>
            <div class="actions">
              <button
                class="rx-button button"
                type="button"
                data-action="date-picker#clearSelection"
              >
                <span>クリア</span>
              </button>
            </div>
          </div>
        </fieldset>
        <fieldset
          id="rx-date-picker-:r1r:"
          class="rx-date-picker"
          data-controller="date-picker"
          data-enhancement="pending"
          data-date-picker-choice-value="single"
          data-date-picker-mode-value="single"
        >
          <legend id="rx-date-picker-:r1r:-label" class="label">
            読み取り専用の日付
          </legend>
          <div class="control" data-date-picker-target="control">
            <input
              id="rx-date-picker-:r1r:-input"
              value="2026/09/12"
              aria-labelledby="rx-date-picker-:r1r:-label"
              readonly=""
              placeholder="日付を選択"
              autocomplete="off"
              spellcheck="false"
              data-date-picker-target="display"
              disabled=""
              class="rx-input"
            /><button
              class="toggle"
              type="button"
              popovertarget="rx-date-picker-:r1r:-calendar"
              aria-label="読み取り専用の日付のカレンダーを開く"
              aria-haspopup="dialog"
              disabled=""
              data-date-picker-target="trigger"
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-calendar"></use>
              </svg>
            </button>
          </div>
          <div class="fallback" data-date-picker-target="fallback">
            <div class="rx-field">
              <div class="heading">
                <label for="rx-date-picker-:r1r:-start">読み取り専用の日付</label>
              </div>
              <input
                id="rx-date-picker-:r1r:-start"
                type="date"
                name="readonly_date"
                value="2026-09-12"
                readonly=""
                data-date-picker-target="start"
                class="rx-input"
              />
            </div>
            <div hidden="">
              <div class="rx-field">
                <div class="heading">
                  <label for="rx-date-picker-:r1r:-end">終了日</label>
                </div>
                <input
                  id="rx-date-picker-:r1r:-end"
                  type="date"
                  value=""
                  readonly=""
                  disabled=""
                  data-date-picker-target="end"
                  class="rx-input"
                />
              </div>
            </div>
            <input type="hidden" value="single" data-date-picker-target="kind" />
          </div>
          <div class="messages">
            <p
              class="error"
              id="rx-date-picker-:r1r:-error"
              data-date-picker-target="error"
              hidden=""
            >
              <svg
                class="rx-icon"
                viewBox="0 0 256 256"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
              >
                <use href="/assets/rx-icons.svg#rx-x-circle"></use></svg
              ><span data-date-picker-target="errorText"></span>
            </p>
          </div>
          <div
            id="rx-date-picker-:r1r:-calendar"
            class="panel"
            popover="auto"
            role="dialog"
            aria-label="読み取り専用の日付を選択"
            data-positioned="false"
            data-date-picker-target="panel"
          >
            <div class="editors" data-date-picker-target="editors">
              <input
                aria-label="日付"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorStart"
                data-action="focus-&gt;date-picker#editStart input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              /><input
                aria-label="終了日"
                placeholder="YYYY/MM/DD"
                autocomplete="off"
                spellcheck="false"
                data-date-picker-target="editorEnd"
                hidden=""
                data-action="focus-&gt;date-picker#editEnd input-&gt;date-picker#editDates change-&gt;date-picker#editDates"
                class="rx-input"
              />
            </div>
            <p
              id="rx-date-picker-:r1r:-editor-error"
              class="editor-error"
              data-date-picker-target="editorError"
              role="status"
              hidden=""
            ></p>
            <div class="month">
              <strong
                id="rx-date-picker-:r1r:-month"
                data-date-picker-target="month"
                aria-live="polite"
              ></strong
              ><button
                class="rx-button button"
                type="button"
                data-action="date-picker#currentMonth"
                data-date-picker-target="today"
              >
                今日</button
              ><button
                class="rx-button button previous"
                type="button"
                data-icon-only="true"
                aria-label="前の月"
                data-action="date-picker#previousMonth"
                data-date-picker-target="previous"
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
              ><button
                class="rx-button button next"
                type="button"
                data-icon-only="true"
                aria-label="次の月"
                data-action="date-picker#nextMonth"
                data-date-picker-target="next"
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
            </div>
            <p class="selection" role="status" data-date-picker-target="selection"></p>
            <table
              class="grid"
              role="grid"
              aria-labelledby="rx-date-picker-:r1r:-month"
            >
              <thead>
                <tr>
                  <th scope="col" aria-label="月曜日">月</th>
                  <th scope="col" aria-label="火曜日">火</th>
                  <th scope="col" aria-label="水曜日">水</th>
                  <th scope="col" aria-label="木曜日">木</th>
                  <th scope="col" aria-label="金曜日">金</th>
                  <th scope="col" aria-label="土曜日">土</th>
                  <th scope="col" aria-label="日曜日">日</th>
                </tr>
              </thead>
              <tbody data-date-picker-target="days"></tbody>
            </table>
            <div class="actions">
              <button
                class="rx-button button"
                type="button"
                data-action="date-picker#clearSelection"
              >
                <span>クリア</span>
              </button>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  </details>
</form>
```

</details>
