import { Controller } from "@hotwired/stimulus";
import { cloneRemovableTag } from "../internal/tag-chip";

/** TagInputControllerの通知をタグDOMとフォーム値へ反映する。 */
export class TagFieldController extends Controller<HTMLElement> {
  static targets = ["list", "template", "entry", "serialized", "note"];
  static values = { name: String, required: Boolean };

  declare readonly listTarget: HTMLUListElement;
  declare readonly templateTarget: HTMLTemplateElement;
  declare readonly entryTarget: HTMLInputElement;
  declare readonly serializedTarget: HTMLInputElement;
  declare readonly noteTarget: HTMLElement;
  declare readonly nameValue: string;
  declare readonly requiredValue: boolean;

  private form: HTMLFormElement | null = null;
  private initialValues: string[] = [];
  private resetTask: number | undefined;

  connect = () => {
    this.initialValues = this.values();
    this.form = this.entryTarget.form;
    this.form?.addEventListener("reset", this.afterReset);
    this.entryTarget.removeAttribute("name");
    this.entryTarget.required = false;
    this.entryTarget.value = "";
    this.serializedTarget.disabled = this.entryTarget.disabled;
    this.listTarget.hidden = false;
    this.sync(false);
  };

  disconnect = () => {
    this.form?.removeEventListener("reset", this.afterReset);
    window.clearTimeout(this.resetTask);
    this.form = null;
    this.entryTarget.name = this.nameValue;
    this.entryTarget.required = this.requiredValue;
    this.entryTarget.setCustomValidity("");
    this.entryTarget.value = this.values().join(", ");
    this.serializedTarget.disabled = true;
    this.listTarget.hidden = true;
  };

  beforeAdd = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    if (this.entryTarget.disabled) {
      event.preventDefault();
      return;
    }
    const detail: unknown = event.detail;
    if (typeof detail !== "object" || detail === null || !("value" in detail)) return;
    const value = detail.value;
    if (typeof value !== "string") return;
    const tag = value.trim();
    if (tag && !tag.includes(",") && !this.values().includes(tag)) return;
    event.preventDefault();
    this.noteTarget.textContent = tag.includes(",")
      ? "タグにカンマは使えません。"
      : tag
        ? "同じタグは追加できません。"
        : "タグを入力してください。";
    this.noteTarget.hidden = false;
  };

  add = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    if (this.entryTarget.disabled) return;
    const detail: unknown = event.detail;
    if (typeof detail !== "object" || detail === null || !("value" in detail)) return;
    const value = detail.value;
    if (typeof value !== "string") return;
    const tag = value.trim();
    if (!tag || tag.includes(",") || this.values().includes(tag)) {
      this.noteTarget.textContent = tag.includes(",")
        ? "タグにカンマは使えません。"
        : "同じタグは追加できません。";
      this.noteTarget.hidden = false;
      return;
    }
    this.listTarget.append(this.createChip(tag));
    this.sync(true);
  };

  remove = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    if (this.entryTarget.disabled) return;
    const detail: unknown = event.detail;
    if (typeof detail !== "object" || detail === null || !("chip" in detail)) return;
    const chip = detail.chip;
    if (!(chip instanceof HTMLLIElement) || !this.listTarget.contains(chip)) return;
    chip.remove();
    this.sync(true);
  };

  /** 外部からタグを置き換えるときに使う。 */
  replaceValues = (values: readonly string[]) => {
    const tags = [
      ...new Set(
        values.map((value) => value.trim()).filter((value) => value && !value.includes(",")),
      ),
    ];
    this.listTarget.replaceChildren(...tags.map(this.createChip));
    this.sync(true);
  };

  private values = () =>
    Array.from(this.listTarget.querySelectorAll<HTMLLIElement>("li[data-tag-input-value]"))
      .map((chip) => chip.dataset.tagInputValue ?? "")
      .filter(Boolean);

  private createChip = (tag: string) => {
    const { item: chip, remove } = cloneRemovableTag(this.templateTarget, tag);
    chip.dataset.tagInputTarget = "chip";
    chip.dataset.tagInputValue = tag;
    remove.disabled = this.entryTarget.disabled;
    return chip;
  };

  private sync = (notify: boolean) => {
    const tags = this.values();
    this.serializedTarget.value = tags.join(", ");
    this.entryTarget.setCustomValidity(
      this.requiredValue && tags.length === 0 ? "タグを追加してください。" : "",
    );
    this.noteTarget.hidden = true;
    if (!notify) return;
    this.serializedTarget.dispatchEvent(new Event("input", { bubbles: true }));
    this.serializedTarget.dispatchEvent(new Event("change", { bubbles: true }));
    this.element.dispatchEvent(
      new CustomEvent("tag-field:change", { bubbles: true, detail: { values: tags } }),
    );
  };

  private afterReset = (event: Event) => {
    window.clearTimeout(this.resetTask);
    this.resetTask = window.setTimeout(() => {
      if (event.defaultPrevented) return;
      this.listTarget.replaceChildren(...this.initialValues.map(this.createChip));
      this.entryTarget.value = "";
      this.sync(false);
    }, 0);
  };
}
