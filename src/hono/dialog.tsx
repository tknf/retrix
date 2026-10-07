import type { Child, PropsWithChildren } from "hono/jsx";
import { Button } from "./button";
import type { ButtonVariant } from "./types";
import { OverlayClose, OverlayContent } from "./overlay-content";

export type DialogProps = PropsWithChildren<{
  /** `dialog`要素のid。画面内で一意にする。見出しは`<id>-title`、説明は`<id>-description`になる。 */
  id: string;
  /** 見出し。ダイアログの名前として読み上げる。 */
  title: string;
  /** 開く操作の文言。 */
  trigger: string;
  /** 見出しの下に置く短い説明。ダイアログの説明（`aria-describedby`）になる。 */
  description?: string;
  /** 開く操作の見た目。削除の確認ならdangerにする。 */
  triggerVariant?: ButtonVariant;
  /** 開く操作を押せなくする。 */
  triggerDisabled?: boolean;
  /** パネルの幅。compactは26rem、defaultは32rem、wideは52remを上限にする。 */
  size?: "compact" | "default" | "wide";
  /** 見出しの横の閉じる操作の名前。actionsがある時は、操作欄の先頭に置くキャンセル操作の文言にもなる。 */
  closeLabel?: string;
  /**
   * 操作欄に並べる操作。渡すと、閉じる操作（closeLabel）の後ろに置く。
   * 押して閉じる操作には`data-dialog-target="close"`を付ける。
   */
  actions?: Child;
  /** contentでは本文内のautofocus、または最初の操作へ移る。 */
  initialFocus?: "title" | "content";
}>;
/** 閉じたnative dialogを出力する。保存や削除の処理は利用側で実装する。 */
export const Dialog = ({
  id,
  title,
  trigger,
  description,
  triggerVariant = "secondary",
  triggerDisabled,
  size = "default",
  closeLabel = "閉じる",
  actions,
  initialFocus = "title",
  children,
}: DialogProps) => (
  <div class="rx-dialog" data-controller="dialog" data-state="closed">
    <Button
      variant={triggerVariant}
      disabled={triggerDisabled}
      data-dialog-target="trigger"
      aria-controls={id}
      aria-haspopup="dialog"
      aria-expanded="false"
      data-state="closed"
    >
      {trigger}
    </Button>
    <dialog
      id={id}
      class="panel rx-overlay"
      closedby="any"
      data-dialog-target="dialog"
      data-state="closed"
      data-size={size}
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
    >
      <OverlayContent
        title={
          <h2
            id={`${id}-title`}
            data-dialog-target="title"
            tabindex={-1}
            autofocus={initialFocus === "title"}
          >
            {title}
          </h2>
        }
        description={description && <p id={`${id}-description`}>{description}</p>}
        close={<OverlayClose label={closeLabel} data-dialog-target="close" />}
        actions={
          actions != null &&
          actions !== false && (
            <>
              <Button data-dialog-target="close">{closeLabel}</Button>
              {actions}
            </>
          )
        }
      >
        {children}
      </OverlayContent>
    </dialog>
  </div>
);
