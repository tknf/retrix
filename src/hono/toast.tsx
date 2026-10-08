import type { Child, PropsWithChildren } from "hono/jsx";
import { Icon } from "./icon";
import { OverlayClose, OverlayContent } from "./overlay-content";
import { classes, type ElementProps, type Tone } from "./types";

export type ToastProps = PropsWithChildren<{
  /** popoverのid。開く操作のpopovertargetや、showPopover()で開く時に指す。画面の中で一意にする。 */
  id: string;
  /** 通知の文の後に置く操作（「記事を確認する」「もう一度保存する」など）。 */
  actions?: Child;
  /** 閉じるボタンの読み上げ名。 */
  closeLabel?: string;
  /**
   * 開いてから自動で閉じるまでのミリ秒。0は閉じるボタンを押すまで残す。
   * フォーカスが中にある間は数えず、外へ出てから数え直す。ToastControllerが要る。
   */
  duration?: number;
  /** 読み上げの緊急度。politeはrole="status"、assertiveはrole="alert"にする。失敗の通知はassertiveにする。 */
  live?: "polite" | "assertive";
  /** 通知の種類。infoとsuccessは黄色の面のままで、successはアイコンを緑にする。warningとdangerは面と枠をその役割の色にする。 */
  tone?: Exclude<Tone, "neutral">;
}>;
/**
 * 通知の可視性・消去時間・ライブ領域はToastControllerが管理する。
 * 閉じるボタンは標準のpopovertargetで閉じるので、JavaScriptが無い時も働く。
 */
export const Toast = ({
  id,
  children,
  actions,
  closeLabel = "閉じる",
  duration = 0,
  live = "polite",
  tone = "info",
}: ToastProps) => (
  <aside
    id={id}
    class="rx-toast rx-overlay"
    popover="manual"
    role={live === "assertive" ? "alert" : "status"}
    aria-live={live}
    data-controller="toast"
    data-toast-duration-value={duration}
    data-toast-live-value={live}
    data-state="hidden"
    data-tone={tone}
  >
    <OverlayContent
      title={
        <div class="message">
          <Icon
            name={tone === "success" ? "check" : tone === "danger" ? "x-circle" : "info"}
            fill
          />
          <span>{children}</span>
        </div>
      }
      close={<OverlayClose label={closeLabel} popovertarget={id} popovertargetaction="hide" />}
      actions={actions}
    />
  </aside>
);

export type ToastStackProps = PropsWithChildren<
  ElementProps<"div"> & {
    /** スタックを置く場所。既定は末尾側の下（左から右に読む画面では右下）。 */
    placement?: "start" | "center" | "end";
  }
>;
/**
 * 開いているToastを、新しいものを手前にして重ねる。押すと広げ、外を押すかEscで畳む。
 * 重ね方と広げ方はToastStackControllerが扱う。childrenにはToastだけを置く。
 */
export const ToastStack = ({
  placement = "end",
  children,
  class: className,
  ...attributes
}: ToastStackProps) => (
  <div
    {...attributes}
    class={classes("rx-toast-stack", className)}
    data-controller="toast-stack"
    data-placement={placement}
  >
    {children}
  </div>
);
