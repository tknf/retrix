import { Input } from "./field";
import { Icon } from "./icon";
import type { ElementProps } from "./types";

export type ComboboxOption = {
  /** 選んだ時に入力欄へ入る値。候補の中で一意にする。 */
  value: string;
  /** 候補の一覧に出す文言。 */
  label: string;
  /** 一覧に出すが選べなくする。 */
  disabled?: boolean;
};
export type ComboboxProps = Omit<ElementProps<"input">, "type" | "role"> & {
  /** 入力のid。候補の一覧（`<id>-options`）と各候補のidの元になる。 */
  id: string;
  /** 一覧に出す候補。入力した文字では絞り込まない。 */
  options: readonly ComboboxOption[];
  /** 一覧を開閉する矢印ボタンの読み上げ名。何の候補かを含める。 */
  toggleLabel?: string;
  /** 候補の一覧の読み上げ名。 */
  listLabel?: string;
};

/**
 * 自由に入力でき、候補の一覧からも選べる一行の入力。残りの属性はinputへ渡す。
 * `role="combobox"`と開閉の矢印はcontrollerが接続してから付けて出す。
 */
export const Combobox = ({
  id,
  options,
  toggleLabel = "候補を開閉",
  listLabel = "候補",
  ...attributes
}: ComboboxProps) => (
  <div
    class="rx-combobox"
    data-controller="combobox"
    data-combobox-autocomplete-value="none"
    data-action="combobox:change->combobox#hide"
  >
    <Input
      {...attributes}
      id={id}
      type="text"
      autocomplete="off"
      data-combobox-target="input"
      data-action="click->combobox#show"
    />
    <button
      class="toggle"
      type="button"
      aria-label={toggleLabel}
      aria-haspopup="listbox"
      aria-controls={`${id}-options`}
      data-action="click->combobox#toggle"
      disabled={attributes.disabled || attributes.readonly}
      hidden
    >
      <Icon name="caret" />
    </button>
    <ul
      class="options"
      id={`${id}-options`}
      role="listbox"
      aria-label={listLabel}
      hidden
      data-combobox-target="listbox"
    >
      {options.map((option, index) => (
        <li
          id={`${id}-option-${index}`}
          role="option"
          aria-selected="false"
          aria-disabled={option.disabled ? "true" : undefined}
          data-combobox-target="option"
          data-combobox-value={option.value}
        >
          {option.label}
        </li>
      ))}
    </ul>
  </div>
);
