import { Controller } from "@hotwired/stimulus";
import { ToastController } from "@tknf/stimulus-ui";
const key = "rx-demo-workspace-settings";
export class SettingsDemoController extends Controller<HTMLFormElement> {
  private toast = () => {
    const element = this.element.querySelector<HTMLElement>(".rx-toast");
    if (!element) return null;
    const controller = this.application.getControllerForElementAndIdentifier(element, "toast");
    return controller instanceof ToastController ? controller : null;
  };
  private status = (message: string) => {
    const target = this.element.querySelector('[data-settings-demo-target="status"]');
    if (target) target.textContent = message;
  };
  private hideToast = () => {
    this.toast()?.hide();
  };
  connect = () => {
    const button = this.element.querySelector('button[type="submit"]');
    if (button instanceof HTMLButtonElement) button.disabled = false;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const value: unknown = JSON.parse(raw);
      if (typeof value !== "object" || value === null || Array.isArray(value)) return;
      for (const input of this.element.querySelectorAll("input")) {
        const saved: unknown = Object.getOwnPropertyDescriptor(value, input.name)?.value;
        if (input.type === "checkbox") {
          if (typeof saved === "boolean") input.checked = saved;
        } else if (typeof saved === "string") input.value = saved;
      }
      this.status("このブラウザに保存した設定を読み込みました。");
    } catch {
      this.status("保存済みの設定を読み込めませんでした。入力は利用できます。");
    }
  };
  save = (event: SubmitEvent) => {
    event.preventDefault();
    this.hideToast();
    const values: Record<string, string | boolean> = {};
    for (const input of this.element.querySelectorAll("input")) {
      if (input.name) values[input.name] = input.type === "checkbox" ? input.checked : input.value;
    }
    try {
      localStorage.setItem(key, JSON.stringify(values));
    } catch {
      this.status(
        "保存できませんでした。入力は残っています。ブラウザの保存設定を確認してください。",
      );
      return;
    }
    this.status("設定をこのブラウザに保存しました。");
    this.toast()?.show();
  };
  reset = () => {
    this.status("初期値に戻しました。保存すると次回にも反映します。");
    this.hideToast();
  };
  invalid = (event: Event) => {
    this.hideToast();
    if (event.target instanceof HTMLInputElement) this.status(event.target.validationMessage);
  };
}
