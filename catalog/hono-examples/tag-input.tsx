import { TagInput } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <TagInput
      id="tag-input-keywords"
      label="キーワード"
      name="keywords"
      values={["案内", "公開"]}
      help="入力してEnterで追加できます。"
    />
    <TagInput id="tag-input-empty" label="分類タグ" name="tags" required />
    <TagInput
      id="tag-input-invalid"
      label="確認が必要なタグ"
      name="invalid-tags"
      error="タグを追加してください。"
      required
    />
    <TagInput
      id="tag-input-disabled"
      label="変更できないタグ"
      name="locked-tags"
      values={["公開済み", "固定"]}
      disabled
    />
  </div>
);
