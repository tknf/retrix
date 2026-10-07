import { useId } from "hono/jsx";
import { InputGroup } from "./input-group";
import { classes, type ElementProps } from "./types";

export type RangeProps = Omit<ElementProps<"input">, "type" | "value" | "children"> & {
  /** 名前。単一値ではラベル、範囲指定ではfieldsetのlegendになる。単位はここにも含める。 */
  label: string;
  /** 下限。スライダーの先頭側の端に数として出す。 */
  min: number;
  /** 上限。スライダーの末尾側の端に数として出す。 */
  max: number;
  /** 数値なら単一値、[下限, 上限]なら範囲指定になる。省略すると単一値で、位置はブラウザの既定（minとmaxの中間）になる。 */
  value?: number | readonly [number, number];
  /** 単位。単一値では現在値の表示に、範囲指定では下限・上限の数の入力の後に添える。 */
  unit?: string;
};

const isInterval = (value: RangeProps["value"]): value is readonly [number, number] =>
  Array.isArray(value);

/**
 * 連続する数値を調整するスライダー。範囲指定は2本のスライダーと数の入力で下限と上限を選ぶ。
 * 残りの属性（stepなど）はスライダーのinputへ渡す。
 */
export const Range = ({
  id,
  label,
  min,
  max,
  value,
  unit = "",
  name,
  disabled,
  class: className,
  ...attributes
}: RangeProps) => {
  const generatedId = useId();
  const rangeId = id ?? `rx-range-${generatedId}`;
  const labelId = `${rangeId}-label`;
  const interval = isInterval(value);
  const entries = interval
    ? [
        { id: `${rangeId}-start`, bound: "start", label: "下限", value: value[0] },
        { id: `${rangeId}-end`, bound: "end", label: "上限", value: value[1] },
      ]
    : [{ id: rangeId, bound: "value", label, value }];
  const root = {
    class: classes("rx-range", className),
    "data-controller": "range",
    "data-mode": interval ? "interval" : "single",
  };
  const controls = (
    <div class="controls">
      {entries.map((entry) => (
        <div class="native">
          {interval && (
            <label class="label" id={`${entry.id}-label`} for={entry.id}>
              {entry.label}
            </label>
          )}
          <input
            {...attributes}
            id={entry.id}
            class="input"
            type="range"
            min={min}
            max={max}
            name={name ? (interval ? `${name}-${entry.bound}` : name) : undefined}
            value={entry.value}
            disabled={disabled}
            aria-labelledby={interval ? `${labelId} ${entry.id}-label` : labelId}
            data-range-target="input"
          />
        </div>
      ))}
    </div>
  );
  const limits = (
    <div class="limits" aria-hidden="true">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  );

  if (interval) {
    return (
      <fieldset {...root} disabled={disabled} dir={attributes.dir}>
        <legend class="label" id={labelId}>
          {label}
        </legend>
        {controls}
        {limits}
        <div class="values" hidden>
          {entries.map((entry) => (
            <label class="rx-field" for={`${entry.id}-number`}>
              <span class="label" id={`${entry.id}-number-label`}>
                {entry.label}
              </span>
              <InputGroup
                type="number"
                id={`${entry.id}-number`}
                aria-labelledby={`${labelId} ${entry.id}-number-label`}
                suffix={unit}
                min={min}
                max={max}
                step={attributes.step}
                value={entry.value}
                form={attributes.form}
                disabled={disabled}
                data-range-bound={entry.bound}
              />
            </label>
          ))}
        </div>
      </fieldset>
    );
  }
  return (
    <div {...root} dir={attributes.dir}>
      <div class="heading">
        <label class="label" for={rangeId} id={labelId}>
          {label}
        </label>
        <output class="value" for={rangeId} data-range-unit={unit} aria-live="off" hidden />
      </div>
      {controls}
      {limits}
    </div>
  );
};
