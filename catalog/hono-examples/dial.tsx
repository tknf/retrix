import { Dial, Disclosure, DisclosureGroup } from "../../src/hono";

const days = ["3", "7", "11", "30", "90", "365"].map((value) => ({ value, label: value }));

export default () => (
  <div class="rx-stack">
    <Dial legend="自動で閉じるまで" name="auto-close" options={days} value="30" unit="日" />
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
          <Dial legend="الإغلاق التلقائي" name="rtl-dial" options={days} value="90" unit="يوم" />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
