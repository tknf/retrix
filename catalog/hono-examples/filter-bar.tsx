import { Disclosure, FilterBar } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <div class="rx-stack" data-space="small">
      <p class="label">予定を月で絞り込む</p>
      <FilterBar
        label="表示する月"
        items={[
          { label: "8月", href: "/apps/schedule?month=8" },
          { label: "9月", href: "/apps/schedule", current: true },
        ]}
      />
    </div>
    <div class="rx-stack" data-space="small">
      <p class="label">表示を切り替える</p>
      <FilterBar
        label="予定の表示形式"
        appearance="segmented"
        items={[
          { label: "月", href: "/apps/schedule", current: true },
          { label: "週", href: "/apps/schedule?view=week" },
          { label: "年", href: "/apps/schedule?view=year" },
          { label: "一覧", href: "/apps/schedule?view=agenda" },
        ]}
      />
    </div>
    <Disclosure summary="件数・0件・長い条件名">
      <div class="rx-stack">
        <FilterBar
          label="記事の状態"
          items={[
            { label: "すべて", href: "/apps/search", count: 6, current: true },
            { label: "公開中", href: "/apps/search?state=公開中", count: 3 },
            { label: "下書き", href: "/apps/search?state=下書き", count: 3 },
            { label: "該当なし", href: "/apps/search?q=該当なし", count: 0 },
          ]}
        />
        <FilterBar
          label="検索する内容"
          items={[
            { label: "すべて", href: "/apps/search", current: true },
            {
              label: "長く使う道具と日々の暮らしを整える工夫について",
              href: "/apps/search?q=道具",
            },
            { label: "初めての方への申し込み手順", href: "/apps/search?q=申し込み" },
          ]}
        />
      </div>
    </Disclosure>
  </div>
);
