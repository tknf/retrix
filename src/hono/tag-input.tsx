import { useId } from "hono/jsx";
import { Button } from "./button";
import { Field, Input } from "./field";
import { Tag } from "./tag";

export type TagInputProps = {
  /** 入力欄のID。ラベル・補足・エラー文のIDの接頭辞にも使う。渡さなければ自動で生成する。 */
  id?: string;
  /** 欄の名前。タグの一覧の読み上げ名（「〜のタグ」）にも使う。 */
  label: string;
  /** タグを「, 」でつないだ一つの値を送るフィールドの名前。 */
  name: string;
  /** 初期のタグ。前後の空白を除き、空・カンマを含むもの・重複は捨てる。フォームのリセットでこの並びへ戻る。 */
  values?: readonly string[];
  /** 入力欄のプレースホルダー。 */
  placeholder?: string;
  /** 欄の下に出す補足。入力欄のaria-describedbyに関連付ける。 */
  help?: string;
  /** 欄の下に出すエラー文。入力欄をaria-invalidにする。検証は利用側で行う。 */
  error?: string;
  /** タグが一つも無い時に送信を止める。 */
  required?: boolean;
  /** 追加・解除を止め、値を送信しない。 */
  disabled?: boolean;
  /** 別の場所にあるformのID。 */
  form?: string;
};

/** 自由入力のタグ。送信値はJavaScriptの有無にかかわらずカンマ区切り。 */
export const TagInput = ({
  id,
  label,
  name,
  values = [],
  placeholder = "入力してEnterで追加",
  help,
  error,
  required,
  disabled,
  form,
}: TagInputProps) => {
  const generatedId = useId();
  const controlId = id ?? `rx-tag-input-${generatedId}`;
  const tags = [
    ...new Set(
      values.map((value) => value.trim()).filter((value) => value && !value.includes(",")),
    ),
  ];
  const serialized = tags.join(", ");
  return (
    <Field id={controlId} label={label} help={help} error={error}>
      {(field) => (
        <div
          class="rx-tag-input"
          data-controller="tag-input tag-field"
          data-action="tag-input:beforeadd->tag-field#beforeAdd tag-input:add->tag-field#add tag-input:remove->tag-field#remove"
          data-tag-field-name-value={name}
          data-tag-field-required-value={required ? "true" : "false"}
        >
          <Input
            {...field}
            name={name}
            form={form}
            type="text"
            value={serialized}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            data-tag-input-target="input"
            data-tag-field-target="entry"
          />
          <ul class="chips" data-tag-field-target="list" aria-label={`${label}のタグ`} hidden>
            {tags.map((tag) => (
              <li data-tag-input-target="chip" data-tag-input-value={tag}>
                <Tag
                  label={tag}
                  removeButton={
                    <Button
                      class="remove"
                      variant="link"
                      size="tag"
                      type="button"
                      data-icon-only="true"
                      aria-label={`${tag}を解除`}
                      data-tag-input-target="remove"
                      disabled={disabled}
                    />
                  }
                />
              </li>
            ))}
          </ul>
          <template data-tag-field-target="template">
            <li data-tag-input-target="chip">
              <Tag
                label=""
                removeButton={
                  <Button
                    class="remove"
                    variant="link"
                    size="tag"
                    type="button"
                    data-icon-only="true"
                    aria-label="タグを解除"
                    data-tag-input-target="remove"
                  />
                }
              />
            </li>
          </template>
          <input
            type="hidden"
            name={name}
            form={form}
            value={serialized}
            disabled
            data-tag-field-target="serialized"
          />
          <p class="note" role="status" data-tag-field-target="note" hidden />
        </div>
      )}
    </Field>
  );
};
