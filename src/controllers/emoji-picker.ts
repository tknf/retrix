import { Controller } from "@hotwired/stimulus";

/**
 * 絵文字パネル。入力した言葉で絵文字を絞り込み、グリッドの中を矢印キーで移動し、クリックかEnterで選ぶ。
 * グリッドへTabで入る位置は一か所だけにし（roving tabindex）、選ぶとemoji-picker:pickを発火する。
 */
export class EmojiPickerController extends Controller<HTMLElement> {
  static targets = ["input", "group", "emoji", "empty"];
  declare readonly inputTarget: HTMLInputElement;
  declare readonly groupTargets: HTMLElement[];
  declare readonly emojiTargets: HTMLButtonElement[];
  declare readonly emptyTarget: HTMLElement;

  private visible = () => this.emojiTargets.filter((emoji) => !emoji.hidden);

  private focus = (emoji: HTMLButtonElement | undefined) => {
    if (!emoji) return;
    for (const other of this.emojiTargets) other.tabIndex = other === emoji ? 0 : -1;
    emoji.focus();
  };

  /**
   * 表示中の絵文字を、見た目の行に分ける。種類ごとにグリッドが分かれるので、グリッドが変わる所と上端が変わる所で行を切る。
   * 実際の位置から数えるので、狭い場所で列が減っても、行の途中で終わる種類があっても上下の移動が合う。
   */
  private rows = (visible: HTMLButtonElement[]) => {
    const rows: HTMLButtonElement[][] = [];
    let previous: HTMLButtonElement | undefined;
    for (const emoji of visible) {
      const row = rows.at(-1);
      if (
        row &&
        previous?.parentElement === emoji.parentElement &&
        previous.offsetTop === emoji.offsetTop
      )
        row.push(emoji);
      else rows.push([emoji]);
      previous = emoji;
    }
    return rows;
  };

  filter = () => {
    const query = this.inputTarget.value.trim().toLocaleLowerCase();
    for (const emoji of this.emojiTargets)
      emoji.hidden = query !== "" && !(emoji.dataset.search ?? "").includes(query);
    for (const group of this.groupTargets)
      group.hidden = !group.querySelector("[data-emoji-picker-target='emoji']:not([hidden])");
    const visible = this.visible();
    this.emptyTarget.hidden = visible.length > 0;
    const first = visible[0];
    for (const emoji of this.emojiTargets) emoji.tabIndex = emoji === first ? 0 : -1;
  };

  move = (event: KeyboardEvent) => {
    const current = event.target;
    if (!(current instanceof HTMLButtonElement)) return;
    const visible = this.visible();
    const index = visible.indexOf(current);
    if (index < 0) return;
    const rtl = getComputedStyle(this.element).direction === "rtl";
    const step: Record<string, number> = {
      ArrowRight: rtl ? -1 : 1,
      ArrowLeft: rtl ? 1 : -1,
    };
    if (event.key in step) {
      event.preventDefault();
      const next = Math.min(Math.max(index + (step[event.key] ?? 0), 0), visible.length - 1);
      this.focus(visible[next]);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      // 上下の行の同じ列へ移動する。移動先の行が短い時はその行の最後へ移動し、端の行では動かない。
      event.preventDefault();
      const rows = this.rows(visible);
      const rowIndex = rows.findIndex((row) => row.includes(current));
      const column = rows[rowIndex]?.indexOf(current) ?? 0;
      const target = rows[rowIndex + (event.key === "ArrowDown" ? 1 : -1)];
      if (target) this.focus(target[Math.min(column, target.length - 1)]);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      this.focus(event.key === "Home" ? visible[0] : visible.at(-1));
    }
  };

  pick = (event: Event) => {
    const emoji = event.currentTarget;
    if (!(emoji instanceof HTMLButtonElement)) return;
    this.dispatch("pick", {
      detail: { emoji: emoji.dataset.emoji, name: emoji.getAttribute("aria-label") },
    });
  };
}
