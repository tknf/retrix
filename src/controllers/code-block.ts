import { Controller } from "@hotwired/stimulus";
import { ToastController } from "@tknf/stimulus-ui";

/**
 * コピー自体はstimulus-uiに任せ、利用可否と結果の表示を受け持つ。
 * 成功（role="status"）と失敗（role="alert"）は別のToastで知らせ、同時には一つだけ開く。
 */
export class CodeBlockController extends Controller<HTMLElement> {
  private notifications: HTMLElement[] = [];
  private timer: number | null = null;
  connect = () => {
    const button = this.element.querySelector('[data-code-block-target="copy"]');
    if (button instanceof HTMLButtonElement) button.hidden = !navigator.clipboard?.writeText;
    this.notifications = [...this.element.querySelectorAll<HTMLElement>(":scope > .rx-toast")];
    for (const notification of this.notifications)
      notification.addEventListener("beforetoggle", this.toggled);
    this.element.addEventListener("clipboard:copy", this.copied);
    this.element.addEventListener("keydown", this.dismiss);
    document.addEventListener("turbo:before-cache", this.hide);
  };
  disconnect = () => {
    this.hide();
    for (const notification of this.notifications)
      notification.removeEventListener("beforetoggle", this.toggled);
    this.notifications = [];
    this.element.removeEventListener("clipboard:copy", this.copied);
    this.element.removeEventListener("keydown", this.dismiss);
    document.removeEventListener("turbo:before-cache", this.hide);
  };
  private clearTimer = () => {
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = null;
  };
  private close = (notification: Element) => {
    if (!(notification instanceof HTMLElement) || !notification.matches(":popover-open")) return;
    const controller = this.application.getControllerForElementAndIdentifier(notification, "toast");
    if (controller instanceof ToastController) controller.hide();
    else notification.hidePopover();
  };
  private open = () => this.notifications.find((element) => element.matches(":popover-open"));
  private hide = () => {
    this.clearTimer();
    for (const notification of this.notifications) this.close(notification);
  };
  private toggled = (event: Event) => {
    if (!(event instanceof ToggleEvent) || event.newState !== "closed") return;
    if (!(event.currentTarget instanceof HTMLElement)) return;
    this.clearTimer();
    if (event.currentTarget.contains(document.activeElement))
      this.element
        .querySelector<HTMLButtonElement>('[data-code-block-target="copy"]')
        ?.focus({ preventScroll: true });
  };
  private dismiss = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || event.isComposing || !this.open()) return;
    event.preventDefault();
    this.hide();
  };
  private scheduleHide = (notification: HTMLElement) => {
    this.clearTimer();
    this.timer = window.setTimeout(() => {
      if (notification.matches(":hover, :focus-within")) this.scheduleHide(notification);
      else this.hide();
    }, 4000);
  };
  private copied = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const detail: unknown = event.detail;
    if (
      !detail ||
      typeof detail !== "object" ||
      !("ok" in detail) ||
      typeof detail.ok !== "boolean"
    )
      return;
    const notification = this.notifications.find(
      (element) => element.dataset.tone === (detail.ok ? "success" : "danger"),
    );
    const status = notification?.querySelector('[data-code-block-target="status"]');
    if (!notification || !status) return;
    this.clearTimer();
    for (const other of document.querySelectorAll(".rx-code-block > .rx-toast:popover-open"))
      if (other !== notification) this.close(other);
    const label =
      this.element.querySelector(".rx-layer-card > .heading > .title")?.textContent ?? "コード";
    status.textContent = detail.ok
      ? `${label}をコピーしました`
      : "コピーできませんでした。コードを選択してコピーしてください。";
    if (!notification.matches(":popover-open")) {
      const toast = this.application.getControllerForElementAndIdentifier(notification, "toast");
      if (toast instanceof ToastController) toast.show();
      else notification.showPopover();
    }
    if (detail.ok) this.scheduleHide(notification);
  };
}
