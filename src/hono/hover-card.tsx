import type { Child, PropsWithChildren } from "hono/jsx";
import { ActionLink, Button } from "./button";
import { Icon } from "./icon";
import { OverlayClose, OverlayContent, overlayAnchorName } from "./overlay-content";

export type HoverCardProps = PropsWithChildren<{
  /** パネルのid。画面内で一意にする。見出しは`<id>-title`になる。 */
  id: string;
  /** 開く操作（またはリンク）の文言。 */
  label: string;
  /** パネルの見出し。省略するとlabelを使う。 */
  title?: string;
  /** 見出しの下に置く短い説明。パネルの説明（`aria-describedby`）になる。 */
  description?: string;
  /** パネルの幅。compactは16rem、defaultは20rem、wideは28remを上限にする。 */
  size?: "compact" | "default" | "wide";
  /**
   * 渡すと、labelを移動のリンクにし、隣に目のアイコンのプレビュー操作を置く。
   * 押すとリンクは移動し、プレビュー操作はパネルを開く。
   */
  href?: string;
  /** 見出しの横の閉じる操作の名前。 */
  closeLabel?: string;
  /** パネルの下の操作欄に並べる関連操作。関連する操作がある時だけ渡す。 */
  actions?: Child;
}>;

/** リンクや操作の対象を、hover・focusで開く操作可能なプレビュー。 */
export const HoverCard = ({
  id,
  label,
  title = label,
  description,
  size = "default",
  href,
  closeLabel = "閉じる",
  actions,
  children,
}: HoverCardProps) => {
  const anchor = overlayAnchorName("hover-card", id);
  return (
    <div class="rx-hover-card" data-controller="hover-card">
      {href ? (
        <>
          <ActionLink
            href={href}
            data-hover-card-target="trigger"
            aria-controls={id}
            aria-expanded="false"
            style={`anchor-name: ${anchor}`}
          >
            {label}
          </ActionLink>
          <Button
            class="preview"
            data-hover-card-target="preview"
            data-icon-only="true"
            aria-label={`${label}のプレビューを開く`}
            aria-controls={id}
            aria-expanded="false"
          >
            <Icon name="eye" />
          </Button>
        </>
      ) : (
        <Button
          data-hover-card-target="trigger"
          aria-controls={id}
          aria-expanded="false"
          style={`anchor-name: ${anchor}`}
        >
          {label}
        </Button>
      )}
      <div
        id={id}
        class="panel rx-overlay"
        data-placement="anchor"
        popover="manual"
        role="dialog"
        aria-labelledby={`${id}-title`}
        aria-describedby={description ? `${id}-description` : undefined}
        data-hover-card-target="content"
        data-size={size}
        style={`--rx-overlay-anchor: ${anchor}`}
      >
        <OverlayContent
          title={<strong id={`${id}-title`}>{title}</strong>}
          description={description && <p id={`${id}-description`}>{description}</p>}
          close={<OverlayClose label={closeLabel} data-hover-card-target="close" />}
          actions={actions}
        >
          {children}
        </OverlayContent>
      </div>
    </div>
  );
};
