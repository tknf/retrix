import { Controller } from "@hotwired/stimulus";

/**
 * 追加できる項目のチップを押すと、その欄を表示してチップを隠し、欄の最初の入力へ移る。
 * 欄の削除操作で欄を隠してチップへ戻す。隠れた欄はfieldsetごと使えなくし、送信しない。
 */
export class OptionalFieldsController extends Controller<HTMLElement> {
  static targets = ["field"];
  declare readonly fieldTargets: HTMLElement[];

  // JavaScriptが無い時は全ての欄を出すので、接続してから`open`でない欄をチップへ畳む。
  connect = () => {
    for (const slot of this.fieldTargets) this.setOpen(slot, slot.dataset.open === "true");
  };
  disconnect = () => {
    // 追加した状態はdata-openに残し、次の接続で戻す。
    for (const slot of this.fieldTargets) {
      slot.hidden = false;
      if (slot instanceof HTMLFieldSetElement) slot.disabled = false;
      const remove = this.removeButton(slot);
      if (remove) remove.hidden = true;
      const chip = this.chip(slot);
      if (chip) chip.hidden = true;
    }
  };

  add = (event: Event) => {
    const chip = event.currentTarget;
    if (!(chip instanceof HTMLButtonElement)) return;
    const slot = document.getElementById(chip.getAttribute("aria-controls") ?? "");
    if (!slot || !this.fieldTargets.includes(slot)) return;
    this.setOpen(slot, true);
    slot
      .querySelector<HTMLElement>(
        "input:not([type='hidden']), select, textarea, [contenteditable], button:not(.remove)",
      )
      ?.focus();
    this.dispatch("add", { detail: { id: this.itemId(slot) } });
  };

  remove = (event: Event) => {
    const button = event.currentTarget;
    if (!(button instanceof HTMLElement)) return;
    const slot = this.fieldTargets.find((field) => field.contains(button));
    if (!slot) return;
    this.setOpen(slot, false);
    // 押した操作は隠れるので、同じ項目を追加し直せるチップへフォーカスを移す。
    this.chip(slot)?.focus();
    this.dispatch("remove", { detail: { id: this.itemId(slot) } });
  };

  private itemId = (slot: HTMLElement) => slot.id.replace(/-slot$/, "");

  private chip = (slot: HTMLElement) =>
    Array.from(this.element.querySelectorAll<HTMLButtonElement>("button[aria-controls]")).find(
      (button) => button.getAttribute("aria-controls") === slot.id,
    );

  private removeButton = (slot: HTMLElement) =>
    slot.querySelector<HTMLButtonElement>(":scope > .remove");

  private setOpen = (slot: HTMLElement, open: boolean) => {
    slot.dataset.open = String(open);
    slot.hidden = !open;
    if (slot instanceof HTMLFieldSetElement) slot.disabled = !open;
    const remove = this.removeButton(slot);
    if (remove) remove.hidden = !open;
    const chip = this.chip(slot);
    if (chip) {
      chip.hidden = open;
      chip.setAttribute("aria-expanded", String(open));
    }
  };
}
