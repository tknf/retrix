import { ChartFrame } from "../../src/hono";

export default () => (
  <ChartFrame
    title="月別売上"
    description="4月から6月にかけて、売上は毎月15万円ずつ増加"
    tableLabel="月別売上の数値"
    graphic={
      <svg viewBox="0 0 420 142" width="420" height="142">
        {/* 棒は青から紫寄りへの塗り。 */}
        <defs>
          <linearGradient id="chart-frame-bar" x1="0" y1="0" x2="1" y2="1">
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
        <text x="4" y="24" fill="var(--rx-muted)" font-size="11">
          80
        </text>
        <text x="4" y="69" fill="var(--rx-muted)" font-size="11">
          40
        </text>
        <text x="11" y="114" fill="var(--rx-muted)" font-size="11">
          0
        </text>
        <rect x="78" y="59" width="58" height="51" rx="6" fill="url(#chart-frame-bar)" />
        <rect x="202" y="42" width="58" height="68" rx="6" fill="url(#chart-frame-bar)" />
        <rect x="326" y="25" width="58" height="85" rx="6" fill="url(#chart-frame-bar)" />
        <text x="90" y="133" fill="var(--rx-muted)" font-size="12">
          4月
        </text>
        <text x="214" y="133" fill="var(--rx-muted)" font-size="12">
          5月
        </text>
        <text x="338" y="133" fill="var(--rx-muted)" font-size="12">
          6月
        </text>
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
          <tr>
            <th scope="row">4月</th>
            <td>45万円</td>
          </tr>
          <tr>
            <th scope="row">5月</th>
            <td>60万円</td>
          </tr>
          <tr>
            <th scope="row">6月</th>
            <td>75万円</td>
          </tr>
        </tbody>
      </table>
    }
    source="集計用サンプル"
  />
);
