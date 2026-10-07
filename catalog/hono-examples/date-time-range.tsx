import { DateTimeRange, Disclosure, DisclosureGroup } from "../../src/hono";

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
