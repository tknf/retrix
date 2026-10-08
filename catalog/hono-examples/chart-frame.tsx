import { ChartFrame } from "../../src/hono";

export default () => (
  <ChartFrame
    title="月別売上"
    description="4月から6月にかけて、売上は毎月15万円ずつ増加"
    tableLabel="月別売上の数値"
    graphic={
      <svg viewBox="0 0 420 142" width="420" height="142">
        {/* Highriseの統計のグラフと同じく、目盛りの横線は淡い灰色、0の線は一段濃い灰色、系列は平らな塗り。 */}
        <path d="M40 20H410M40 65H410" stroke="#e6e6e6" />
        <path d="M40 110H410" stroke="#c0c0c0" />
        <text x="4" y="24" fill="var(--rx-muted)" font-size="11">
          80
        </text>
        <text x="4" y="69" fill="var(--rx-muted)" font-size="11">
          40
        </text>
        <text x="11" y="114" fill="var(--rx-muted)" font-size="11">
          0
        </text>
        <rect x="78" y="59" width="58" height="51" fill="var(--rx-link)" />
        <rect x="202" y="42" width="58" height="68" fill="var(--rx-link)" />
        <rect x="326" y="25" width="58" height="85" fill="var(--rx-link)" />
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
