import { ToggleGroupController as BaseToggleGroupController } from "@tknf/stimulus-ui";

/**
 * 上流のToggleGroupで、一つだけ選ぶ時はオンのボタンを押してもオフにしない。
 * 表示密度のような「どれか一つの状態」の切り替えで、全てオフの状態を作らないため。
 */
export class ToggleGroupController extends BaseToggleGroupController {
  constructor(...args: ConstructorParameters<typeof BaseToggleGroupController>) {
    super(...args);
    const connectBase = this.connect;
    const disconnectBase = this.disconnect;
    this.connect = () => {
      this.element.addEventListener("click", this.keepSelection, true);
      connectBase();
    };
    this.disconnect = () => {
      this.element.removeEventListener("click", this.keepSelection, true);
      disconnectBase();
    };
  }

  // 上流はdefaultPreventedのclickを扱わないので、オンのボタンの押下は取り消して何もしない。
  private keepSelection = (event: MouseEvent) => {
    if (this.multipleValue || !(event.target instanceof Element)) return;
    const item = event.target.closest("button");
    if (!(item instanceof HTMLButtonElement) || !this.itemTargets.includes(item)) return;
    if (this.selected.includes(item.dataset.toggleGroupValue ?? "")) event.preventDefault();
  };
}
