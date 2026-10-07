import type { Child } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type ComparisonProps = ElementProps<"section"> & {
  /** 比べる項目の名前。見出し（h3）とルートのaria-labelにする。 */
  label: string;
  /** 変更前の内容。nullかundefinedなら「未登録」と書く。 */
  before: Child;
  /** 変更後の内容。nullかundefinedなら「未登録」と書く。 */
  after: Child;
  /** 変更前の見出し（h4）。 */
  beforeLabel?: string;
  /** 変更後の見出し（h4）。 */
  afterLabel?: string;
  /**
   * 値が変わるかどうか。trueは見出しに「変更あり」を添え、変更後を淡い青の背景にして間に矢印を置く。
   * falseは「変更なし」を添え、両方を灰色の背景にして間に等号を置く。差分の判定は利用側が行う。
   */
  changed?: boolean;
};
export const Comparison = ({
  label,
  before,
  after,
  beforeLabel = "現在",
  afterLabel = "変更後",
  changed = true,
  class: className,
  ...attributes
}: ComparisonProps) => (
  <section
    {...attributes}
    class={classes("rx-comparison", className)}
    aria-label={label}
    data-changed={changed ? "true" : "false"}
  >
    <h3 class="title">
      {label}
      <span class="state">{changed ? "変更あり" : "変更なし"}</span>
    </h3>
    <div class="pair">
      <div class="before">
        <h4>{beforeLabel}</h4>
        <div class="body">{before ?? <p>未登録</p>}</div>
      </div>
      <div class="after">
        <h4>{afterLabel}</h4>
        <div class="body">{after ?? <p>未登録</p>}</div>
      </div>
    </div>
  </section>
);
