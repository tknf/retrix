import { Comparison, ValueList } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <Comparison label="公開範囲" changed={false} before={<p>標準</p>} after={<p>標準</p>} />
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
      <Comparison label="狭い場所の比較" before={<p>9月30日</p>} after={<p>10月7日</p>} />
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
      after={<Comparison label="補足" before={null} after={<p>補足を追加します。</p>} />}
    />
  </div>
);
