import { CalendarController as CalendarSelectionController } from "@tknf/stimulus-ui";

const weekMilliseconds = 7 * 24 * 60 * 60 * 1000;

/** YYYY-MM-DDの日付を7日前・後にずらす。暦の計算はUTCで行い、時差や夏時間の影響を受けない。 */
const shiftWeek = (date: string, weeks: number) => {
  const time = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(time)
    ? new Date(time + weeks * weekMilliseconds).toISOString().slice(0, 10)
    : "";
};

/**
 * 上流の選択とroving tabindexに、↑↓で同じ曜日の前後の週へ移動する操作を加える。
 * 上流は並んだ日付のボタンの7つ前・後へ移るので、月の前後の空き（null）があると上下の日とずれる。
 * ここでは日付で7日前・後のボタンを探し、無いか使えない時は動かない。
 */
export class CalendarController extends CalendarSelectionController {
  constructor(...args: ConstructorParameters<typeof CalendarSelectionController>) {
    super(...args);
    // 上流のライフサイクルはインスタンス関数なので、保持してから上下の移動を追加する。
    const connectCalendar = this.connect;
    const disconnectCalendar = this.disconnect;
    this.connect = () => {
      connectCalendar();
      this.element.addEventListener("keydown", this.moveWeek, true);
    };
    this.disconnect = () => {
      this.element.removeEventListener("keydown", this.moveWeek, true);
      disconnectCalendar();
    };
  }

  private moveWeek = (event: KeyboardEvent) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    if (!event.isTrusted) return;
    const day = event.target;
    if (!(day instanceof HTMLButtonElement) || day.disabled || !this.dayTargets.includes(day))
      return;
    const value = shiftWeek(day.dataset.calendarValue ?? "", event.key === "ArrowUp" ? -1 : 1);
    // 上流の7つ前・後への移動を走らせない。フォーカスの移動は上流のfocusinがroving tabindexに反映する。
    event.preventDefault();
    event.stopPropagation();
    const target = this.dayTargets.find(
      (candidate) =>
        candidate instanceof HTMLButtonElement && candidate.dataset.calendarValue === value,
    );
    if (target instanceof HTMLButtonElement && !target.disabled) target.focus();
  };
}
