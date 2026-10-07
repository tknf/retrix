import { Icon } from "./icon";
import { classes, type ElementProps } from "./types";

export type InlineSelectOption = {
  /** 送信する値。 */
  value: string;
  /** 文の中に見せる語。前後の文とつないで読める形で書く（「30分前に」など）。 */
  label: string;
};
export type InlineSelectProps = Omit<ElementProps<"select">, "children"> & {
  /** 読み上げの名前。文の中では前後の文が見出しになるので、何を選ぶかを短く書く。 */
  label: string;
  /** 選べる語。並べた順にoptionにする。 */
  options: readonly InlineSelectOption[];
  /** 最初に選んでおく選択肢のvalue。渡さなければ先頭を選ぶ。 */
  value?: string;
};

/**
 * 「30分前に知らせる」「全員が送ったファイル」のように、文の中の語を押して選ぶ選択。
 * 実体は標準のselectで、文の中の青い語に見せる。欄を並べずに、設定を一つの文として読ませる時に使う。
 */
export const InlineSelect = ({
  label,
  options,
  value,
  class: className,
  ...attributes
}: InlineSelectProps) => (
  <span class={classes("rx-inline-select", className)}>
    <select {...attributes} aria-label={label}>
      {options.map((option) => (
        <option value={option.value} selected={option.value === value}>
          {option.label}
        </option>
      ))}
    </select>
    <Icon name="caret" />
  </span>
);
