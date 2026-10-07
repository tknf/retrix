import { Button } from "./button";

export type ToggleGroupItem = {
  /** 選択の値。空白だけの値と、重なった値の二つ目以降は出さない。 */
  value: string;
  /** ボタンの文言。 */
  label: string;
  /** 押せなくする。矢印キーの移動でも飛ばす。 */
  disabled?: boolean;
};
export type ToggleGroupProps = {
  /** まとまりの読み上げ名。 */
  label: string;
  /** 切り替えるボタン。 */
  items: readonly ToggleGroupItem[];
  /** 最初にオンにする値。multipleでない時は先頭の一つだけを使う。 */
  selected?: readonly string[];
  /** trueで複数をオンにできる。falseは一つだけで、別のボタンを押すと切り替わり、オンのボタンを押してもオンのままにする。 */
  multiple?: boolean;
  /** 並べる向き。矢印キーもhorizontalは左右、verticalは上下で移る。 */
  orientation?: "horizontal" | "vertical";
};

/** 画面内の単一・複数の状態切替。変更結果はtoggle-group:changeで渡す。 */
export const ToggleGroup = ({
  label,
  items,
  selected = [],
  multiple = false,
  orientation = "horizontal",
}: ToggleGroupProps) => {
  const seen = new Set<string>();
  const choices = items.filter((item) => {
    if (item.value.trim() === "" || seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  });
  const values = multiple ? selected : selected.slice(0, 1);
  return (
    <div
      class="rx-toggle-group"
      role="group"
      aria-label={label}
      data-controller="toggle-group"
      data-toggle-group-multiple-value={multiple}
      data-toggle-group-selected-value={JSON.stringify(values)}
      data-toggle-group-orientation-value={orientation}
      data-orientation={orientation}
    >
      {choices.map((item) => (
        <Button
          type="button"
          data-toggle-group-target="item"
          data-toggle-group-value={item.value}
          data-state={values.includes(item.value) ? "on" : "off"}
          aria-pressed={values.includes(item.value)}
          disabled={item.disabled}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};
