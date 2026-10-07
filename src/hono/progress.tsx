import { classes, type ElementProps } from "./types";
import { getProgressState } from "../internal/progress";

export type ProgressProps = ElementProps<"label"> & {
  /** 処理の名前（「添付ファイルを送信しています」など）。バーの上に書き、進捗の読み上げ名にもする。 */
  label: string;
  /**
   * 終えた量。0〜maxに収めて描く。省略するか有限でない値を渡すと、進捗が分からない状態の表示になる。
   * max以上の時だけ完了として100%と書き、それまでは0.1%単位で切り捨てて99.9%で止める。
   */
  value?: number;
  /** 全体の量。0以下や有限でない値は1として扱う。 */
  max?: number;
};
export const Progress = ({
  label,
  value,
  max = 100,
  class: className,
  ...attributes
}: ProgressProps) => {
  const {
    limit,
    current,
    percentage,
    complete,
    label: percentageLabel,
  } = getProgressState(value, max);
  return (
    <label {...attributes} class={classes("rx-progress", className)}>
      <span class="heading">
        <span>{label}</span>
        {percentageLabel !== undefined && (
          <span class="value" aria-hidden="true">
            {percentageLabel}
          </span>
        )}
      </span>
      <span
        class="track"
        data-state={
          percentage === undefined ? "indeterminate" : complete ? "complete" : "determinate"
        }
        aria-hidden="true"
      >
        <span
          class="fill"
          style={percentage === undefined ? undefined : `inline-size: ${percentage}%`}
        />
      </span>
      <progress class="rx-visually-hidden" value={current} max={limit}>
        {percentageLabel ?? "処理中"}
      </progress>
    </label>
  );
};
