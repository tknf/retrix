import { Grid, Disclosure } from "../../src/hono";

const days = [
  { id: "mon", label: "月 14" },
  { id: "tue", label: "火 15", current: true },
  { id: "wed", label: "水 16" },
  { id: "thu", label: "木 17" },
  { id: "fri", label: "金 18" },
  { id: "sat", label: "土 19" },
  { id: "sun", label: "日 20" },
] as const;

export default () => (
  <div class="rx-stack">
    <Grid
      caption="会議室の空き時間"
      rowHeader="開始"
      columns={days}
      rows={[
        {
          id: "morning",
          label: "10:00",
          cells: [
            { content: "空き" },
            { content: "予約済み", disabled: true },
            { content: "空き" },
            { content: "空き" },
            { content: "予約済み", disabled: true },
            { content: "空き" },
            { content: "休館", disabled: true },
          ],
        },
        {
          id: "afternoon",
          label: "14:00",
          cells: [
            { content: "予約済み", disabled: true },
            { content: "空き" },
            { content: "空き" },
            { content: "予約済み", disabled: true },
            { content: "空き" },
            { content: "空き" },
            { content: "休館", disabled: true },
          ],
        },
      ]}
    />
    <p class="catalog-footnote">
      Tabで表へ入り、矢印キーで日付と時間を移動します。Home・Endは行の端、PageUp・PageDownは行単位で移動します。
      狭い幅では表を横へスクロールできます。予約操作はセル内に置かず、選んだ時間を別の操作へ渡してください。
    </p>
    <Disclosure summary="空の状態">
      <Grid caption="検索した時間の空き状況" rowHeader="開始" columns={days} rows={[]} />
    </Disclosure>
  </div>
);
