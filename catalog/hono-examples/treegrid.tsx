import { Badge, Disclosure, Treegrid } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <Treegrid
      caption="公開資料と進行状況"
      columns={[{ heading: "資料", cell: "text" }, { heading: "担当" }, { heading: "状態" }]}
      expanded={["guide"]}
      selection="single"
      items={[
        {
          value: "guide",
          label: "利用案内",
          cells: ["編集チーム", <Badge tone="info">確認中</Badge>],
          children: [
            {
              value: "guide-start",
              label: "はじめに",
              href: "#treegrid-guide-start",
              cells: ["田中", <Badge tone="success">公開中</Badge>],
            },
            {
              value: "guide-admin",
              label: "管理者向け",
              cells: ["佐藤", <Badge draft>下書き</Badge>],
              children: [
                {
                  value: "guide-admin-access",
                  label: "アクセス権限の設定と確認",
                  cells: ["佐藤", <Badge draft>下書き</Badge>],
                },
              ],
            },
          ],
        },
        {
          value: "terms",
          label: "利用規約",
          href: "#treegrid-terms",
          cells: ["法務", <Badge tone="success">公開中</Badge>],
        },
      ]}
    />
    <Disclosure summary="複数選択・利用できないリンク・長い階層">
      <Treegrid
        caption="素材の確認"
        columns={[
          { heading: "名前", cell: "text" },
          { heading: "形式", cell: "short" },
        ]}
        selection="multiple"
        selected={["draft"]}
        expanded={["assets"]}
        density="comfortable"
        items={[
          {
            value: "assets",
            label: "素材",
            cells: ["フォルダ"],
            children: [
              {
                value: "draft",
                label: "確認待ちの原稿",
                href: "#treegrid-draft",
                cells: ["文書"],
              },
              { value: "archived", label: "閲覧不可の資料", disabled: true, cells: ["文書"] },
            ],
          },
        ]}
      />
    </Disclosure>
    <Disclosure summary="空・読み込み中・読み込み失敗">
      {(["empty", "loading", "error"] as const).map((state) => (
        <Treegrid
          caption={
            state === "empty"
              ? "空の資料"
              : state === "loading"
                ? "読み込み中の資料"
                : "読み込みに失敗した資料"
          }
          columns={[{ heading: "資料" }, { heading: "状態" }]}
          items={[]}
          state={state}
        />
      ))}
    </Disclosure>
  </div>
);
