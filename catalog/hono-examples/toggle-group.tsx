import { ToggleGroup, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <ToggleGroup
      label="表示密度"
      items={[
        { value: "comfortable", label: "標準" },
        { value: "compact", label: "コンパクト" },
      ]}
      selected={["comfortable"]}
    />
    <ToggleGroup
      label="表示する項目"
      items={[
        { value: "date", label: "日付" },
        { value: "owner", label: "担当者" },
        { value: "status", label: "状態" },
      ]}
      selected={["date", "status"]}
      multiple
    />
    <DisclosureGroup label="並べ方の違い">
      <Disclosure summary="縦に並べる" open>
        <ToggleGroup
          label="カードの段"
          orientation="vertical"
          items={[
            { value: "not-now", label: "今はしない" },
            { value: "maybe", label: "たぶん" },
            { value: "on-hold", label: "保留" },
            { value: "done", label: "完了" },
          ]}
          selected={["on-hold"]}
        />
      </Disclosure>
    </DisclosureGroup>
  </div>
);
