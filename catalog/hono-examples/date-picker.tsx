import { Disclosure, Button, DatePicker, FieldGroup } from "../../src/hono";

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
        <DatePicker label="未入力の期間" mode="range" startName="empty_start" endName="empty_end" />
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
        <DatePicker label="利用不可の日付" name="disabled_date" value="2026-09-12" disabled />
        <DatePicker label="読み取り専用の日付" name="readonly_date" value="2026-09-12" readonly />
      </div>
    </Disclosure>
  </form>
);
