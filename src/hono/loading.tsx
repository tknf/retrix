import { classes, type ElementProps } from "./types";

export type LoadingProps = ElementProps<"p"> & {
  /** 待っている処理を表す文。インジケーターの隣に書き、role="status"で読み上げる。 */
  label?: string;
  /** waveは濃・中・淡の灰色の三つの点（既定）、orbitは淡い輪の上の一部だけを濃くした丸、haloは灰色の細い輪と中の小さな点。どれも動かない。 */
  variant?: "orbit" | "wave" | "halo";
  /** inlineは文の横に置く、文字と同じ大きさのインジケーター。regionは待っている領域の中央に、大きめのインジケーターと文を縦に並べる。 */
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
