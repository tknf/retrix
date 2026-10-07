import { Picker } from "../../src/hono";

const people = [
  { value: "tanaka", label: "田中 遥" },
  { value: "sato", label: "佐藤 健" },
  { value: "suzuki", label: "鈴木 美咲" },
  { value: "unavailable", label: "選択できない担当者", disabled: true },
];

export default () => (
  <div class="rx-stack">
    <Picker id="picker-owner" label="担当者" name="owner" options={people} value="tanaka" />
    <Picker
      id="picker-reviewers"
      label="確認する人"
      name="reviewers"
      options={people}
      value={["sato", "suzuki"]}
      multiple
      help="複数人を選べます。"
    />
    <Picker
      id="picker-required"
      label="必須の担当者"
      name="required-owner"
      options={people}
      required
      error="担当者を選択してください。"
    />
    <Picker
      id="picker-disabled"
      label="変更できない担当者"
      name="locked-owner"
      options={people}
      value="tanaka"
      disabled
    />
  </div>
);
