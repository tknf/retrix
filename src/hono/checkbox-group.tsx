import { Choice } from "./field";
import { classes, type ElementProps } from "./types";

export type CheckboxGroupOption = {
  /** 送信する値。空白だけの値と、重なった値の二つ目以降は出さない。 */
  value: string;
  /** 選択肢の名前。 */
  label: string;
  /** 名前の下に添える灰色の小さな説明。 */
  description?: string;
  /** 使えなくする。全て選択でも切り替えない。 */
  disabled?: boolean;
};
export type CheckboxGroupProps = ElementProps<"fieldset"> & {
  /** まとまりの名前。fieldsetのlegendになる。 */
  legend: string;
  /** 各選択肢のname。選んだ値を同じnameで一つずつ送信する。 */
  name: string;
  /** 選択肢。一つも無い時は「選択肢はありません。」と出し、全て選択も出さない。 */
  options: readonly CheckboxGroupOption[];
  /** 最初に選んでおく値。 */
  selected?: readonly string[];
  /** 先頭に置く全て選択の名前。このチェックボックスは送信しない。 */
  allLabel?: string;
};

/** 複数を選べるチェックボックスのグループと、全て選択のチェックボックス。 */
export const CheckboxGroup = ({
  legend,
  name,
  options,
  selected = [],
  allLabel = "すべて選択",
  class: className,
  ...attributes
}: CheckboxGroupProps) => {
  const seen = new Set<string>();
  const choices = options.filter(({ value }) => {
    if (!value.trim() || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
  return (
    <fieldset
      {...attributes}
      class={classes("rx-choice-group", className)}
      data-controller={choices.length ? "checkbox-group" : undefined}
    >
      <legend>{legend}</legend>
      {choices.length ? (
        <div class="list">
          <Choice label={allLabel} data-checkbox-group-target="all" />
          {choices.map(({ value, label, description, disabled }) => (
            <Choice
              name={name}
              value={value}
              label={label}
              description={description}
              disabled={disabled}
              checked={selected.includes(value)}
              data-checkbox-group-target="item"
              data-checkbox-group-value={value}
            />
          ))}
        </div>
      ) : (
        <p>選択肢はありません。</p>
      )}
    </fieldset>
  );
};
