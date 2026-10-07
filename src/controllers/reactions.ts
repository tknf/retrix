import { Controller } from "@hotwired/stimulus";

const readBy = (value: string | undefined): string[] => {
  const parsed: unknown = JSON.parse(value ?? "[]");
  return Array.isArray(parsed) ? parsed.filter((name) => typeof name === "string") : [];
};

/** reactions:beforetoggle・reactions:toggleのdetail。 */
type ToggleDetail = { content: string; name: string; selected: boolean };

/**
 * リアクションの付け外し。リアクションを押すと自分のリアクションを付けるか外し、数と付けた人を更新する。
 * EmojiPickerで選んだ絵文字や書いた言葉は、同じリアクションがあればそこへ自分を追加し、なければ新しいリアクションを作る。
 * どちらも更新する前にreactions:beforetoggle（取り消し可能）、更新した後にreactions:toggleを発火する。
 * 数が0になったリアクションは消す。保存は利用側が持ち、失敗した時はsetReactionでリアクションを戻す。
 */
export class ReactionsController extends Controller<HTMLElement> {
  static targets = ["list", "text"];
  static values = { me: String };
  declare readonly listTarget: HTMLUListElement;
  declare readonly textTarget: HTMLInputElement;
  declare readonly hasTextTarget: boolean;
  declare readonly meValue: string;

  private render = (chip: HTMLButtonElement, by: string[], mine: boolean) => {
    const names = by.join("、");
    const content = chip.dataset.content ?? "";
    chip.dataset.by = JSON.stringify(by);
    chip.setAttribute("aria-pressed", mine ? "true" : "false");
    chip.dataset.mine = mine ? "true" : "false";
    chip.setAttribute("aria-label", `${chip.dataset.name ?? content}：${names}`);
    chip.title = names;
    const count = chip.querySelector(".count");
    if (count) count.textContent = String(by.length);
  };

  /**
   * リアクションに自分を追加するか除く。リアクションが無ければ作り、数が0になれば消す。消したリアクションにフォーカスがあった時か、
   * 利用者の操作の時（focusNext）は、次のリアクションか追加ボタンへフォーカスを移す。
   */
  private apply = (
    content: string,
    name: string,
    mine: boolean,
    focusNext: boolean,
  ): HTMLButtonElement | null => {
    const found = this.chips().find((chip) => chip.dataset.content === content);
    if (!found && !mine) return null;
    const chip = found ?? this.create(content, name);
    const others = readBy(chip.dataset.by).filter((person) => person !== this.meValue);
    const by = mine ? [...others, this.meValue] : others;
    if (by.length === 0) {
      const item = chip.closest("li");
      const focused = focusNext || chip === document.activeElement;
      const next = item?.nextElementSibling?.querySelector("button") ?? this.trigger();
      item?.remove();
      if (focused) next?.focus();
      return null;
    }
    this.render(chip, by, mine);
    return chip;
  };

  /** 利用者の操作のイベントを発火する。beforetoggleが取り消されたらfalseを返し、何も変えない。 */
  private request = (detail: ToggleDetail) =>
    !this.dispatch("beforetoggle", { detail, cancelable: true }).defaultPrevented;

  private trigger = () => this.element.querySelector<HTMLButtonElement>(".rx-popover > .rx-button");

  private chips = () => [...this.listTarget.querySelectorAll<HTMLButtonElement>("button.reaction")];

  /**
   * 自分のリアクションを、イベントを発火せずに付ける（selected: true）か外す。保存に失敗した時に、
   * reactions:toggleのdetail（content・name・selectedの逆）でリアクションを元に戻すために使う。
   */
  setReaction = (content: string, selected: boolean, name = content) => {
    if (content !== "") this.apply(content, name, selected, false);
  };

  toggle = (event: Event) => {
    const chip = event.currentTarget;
    if (!(chip instanceof HTMLButtonElement)) return;
    const content = chip.dataset.content ?? "";
    const detail = {
      content,
      name: chip.dataset.name ?? content,
      selected: chip.dataset.mine !== "true",
    };
    if (!this.request(detail)) return;
    this.apply(detail.content, detail.name, detail.selected, true);
    this.dispatch("toggle", { detail });
  };

  pick = (event: Event) => {
    if (!(event instanceof CustomEvent)) return;
    const detail: unknown = event.detail;
    if (typeof detail !== "object" || detail === null || !("emoji" in detail)) return;
    const content = typeof detail.emoji === "string" ? detail.emoji : "";
    const name = "name" in detail && typeof detail.name === "string" ? detail.name : content;
    this.react(content, name, event.target);
  };

  /** 入力したリアクション。空なら何もしない。日本語入力の確定のEnterでは追加しない。 */
  addText = (event: Event) => {
    if (!this.hasTextTarget) return;
    if (event instanceof KeyboardEvent) {
      if (event.isComposing) return;
      event.preventDefault();
    }
    const content = this.textTarget.value.trim();
    this.react(content, content, event.target);
    if (content !== "") this.textTarget.value = "";
  };

  private react = (content: string, name: string, source: EventTarget | null) => {
    if (content === "") return;
    if (source instanceof Element) source.closest<HTMLElement>("[popover]")?.hidePopover();
    const found = this.chips().find((chip) => chip.dataset.content === content);
    if (found?.dataset.mine === "true") {
      found.focus();
      return;
    }
    const detail = { content, name: found?.dataset.name ?? name, selected: true };
    if (!this.request(detail)) return;
    const chip = this.apply(content, detail.name, true, false);
    this.dispatch("toggle", { detail });
    chip?.focus();
  };

  /** 新しいリアクション。サーバーが出力するリアクションと同じ構造をここで組み、一覧の末尾に追加する。 */
  private create = (content: string, name: string) => {
    const item = document.createElement("li");
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "reaction";
    chip.dataset.content = content;
    chip.dataset.name = name;
    chip.dataset.by = "[]";
    chip.dataset.action = "reactions#toggle";
    const part = (className: string, text: string) => {
      const span = document.createElement("span");
      span.className = className;
      span.setAttribute("aria-hidden", "true");
      span.textContent = text;
      return span;
    };
    chip.append(part("content", content), part("count", "0"));
    item.append(chip);
    this.listTarget.append(item);
    return chip;
  };
}
