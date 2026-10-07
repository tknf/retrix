import { classes, type ElementProps } from "./types";

export type LoadingProps = ElementProps<"p"> & {
  /** 待っている処理を表す文。インジケーターの隣に書き、role="status"で読み上げる。 */
  label?: string;
  /** waveは青から紫の三つの点が順に跳ねるインジケーター（既定）、orbitは回る丸、haloは広がって消える輪。 */
  variant?: "orbit" | "wave" | "halo";
  /** inlineは文の流れに置く小さなインジケーター。regionは待っている領域の中央に、大きめのインジケーターと文を縦に並べる。 */
  layout?: "inline" | "region";
};
export const Loading = ({
  label = "読み込み中…",
  variant = "wave",
  layout = "inline",
  class: className,
  ...attributes
}: LoadingProps) => (
  <p
    {...attributes}
    class={classes("rx-loading", className)}
    role="status"
    data-variant={variant}
    data-layout={layout}
  >
    <span class="indicator" aria-hidden="true">
      {variant === "wave" && (
        <>
          <i />
          <i />
          <i />
        </>
      )}
    </span>
    <span class="label">{label}</span>
  </p>
);
