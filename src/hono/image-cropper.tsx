import { useId } from "hono/jsx";
import { Disclosure } from "./disclosure";
import type { ImageCropperValue } from "@tknf/stimulus-ui";
import { Button } from "./button";
import { ImageFrame } from "./image-frame";
import { classes, type ElementProps } from "./types";

type ImageCropperCommonProps = ElementProps<"div"> & {
  /** 見出し（h3）に出し、まとまり全体の読み上げ名にする。 */
  label: string;
  /** 画像の代替テキスト。画像が無い時は代わりの枠に使う。 */
  alt: string;
  /**
   * 初期の切り抜き範囲と拡大率。位置と大きさは表示領域に対するパーセント。
   * 範囲外の値は範囲内に収め、有限でない数があるとRangeErrorを投げる。
   */
  value?: ImageCropperValue;
  /** 枠の移動・大きさの変更・スライダーをすべて止める。 */
  disabled?: boolean;
  /** srcが無い時に出す文。 */
  emptyLabel?: string;
};

export type ImageCropperProps = ImageCropperCommonProps &
  (
    | {
        /** 切り抜く画像のURL。渡さなければ画像なしの表示にし、controllerを付けない。 */
        src: string;
        /** 元画像の実寸。表示領域も同じ縦横比にして選択座標を画像へ正しく対応させる。 */
        imageWidth: number;
        /** 元画像の実寸の高さ（px）。imageWidthと同じく正の整数で、違えばRangeErrorを投げる。 */
        imageHeight: number;
      }
    | { src?: undefined; imageWidth?: never; imageHeight?: never }
  );

const defaultValue = {
  x: 25,
  y: 25,
  width: 50,
  height: 50,
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
} satisfies ImageCropperValue;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const normalizeValue = (value: ImageCropperValue): ImageCropperValue => {
  if (
    ![value.x, value.y, value.width, value.height, value.zoom, value.offsetX, value.offsetY].every(
      Number.isFinite,
    )
  ) {
    throw new RangeError("ImageCropper: value の全項目には有限数が必要です");
  }
  const width = clamp(value.width, 1, 100);
  const height = clamp(value.height, 1, 100);
  const zoom = clamp(value.zoom, 1, 5);
  return {
    x: clamp(value.x, 0, 100 - width),
    y: clamp(value.y, 0, 100 - height),
    width,
    height,
    zoom,
    offsetX: clamp(value.offsetX, 100 - 100 * zoom, 0),
    offsetY: clamp(value.offsetY, 100 - 100 * zoom, 0),
  };
};

type CropField = "x" | "y" | "width" | "height" | "zoom";

const CropRange = ({
  id,
  viewportId,
  label,
  field,
  min,
  max,
  value,
  disabled,
}: {
  id: string;
  viewportId: string;
  label: string;
  field: CropField;
  min: number;
  max: number;
  value: number;
  disabled: boolean;
}) => (
  <div class="rx-range">
    <div class="heading">
      <label class="label" for={id}>
        {label}
      </label>
    </div>
    <div class="controls">
      <div class="native">
        <input
          id={id}
          aria-controls={viewportId}
          class="input"
          type="range"
          min={min}
          max={max}
          step="any"
          value={value}
          disabled={disabled}
          data-image-cropper-target={`${field}Control`}
        />
      </div>
    </div>
  </div>
);

