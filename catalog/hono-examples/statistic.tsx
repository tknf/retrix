import { Statistic } from "../../src/hono";
export default () => (
  <div class="rx-split">
    <Statistic label="今月の売上" value="128,400" unit="円" note="9月1日〜15日 · 税込" />
    <Statistic label="予約" value="0" unit="件" note="今日の受付分" />
    <Statistic label="先月との差額" value="-12,800" unit="円" note="同じ期間との比較" />
    <Statistic label="これまでに受付したすべての予約の合計" value="123,456,789" unit="件" />
  </div>
);
