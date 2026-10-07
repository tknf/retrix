import { useId } from "hono/jsx";
import { Field, Input } from "./field";
import { Icon } from "./icon";
import type { ElementProps } from "./types";

export type SuggestionProps = Omit<ElementProps<"input">, "list" | "type" | "role" | "children"> & {
  /** 欄のラベル。候補の一覧と開閉の操作の読み上げ名にも使う。 */
  label: string;
  /** 候補の文字列。空白だけの値と重なった値は除く。選ぶと、その文字列が欄の値になる。 */
  options: readonly string[];
  /** 欄の下に出す淡い補足。Fieldと同じく説明として読み上げる。 */
  help?: string;
  /** 直す所を書くエラー文。Fieldと同じく欄をaria-invalidにし、説明として読み上げる。 */
  error?: string;
};

/** 自由に入力でき、打った文字で絞り込んだ候補からも選べる欄。残りの属性はinputへ渡す。 */
export const Suggestion = ({
  id,
  label,
  options,
  help,
  error,
  "aria-describedby": describedBy,
  ...attributes
}: SuggestionProps) => {
  const generatedId = useId();
  const inputId = id ?? `rx-suggestion-${generatedId}`;
  const candidates = [...new Set(options.filter((option) => option.trim() !== ""))];
  return (
    <Field id={inputId} label={label} help={help} error={error} describedBy={describedBy}>
      {(field) => (
        <div class="rx-combobox rx-suggestion" data-controller="suggestion" dir={attributes.dir}>
          <Input
            {...attributes}
            {...field}
            aria-invalid={field["aria-invalid"] ?? attributes["aria-invalid"]}
            data-invalid={field["data-invalid"] ?? attributes["data-invalid"]}
            type="text"
            autocomplete="off"
            list={`${inputId}-options`}
            data-suggestion-target="input"
          />
          <button
            class="toggle"
            type="button"
            aria-label={`${label}の候補を開閉`}
            aria-haspopup="listbox"
            aria-controls={`${inputId}-listbox`}
            disabled={attributes.disabled || attributes.readonly}
            hidden
          >
            <Icon name="caret" />
          </button>
          <ul
            class="options"
            id={`${inputId}-listbox`}
            role="listbox"
            aria-label={`${label}の候補`}
            data-suggestion-target="listbox"
            hidden
          >
            {candidates.map((option, index) => (
              <li
                id={`${inputId}-option-${index}`}
                role="option"
                aria-selected="false"
                data-suggestion-target="option"
                data-combobox-value={option}
              >
                {option}
              </li>
            ))}
          </ul>
          <p class="note" role="status" />
          <datalist id={`${inputId}-options`}>
            {candidates.map((option) => (
              <option value={option} />
            ))}
          </datalist>
        </div>
      )}
    </Field>
  );
};
