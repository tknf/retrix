import { classes, type ElementProps } from "./types";

export type DialOption = {
  /** 送信する値。 */
  value: string;
  /** 目盛りに出す文言。短い数や語にする。ラジオボタンの読み上げ名になる。 */
  label: string;
};
export type DialProps = Omit<ElementProps<"fieldset">, "children"> & {
  /** 選ぶものの名前。fieldsetのlegendになり、つまみの上に出す。 */
  legend: string;
  /** ラジオボタンのname。選んだ値をこの名前で送信する。 */
  name: string;
  /** 目盛りの値。左下から時計回りに右下まで、3〜8個を並べる。9個目以降を選んだ時は針を出さない。 */
  options: readonly DialOption[];
  /** 最初に選んでおく値。どの値にも合わなければ何も選ばず、針は最初の目盛りを指す。 */
  value?: string;
  /** つまみの下に添える単位（「日」など）。 */
  unit?: string;
  /** 全ての目盛りを使えなくし、文字だけを灰色にする。 */
  disabled?: boolean;
};

/**
 * 控えめなボタンと同じ平らな白の円いつまみのダイヤル。周りの目盛りから一つを選ぶと、つまみの針がその値へ回る。
 * 実体は一つを選ぶラジオボタンのグループなので、送信・キーボードの操作（矢印キー）・読み上げは標準のまま使える。
 */
export const Dial = ({
  legend,
  name,
  options,
  value,
  unit,
  disabled,
  class: className,
  style,
  ...attributes
}: DialProps) => (
  <fieldset
    {...attributes}
    class={classes("rx-dial", className)}
    style={`--rx-dial-count: ${Math.max(options.length, 2)}${typeof style === "string" ? `; ${style}` : ""}`}
    disabled={disabled}
  >
    <legend>{legend}</legend>
    <div class="face">
      {options.map((option, index) => (
        <label class="stop" style={`--rx-dial-i: ${index}`}>
          <input type="radio" name={name} value={option.value} checked={option.value === value} />
          <span class="value">{option.label}</span>
        </label>
      ))}
      <span class="knob" aria-hidden="true">
        {options.map((_, index) => (
          <span class="tick" style={`--rx-dial-i: ${index}`} />
        ))}
        <span class="pointer" />
      </span>
    </div>
    {unit && (
      <span class="unit" aria-hidden="true">
        {unit}
      </span>
    )}
  </fieldset>
);
