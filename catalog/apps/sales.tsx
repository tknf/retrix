import { ChartFrame, Icon, PageHeader, Section, Statistic, Table, Tabs } from "../../src/hono";
import { AppFrame } from "./frame";

const months = [
  {
    month: "7月",
    total: 1057,
    orders: 46,
    rows: [
      { plan: "スタンダード", orders: 32, sales: 640 },
      { plan: "チーム", orders: 9, sales: 333 },
      { plan: "年間プラン", orders: 5, sales: 84 },
    ],
  },
  {
    month: "8月",
    total: 1284,
    orders: 54,
    rows: [
      { plan: "スタンダード", orders: 42, sales: 840 },
      { plan: "チーム", orders: 12, sales: 444 },
      { plan: "年間プラン", orders: 0, sales: 0 },
    ],
  },
  {
    month: "9月",
    total: 1462,
    orders: 61,
    rows: [
      { plan: "スタンダード", orders: 45, sales: 900 },
      { plan: "チーム", orders: 13, sales: 481 },
      { plan: "年間プラン", orders: 3, sales: 81 },
    ],
  },
] as const;

/** 千円単位の数値を「¥1,284,000」の形にする。 */
const yen = (thousands: number) => `¥${(thousands * 1000).toLocaleString("ja-JP")}`;
const latest = months[months.length - 1];
const previous = months[months.length - 2];
const growth = Math.round(((latest.total - previous.total) / previous.total) * 100);
/** グラフの棒の高さ。最大の月を110にそろえる。 */
const barHeight = (total: number) => Math.round((total / 1600) * 110);

/** 売上。今月の数値、月ごとの推移、プラン別の内訳を確認する。 */
export const SalesScreen = () => (
  <AppFrame current="sales">
    <PageHeader
      title="売上"
      icon={<Icon name="chart" />}
      description="プランごとの申し込みと売上です。9月は15日までの集計です。"
    />
    <div class="rx-split">
      <Statistic label="9月の売上" value={yen(latest.total)} note={`前月より${growth}%増`} />
      <Statistic label="申し込み" value={String(latest.orders)} unit="件" note="前月より7件増" />
      <Statistic label="解約" value="2" unit="件" note="前月と同じ" />
    </div>
    <ChartFrame
      title="月別の売上"
      description={`7月から9月にかけて、売上は毎月増えています。9月は前月より${growth}%増。`}
      tableLabel="月別の売上の数値"
      graphic={
        <svg viewBox="0 0 420 142" width="420" height="142">
          <defs>
            <linearGradient id="sales-bar" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="var(--rx-link)" />
              <stop
                offset="100%"
                stop-color="color-mix(in srgb, var(--rx-link) 70%, var(--rx-plum))"
              />
            </linearGradient>
          </defs>
          <path
            d="M40 20H410M40 65H410M40 110H410"
            stroke="color-mix(in srgb, var(--rx-ink) 10%, transparent)"
          />
          {months.map((entry, index) => (
            <>
              <rect
                x={78 + index * 124}
                y={110 - barHeight(entry.total)}
                width="58"
                height={barHeight(entry.total)}
                rx="6"
                fill="url(#sales-bar)"
              />
              <text x={90 + index * 124} y="133" fill="var(--rx-muted)" font-size="12">
                {entry.month}
              </text>
            </>
          ))}
        </svg>
      }
      table={
        <table>
          <thead>
            <tr>
              <th scope="col">月</th>
              <th scope="col">売上</th>
            </tr>
          </thead>
          <tbody>
            {months.map((entry) => (
              <tr>
                <th scope="row">{entry.month}</th>
                <td>{yen(entry.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
      source="つむぐの売上の集計（サンプル）"
    />
    <Section title="プラン別の内訳">
      <Tabs
        id="sales-month"
        label="対象の月"
        items={[...months].reverse().map((entry) => ({
          value: entry.month,
          label: entry.month,
          content: (
            <Table caption={`${entry.month}のプラン別の内訳`}>
              <thead>
                <tr>
                  <th scope="col">プラン</th>
                  <th scope="col" data-cell="numeric">
                    申し込み
                  </th>
                  <th scope="col" data-cell="numeric">
                    売上
                  </th>
                </tr>
              </thead>
              <tbody>
                {entry.rows.map((row) => (
                  <tr>
                    <th scope="row">{row.plan}</th>
                    <td data-cell="numeric">{row.orders}件</td>
                    <td data-cell="numeric">{yen(row.sales)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">合計</th>
                  <td data-cell="numeric">{entry.orders}件</td>
                  <td data-cell="numeric">{yen(entry.total)}</td>
                </tr>
              </tfoot>
            </Table>
          ),
        }))}
      />
    </Section>
  </AppFrame>
);
