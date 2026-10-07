import { ToastController as BaseToastController } from "@tknf/stimulus-ui";

type Invoker = HTMLButtonElement | HTMLInputElement;

const isInvoker = (node: EventTarget): node is Invoker =>
  node instanceof HTMLButtonElement || node instanceof HTMLInputElement;

/**
 * 開閉の操作を、閉じるボタンも含めて標準のpopovertargetのボタンで持つ。
 * 利用者がそのボタンを押した時は、標準の開閉の代わりにstimulus-uiのshow・hideへ操作として渡し、
 * 取り消せる`toast:beforeshow`・`toast:beforehide`と、`toast:show`・`toast:hide`を発火する。
 * controllerが働かない時は、標準の開閉に任せる。
 */
export class ToastController extends BaseToastController {
  constructor(...args: ConstructorParameters<typeof BaseToastController>) {
    super(...args);
    const connectToast = this.connect;
    const disconnectToast = this.disconnect;
    this.connect = () => {
      connectToast();
      document.addEventListener("click", this.invoke);
    };
    this.disconnect = () => {
      document.removeEventListener("click", this.invoke);
      disconnectToast();
    };
  }

  private invoke = (event: MouseEvent) => {
    if (!event.isTrusted || event.defaultPrevented) return;
    const invoker = event.composedPath().find(isInvoker);
    if (!invoker || invoker.disabled || invoker.popoverTargetElement !== this.element) return;
    // フォームの送信ボタンでは、標準でもpopovertargetは働かない。
    if (invoker.form && (invoker.type === "submit" || invoker.type === "image")) return;
    const open = this.element.matches(":popover-open");
    const requested = invoker.popoverTargetAction;
    const action =
      requested === "show" || requested === "hide" ? requested : open ? "hide" : "show";
    if ((action === "show") === open) return;
    const requests: Event[] = [];
    const record = (request: Event) => requests.push(request);
    this.element.addEventListener(`toast:before${action}`, record);
    if (action === "show") this.show(event);
    else this.hide(event);
    this.element.removeEventListener(`toast:before${action}`, record);
    // 開閉した時と取り消された時は、標準の開閉を止める。
    if (
      this.element.matches(":popover-open") !== open ||
      requests.some((request) => request.defaultPrevented)
    )
      event.preventDefault();
  };
}
