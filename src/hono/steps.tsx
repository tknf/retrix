import { Icon } from "./icon";

export type StepsProps = {
  /** 手順の一覧の読み上げ名（「申し込みの手順」など）。 */
  label: string;
  /** 段階。並べた順に番号を振る。 */
  items: readonly {
    /** 段階の名前。 */
    label: string;
    /**
     * 段階の状態。`complete`（完了）は番号の代わりにチェック、`current`（入力中）は`aria-current="step"`を付ける。
     * 名前の下に「完了」「入力中」「未入力」の文言を添える。
     */
    state: "complete" | "current" | "upcoming";
    /** 渡すと、名前をその段階へのリンクにする。 */
    href?: string;
  }[];
};
export const Steps = ({ label, items }: StepsProps) => (
  <ol class="rx-steps" aria-label={label}>
    {items.map((item, index) => (
      <li data-state={item.state} aria-current={item.state === "current" ? "step" : undefined}>
        <span class="number" aria-hidden="true">
          {item.state === "complete" ? <Icon name="check" /> : index + 1}
        </span>
        <span>
          {item.href ? <a href={item.href}>{item.label}</a> : item.label}
          <small>
            {item.state === "complete" ? "完了" : item.state === "current" ? "入力中" : "未入力"}
          </small>
        </span>
      </li>
    ))}
  </ol>
);
