import type { Child } from "hono/jsx";
import { overlayAnchorName } from "./overlay-content";

export type TooltipTriggerAttributes = {
  /** 補足のid。補足を操作の説明として読み上げる。 */
  "aria-describedby": string;
  /** TooltipControllerが操作を見つける印。 */
  "data-tooltip-target": "trigger";
  /** 補足を操作の近くに置くためのCSSのアンカー名（`anchor-name`）。 */
  style: string;
};

export type TooltipProps = {
  /** 補足のid。画面内で一意にする。 */
  id: string;
  /** 補足の文。短い一文にし、リンクや操作を入れない。 */
  text: string;
  /**
   * 操作を描く関数。受け取った属性をフォーカスできる一つの操作（ButtonやActionLink）へそのまま渡す。
   * 自分でstyleを持つ時は、受け取ったstyleと合わせる。
   */
  trigger: (attributes: TooltipTriggerAttributes) => Child;
  /** ホバーしてから、またはフォーカスしてから補足を出すまでのミリ秒。0ならすぐ出す。負の数などは既定値に戻す。 */
  delay?: number;
};

/** 短い非対話的な補足。操作や必須の説明はトリガー側に残す。 */
export const Tooltip = ({ id, text, trigger, delay = 150 }: TooltipProps) => {
  const anchor = overlayAnchorName("tooltip", id);
  const attributes = {
    "aria-describedby": id,
    "data-tooltip-target": "trigger",
    style: `anchor-name: ${anchor}`,
  } satisfies TooltipTriggerAttributes;

  return (
    <span
      class="rx-tooltip"
      data-controller="tooltip"
      data-tooltip-delay-value={Number.isFinite(delay) && delay >= 0 ? delay : 150}
    >
      {trigger(attributes)}
      <span
        id={id}
        class="content rx-overlay"
        role="tooltip"
        popover="manual"
        data-tooltip-target="content"
        style={`position-anchor: ${anchor}`}
      >
        {text}
      </span>
    </span>
  );
};
