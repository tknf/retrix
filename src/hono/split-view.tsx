import { useId, type Child } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type SplitViewProps = ElementProps<"div"> & {
  /** 先に読む領域。広い配置では先頭側、狭い配置では上に置く。 */
  primary: Child;
  /** 後に読む領域。広い配置では末尾側、狭い配置では下に置く。 */
  secondary: Child;
  /** inspectorはprimaryを広く取る作業＋補足、readerはprimaryを狭く取る一覧＋本文。 */
  layout?: "inspector" | "reader";
  /**
   * 境目にハンドルを置き、ドラッグと矢印キーで幅を変えられるようにする。
   * SplitterControllerをsplitterとして登録した時だけ働き、未接続ではlayoutの固定の比率で並べる。
   */
  resizable?: boolean;
  /**
   * resizableの時のprimaryの幅の初期値。全体に対する百分率で、20〜80の範囲に収める。
   * 既定はreaderで38、inspectorで68。
   */
  initialSize?: number;
};

/** inspectorは作業＋補足、readerは一覧＋本文。DOMの読み順は常にprimaryが先。 */
export const SplitView = ({
  primary,
  secondary,
  layout = "inspector",
  resizable = false,
  initialSize = layout === "reader" ? 38 : 68,
  id,
  class: className,
  ...attributes
}: SplitViewProps) => {
  const generatedId = useId();
  const viewId = id ?? `rx-split-view-${generatedId}`;
  const size = Number.isFinite(initialSize) ? Math.min(80, Math.max(20, initialSize)) : 50;
  return (
    <div
      {...attributes}
      id={viewId}
      class={classes("rx-split-view", className)}
      data-layout={layout}
      data-resizable={resizable ? "true" : undefined}
      data-controller={resizable ? "splitter" : undefined}
      data-splitter-value-value={resizable ? size : undefined}
      data-splitter-min-value={resizable ? 20 : undefined}
      data-splitter-max-value={resizable ? 80 : undefined}
      data-splitter-orientation-value={resizable ? "vertical" : undefined}
    >
      <div class="panes">
        <div
          class="primary"
          id={`${viewId}-primary`}
          data-splitter-target={resizable ? "primary" : undefined}
        >
          {primary}
        </div>
        {resizable && (
          <div
            class="handle"
            role="separator"
            tabindex={0}
            aria-label="領域の幅を調整"
            aria-controls={`${viewId}-primary`}
            aria-orientation="vertical"
            data-splitter-target="handle"
          >
            <span class="grip" aria-hidden="true" />
          </div>
        )}
        <div class="secondary">{secondary}</div>
      </div>
      {/* ハンドルを動かす制御が必要とする標準の範囲入力。操作はハンドルが担うため、見た目からは隠す。 */}
      {resizable && (
        <div class="size-control rx-visually-hidden">
          <label for={`${viewId}-size`}>主領域の幅</label>
          <input
            id={`${viewId}-size`}
            type="range"
            min={20}
            max={80}
            value={size}
            data-splitter-target="range"
          />
        </div>
      )}
    </div>
  );
};
