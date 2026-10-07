import { useId } from "hono/jsx";
import { Icon } from "./icon";
import { Input, Select } from "./field";
import { Button } from "./button";
import { Tag } from "./tag";

export type PickerOption = {
  /** 送信する値。空白だけの値と、重なった値の二つ目以降は出さない。 */
  value: string;
  /** 候補に出す名前。検索はこの名前で絞り込む。 */
  label: string;
  /** 一覧に出すが選べなくする。 */
  disabled?: boolean;
};
export type PickerProps = {
  /** idの元。省略すると生成する。標準selectは`<id>-native`、検索欄は`<id>-search`になる。 */
  id?: string;
  /** 欄の名前。 */
  label: string;
  /** 標準selectのname。選んだ値をこの名前で送信する。 */
  name: string;
  /** 選べる候補。取得後に入れ替える時はPickerController.replaceOptions()を使う。 */
  options: readonly PickerOption[];
  /** 最初に選んでおく値。multipleの時は配列で渡す。 */
  value?: string | readonly string[];
  /** trueで複数を選べる。選ぶたびに加え、同じ候補をもう一度選ぶか、Tagの解除で外す。 */
  multiple?: boolean;
  /** 標準selectのrequired。未選択で送信すると検索欄へフォーカスが移り、「候補を選択してください。」と出す。 */
  required?: boolean;
  /** 標準selectと検索欄を使えなくする。 */
  disabled?: boolean;
  /** 欄の下に出す淡い補足。説明として読み上げる。 */
  help?: string;
  /** 直す所を書くエラー文。欄をaria-invalidにし、説明として読み上げる。 */
  error?: string;
  /** 検索欄のplaceholder。 */
  placeholder?: string;
  /** 標準selectのform属性。フォームの外に置く時に、送信するformのidを渡す。 */
  form?: string;
};

/** 選択値は標準selectが送信し、検索欄は選択のためだけに使う。 */
export const Picker = ({
  id,
  label,
  name,
  options,
  value,
  multiple = false,
  required,
  disabled,
  help,
  error,
  placeholder = "候補を検索",
  form,
}: PickerProps) => {
  const generatedId = useId();
  const controlId = id ?? `rx-picker-${generatedId}`;
  const selectedValues = new Set(typeof value === "string" ? [value] : (value ?? []));
  const seen = new Set<string>();
  const candidates = options.filter((option) => {
    if (option.value.trim() === "" || seen.has(option.value)) return false;
    seen.add(option.value);
    return true;
  });
  const describedBy = [help ? `${controlId}-help` : "", error ? `${controlId}-error` : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      class="rx-combobox rx-picker"
      data-controller="combobox picker"
      data-combobox-multiple-value="true"
      data-combobox-selected-value={JSON.stringify([...selectedValues])}
      data-picker-multiple-value={multiple}
      data-action="combobox:change->picker#selectionChanged"
    >
      <label
        class="label"
        id={`${controlId}-label`}
        for={`${controlId}-native`}
        data-picker-target="label"
      >
        {label}
      </label>
      <Select
        id={`${controlId}-native`}
        class="native"
        name={name}
        form={form}
        multiple={multiple}
        required={required}
        disabled={disabled}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? "true" : undefined}
        data-invalid={error ? "true" : undefined}
        data-picker-target="native"
      >
        {!multiple && <option value="">選択してください</option>}
        {candidates.map((option) => (
          <option
            value={option.value}
            selected={selectedValues.has(option.value)}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </Select>
      <Input
        id={`${controlId}-search`}
        class="search"
        type="search"
        role="combobox"
        aria-labelledby={`${controlId}-label`}
        aria-controls={`${controlId}-options`}
        aria-expanded="false"
        aria-autocomplete="list"
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? "true" : undefined}
        data-invalid={error ? "true" : undefined}
        autocomplete="off"
        placeholder={placeholder}
        disabled={disabled}
        data-combobox-target="input"
        data-picker-target="search"
        hidden
      />
      <ul class="values" data-picker-target="values" aria-label="選択中" hidden />
      <template data-picker-target="template">
        <li>
          <Tag
            label=""
            removeButton={
              <Button
                class="remove"
                variant="link"
                size="tag"
                data-icon-only="true"
                aria-label="選択を解除"
              />
            }
          />
        </li>
      </template>
      <ul
        class="options"
        id={`${controlId}-options`}
        role="listbox"
        aria-label={`${label}の候補`}
        data-combobox-target="listbox"
        data-picker-target="listbox"
        hidden
      >
        {candidates.map((option, index) => (
          <li
            id={`${controlId}-option-${index}`}
            role="option"
            aria-selected={selectedValues.has(option.value) ? "true" : "false"}
            aria-disabled={option.disabled ? "true" : undefined}
            data-combobox-target="option"
            data-picker-target="option"
            data-combobox-value={option.value}
          >
            {option.label}
          </li>
        ))}
      </ul>
      <p class="note" data-picker-target="note" role="status" hidden>
        一致する候補はありません。
      </p>
      {(help || error) && (
        <div class="messages">
          {help && (
            <p class="help" id={`${controlId}-help`}>
              {help}
            </p>
          )}
          {error && (
            <p class="error" id={`${controlId}-error`}>
              <Icon name="x-circle" />
              <span>{error}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