export const ImageCropper = ({
  id,
  label,
  src,
  alt,
  imageWidth,
  imageHeight,
  value = defaultValue,
  disabled = false,
  emptyLabel = "編集する画像がありません",
  class: className,
  ...attributes
}: ImageCropperProps) => {
  const generatedId = useId();
  const rootId = id ?? `rx-image-cropper-${generatedId}`;
  const headingId = `${rootId}-heading`;
  const instructionsId = `${rootId}-instructions`;
  const viewportId = `${rootId}-viewport`;

  if (!src) {
    return (
      <div
        {...attributes}
        id={rootId}
        class={classes("rx-image-cropper", className)}
        data-empty="true"
        aria-labelledby={headingId}
      >
        <h3 class="title" id={headingId}>
          {label}
        </h3>
        <div class="empty">
          <ImageFrame alt={alt} missingLabel="画像なし" shape="square" />
          <p>{emptyLabel}</p>
        </div>
      </div>
    );
  }

  const aspectRatio = Number(imageWidth) / Number(imageHeight);
  if (
    !Number.isSafeInteger(imageWidth) ||
    !Number.isSafeInteger(imageHeight) ||
    Number(imageWidth) <= 0 ||
    Number(imageHeight) <= 0 ||
    !Number.isFinite(aspectRatio) ||
    aspectRatio <= 0
  ) {
    throw new RangeError("ImageCropper: imageWidth と imageHeight には正の画像寸法が必要です");
  }
  const crop = normalizeValue(value);
  const style = [
    `--rx-cropper-aspect:${aspectRatio}`,
    `--image-cropper-x:${crop.x}`,
    `--image-cropper-y:${crop.y}`,
    `--image-cropper-width:${crop.width}`,
    `--image-cropper-height:${crop.height}`,
    `--image-cropper-zoom:${crop.zoom}`,
    `--image-cropper-offset-x:${crop.offsetX}`,
    `--image-cropper-offset-y:${crop.offsetY}`,
  ].join(";");

  return (
    <div
      {...attributes}
      id={rootId}
      class={classes("rx-image-cropper", className)}
      role="group"
      aria-labelledby={headingId}
      data-controller="image-cropper"
      data-image-cropper-value-value={JSON.stringify(crop)}
      data-image-cropper-max-zoom-value="5"
      data-disabled={disabled ? "true" : undefined}
      style={style}
    >
      <h3 class="title" id={headingId}>
        {label}
      </h3>
      <div class="layout">
        <div class="stage">
          <div class="viewport" id={viewportId} data-image-cropper-target="viewport">
            <img
              src={src}
              alt={alt}
              width={imageWidth}
              height={imageHeight}
              draggable="false"
              data-image-cropper-target="image"
            />
            <Button
              class="selection"
              aria-label="選択範囲を移動"
              aria-controls={`${rootId}-x ${rootId}-y`}
              aria-describedby={instructionsId}
              disabled={disabled}
              data-image-cropper-target="selection"
            />
            <Button
              class="resize"
              aria-label="選択範囲の大きさを変更"
              aria-controls={`${rootId}-width ${rootId}-height`}
              aria-describedby={instructionsId}
              disabled={disabled}
              data-image-cropper-target="resize"
            />
          </div>
        </div>
        <div class="settings">
          <CropRange
            id={`${rootId}-zoom`}
            viewportId={viewportId}
            label="拡大率"
            field="zoom"
            min={1}
            max={5}
            value={crop.zoom}
            disabled={disabled}
          />
          <Disclosure class="position" summary="位置と大きさを細かく調整">
            <div class="ranges">
              <CropRange
                id={`${rootId}-x`}
                viewportId={viewportId}
                label="横の位置"
                field="x"
                min={0}
                max={100 - crop.width}
                value={crop.x}
                disabled={disabled}
              />
              <CropRange
                id={`${rootId}-y`}
                viewportId={viewportId}
                label="縦の位置"
                field="y"
                min={0}
                max={100 - crop.height}
                value={crop.y}
                disabled={disabled}
              />
              <CropRange
                id={`${rootId}-width`}
                viewportId={viewportId}
                label="選択幅"
                field="width"
                min={1}
                max={100 - crop.x}
                value={crop.width}
                disabled={disabled}
              />
              <CropRange
                id={`${rootId}-height`}
                viewportId={viewportId}
                label="選択高さ"
                field="height"
                min={1}
                max={100 - crop.y}
                value={crop.height}
                disabled={disabled}
              />
            </div>
          </Disclosure>
          <p class="instructions" id={instructionsId} data-image-cropper-target="instructions">
            枠をドラッグして移動、下端のハンドルで大きさを変更します。矢印キーでも調整できます。
          </p>
        </div>
      </div>
    </div>
  );
};
