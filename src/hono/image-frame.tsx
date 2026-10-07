import { classes, type ElementProps } from "./types";

export type ImageFrameProps = ElementProps<"figure"> & {
  /** 画像のURL。渡さなければ淡い背景にmissingLabelを置いて、画像がないことを示す。 */
  src?: string;
  /** 画像の代替テキスト。画像がない時は「alt：missingLabel」を読み上げる。 */
  alt: string;
  /** 枠の比率。portraitは5:7で幅8remまで、squareは1:1で幅8remまで、landscapeは16:9で幅16remまで。 */
  shape?: "portrait" | "square" | "landscape";
  /** containは画像全体を枠の中央に収め、coverは枠いっぱいに切り抜く。 */
  fit?: "contain" | "cover";
  /** 画像がない時に枠に書く文言。 */
  missingLabel?: string;
  /** 画像の下に中央そろえで書く名前（ファイル名など）。 */
  caption?: string;
  /** 名前の下に灰色の小さな文字で添えるサイズや日付。 */
  meta?: string;
};
export const ImageFrame = ({
  src,
  alt,
  shape = "portrait",
  fit = "contain",
  missingLabel = "画像なし",
  caption,
  meta,
  class: className,
  ...attributes
}: ImageFrameProps) => (
  <figure
    {...attributes}
    class={classes("rx-image-frame", className)}
    data-shape={shape}
    data-fit={fit}
  >
    <div class="image">
      {src ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <span role="img" aria-label={`${alt}：${missingLabel}`}>
          {missingLabel}
        </span>
      )}
    </div>
    {(caption || meta) && (
      <figcaption>
        {caption && <span class="name">{caption}</span>}
        {meta && <span class="meta">{meta}</span>}
      </figcaption>
    )}
  </figure>
);
