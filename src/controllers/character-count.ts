import { CharacterCountController as BaseCharacterCountController } from "@tknf/stimulus-ui";

/** 上流の文字数表示に、超過時のフォーム検証とエラーの関連付けを加える。 */
export class CharacterCountController extends BaseCharacterCountController {
  private validationField: HTMLInputElement | HTMLTextAreaElement | null = null;
  private validationForm: HTMLFormElement | null = null;
  private originalCustomError = "";
  private originalAriaInvalid: string | null = null;
  private originalDataInvalid: string | null = null;
  private ownedErrorId: string | null = null;
  private ownsOverflow = false;
  private resetTask: number | undefined;

  constructor(...args: ConstructorParameters<typeof BaseCharacterCountController>) {
    super(...args);
    const connectBase = this.connect;
    const disconnectBase = this.disconnect;
    this.connect = () => {
      connectBase();
      const field = this.fieldTargets[0];
      if (!(field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement)) return;
      this.validationField = field;
      this.validationForm = field.form;
      field.addEventListener("input", this.validateOverflow);
      this.validationForm?.addEventListener("reset", this.afterReset);
      // 上流が数え始めた後に、文字数の表示を出す。
      queueMicrotask(() => {
        this.validateOverflow();
        this.setCounterHidden(!this.validationField);
      });
    };
    this.disconnect = () => {
      this.validationField?.removeEventListener("input", this.validateOverflow);
      this.validationForm?.removeEventListener("reset", this.afterReset);
      window.clearTimeout(this.resetTask);
      this.clearOverflow();
      this.setCounterHidden(true);
      this.validationField = null;
      this.validationForm = null;
      disconnectBase();
    };
  }

  private setCounterHidden = (hidden: boolean) => {
    for (const counter of this.counterTargets) counter.hidden = hidden;
  };

  private error = () => this.element.querySelector<HTMLElement>(".over-error[id]");

  private validateOverflow = () => {
    const field = this.validationField;
    const error = this.error();
    if (!field || !error) return;
    if (!this.over) {
      this.clearOverflow();
      return;
    }
    if (!this.ownsOverflow) {
      this.originalCustomError = field.validity.customError ? field.validationMessage : "";
      this.originalAriaInvalid = field.getAttribute("aria-invalid");
      this.originalDataInvalid = field.getAttribute("data-invalid");
      const describedBy = (field.getAttribute("aria-describedby") ?? "").split(/\s+/);
      this.ownedErrorId = describedBy.includes(error.id) ? null : error.id;
      this.ownsOverflow = true;
    }
    field.setCustomValidity(error.textContent?.trim() || "文字数の上限を超えています。");
    field.setAttribute("aria-invalid", "true");
    field.dataset.invalid = "true";
    const ids = new Set(
      (field.getAttribute("aria-describedby") ?? "").split(/\s+/).filter(Boolean),
    );
    ids.add(error.id);
    field.setAttribute("aria-describedby", [...ids].join(" "));
  };

  private clearOverflow = () => {
    const field = this.validationField;
    if (!field || !this.ownsOverflow) return;
    field.setCustomValidity(this.originalCustomError);
    if (this.originalAriaInvalid === null) field.removeAttribute("aria-invalid");
    else field.setAttribute("aria-invalid", this.originalAriaInvalid);
    if (this.originalDataInvalid === null) field.removeAttribute("data-invalid");
    else field.setAttribute("data-invalid", this.originalDataInvalid);
    if (this.ownedErrorId) {
      const ids = (field.getAttribute("aria-describedby") ?? "")
        .split(/\s+/)
        .filter((id) => id && id !== this.ownedErrorId);
      if (ids.length) field.setAttribute("aria-describedby", ids.join(" "));
      else field.removeAttribute("aria-describedby");
    }
    this.ownedErrorId = null;
    this.ownsOverflow = false;
  };

  private afterReset = (event: Event) => {
    window.clearTimeout(this.resetTask);
    this.resetTask = window.setTimeout(() => {
      if (!event.defaultPrevented) this.validateOverflow();
    }, 0);
  };
}
