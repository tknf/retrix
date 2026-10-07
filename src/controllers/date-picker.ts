import { CalendarController } from "@tknf/stimulus-ui";
import { calendarPosition } from "./date-picker-position";
import { layoutRect } from "../internal/layout-rect";
import {
  formatSelection,
  isoDate,
  parseDate,
  parseDateInput,
  resolveDateBounds,
  selectCalendarDate,
  selectionWithEndDate,
  type DatePickerSelection,
} from "../internal/date-picker";

const shiftDays = (date: Date, days: number) => new Date(date.getTime() + days * 86400000);
const monthStart = (date: Date) => shiftDays(date, 1 - date.getUTCDate());
const shiftMonth = (date: Date, months: number) => {
  const first = monthStart(date);
  first.setUTCMonth(first.getUTCMonth() + months);
  const next = new Date(first);
  next.setUTCMonth(next.getUTCMonth() + 1);
  return shiftDays(first, Math.min(date.getUTCDate(), shiftDays(next, -1).getUTCDate()) - 1);
};
const todayDate = () => {
  const now = new Date();
  const date = new Date(0);
  date.setUTCFullYear(now.getFullYear(), now.getMonth(), now.getDate());
  return date;
};
const dateLabel = (date: Date) =>
  `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;

/** Calendarの選択を共通UIにまとめ、呼び出し側が指定したフィールドへ確定する。 */
export class DatePickerController extends CalendarController {
  static targets = [
    "day",
    "start",
    "end",
    "kind",
    "display",
    "control",
    "fallback",
    "error",
    "errorText",
    "panel",
    "month",
    "days",
    "trigger",
    "selection",
    "previous",
    "next",
    "today",
    "rangeToggle",
    "editors",
    "editorStart",
    "editorEnd",
    "editorError",
  ];
  static values = {
    ...CalendarController.values,
    choice: { type: String, default: "single" },
    minDate: String,
    maxDate: String,
    minFrom: String,
    maxFrom: String,
    minBound: { type: String, default: "start" },
    maxBound: { type: String, default: "start" },
    minOffset: { type: Number, default: 0 },
    maxOffset: { type: Number, default: 0 },
  };
  declare minDateValue: string;
  declare maxDateValue: string;
  declare minFromValue: string;
  declare maxFromValue: string;
  declare minBoundValue: string;
  declare maxBoundValue: string;
  declare minOffsetValue: number;
  declare maxOffsetValue: number;
  declare choiceValue: string;
  declare readonly startTarget: HTMLInputElement;
  declare readonly endTarget: HTMLInputElement;
  declare readonly kindTarget: HTMLSelectElement | HTMLInputElement;
  declare readonly displayTarget: HTMLInputElement;
  declare readonly controlTarget: HTMLElement;
  declare readonly fallbackTarget: HTMLElement;
  declare readonly errorTarget: HTMLElement;
  declare readonly errorTextTarget: HTMLElement;
  declare readonly panelTarget: HTMLElement;
  declare readonly monthTarget: HTMLElement;
  declare readonly daysTarget: HTMLElement;
  declare readonly triggerTarget: HTMLButtonElement;
  declare readonly selectionTarget: HTMLElement;
  declare readonly previousTarget: HTMLButtonElement;
  declare readonly nextTarget: HTMLButtonElement;
  declare readonly todayTarget: HTMLButtonElement;
  declare readonly rangeToggleTarget: HTMLInputElement;
  declare readonly hasRangeToggleTarget: boolean;
  declare readonly editorsTarget: HTMLElement;
  declare readonly editorStartTarget: HTMLInputElement;
  declare readonly editorEndTarget: HTMLInputElement;
  declare readonly editorErrorTarget: HTMLElement;
  private activeBound: "start" | "end" = "start";
  private referenceTask: number | undefined;
  private pickerForm: HTMLFormElement | null = null;
  private resetTask: number | undefined;
  private sourceDefaults = new Map<HTMLInputElement, string>();
  private initialKind = "single";
  private description = "";
  private viewMonth = monthStart(todayDate());
  private updatingBindings = false;
  private calendarEnabled = false;

  constructor(...args: ConstructorParameters<typeof CalendarController>) {
    super(...args);
    const connectCalendar = this.connect;
    const disconnectCalendar = this.disconnect;
    this.connect = () => {
      for (const input of [this.startTarget, this.endTarget])
        this.sourceDefaults.set(input, input.defaultValue);
      this.initialKind =
        this.kindTarget instanceof HTMLSelectElement
          ? (Array.from(this.kindTarget.options).find((option) => option.defaultSelected)?.value ??
            "single")
          : this.kindTarget.defaultValue;
      this.description = this.displayTarget.getAttribute("aria-describedby") ?? "";
      this.pickerForm = this.startTarget.form;
      this.viewMonth = monthStart(this.initialDate());
      this.renderMonth();
      connectCalendar();
      this.calendarEnabled = typeof this.panelTarget.showPopover === "function";
      if (this.calendarEnabled) {
        for (const input of [this.startTarget, this.endTarget]) input.type = "hidden";
        this.fallbackTarget.hidden = true;
        this.controlTarget.hidden = false;
        this.displayTarget.disabled = false;
        this.triggerTarget.setAttribute("aria-expanded", "false");
      } else {
        this.controlTarget.hidden = true;
        this.fallbackTarget.hidden = false;
      }
      delete this.element.dataset.enhancement;
      this.element.addEventListener("input", this.inputChanged);
      this.element.addEventListener("change", this.inputChanged);
      this.element.addEventListener("calendar:beforechange", this.guardSelection);
      this.element.addEventListener("calendar:change", this.calendarChanged);
      this.element.addEventListener("click", this.calendarClick, true);
      this.element.addEventListener("keydown", this.calendarKeydown, true);
      this.panelTarget.addEventListener("beforetoggle", this.beforeToggle);
      this.panelTarget.addEventListener("toggle", this.afterToggle);
      this.panelTarget.addEventListener("focusout", this.leaveCalendar);
      this.displayTarget.addEventListener("invalid", this.showInvalid);
      this.pickerForm?.addEventListener("reset", this.resetPicker);
      this.refresh();
      if (this.minFromValue || this.maxFromValue) {
        for (const type of ["input", "change", "date-picker:sync", "reset"])
          document.addEventListener(type, this.referenceChanged);
      }
      this.syncConstraints();
    };
    this.disconnect = () => {
      this.element.removeEventListener("input", this.inputChanged);
      this.element.removeEventListener("change", this.inputChanged);
      this.element.removeEventListener("calendar:beforechange", this.guardSelection);
      this.element.removeEventListener("calendar:change", this.calendarChanged);
      this.element.removeEventListener("click", this.calendarClick, true);
      this.element.removeEventListener("keydown", this.calendarKeydown, true);
      this.panelTarget.removeEventListener("beforetoggle", this.beforeToggle);
      this.panelTarget.removeEventListener("toggle", this.afterToggle);
      this.panelTarget.removeEventListener("focusout", this.leaveCalendar);
      this.displayTarget.removeEventListener("invalid", this.showInvalid);
      this.pickerForm?.removeEventListener("reset", this.resetPicker);
      window.clearTimeout(this.resetTask);
      window.clearTimeout(this.referenceTask);
      for (const type of ["input", "change", "date-picker:sync", "reset"])
        document.removeEventListener(type, this.referenceChanged);
      this.stopPositioning();
      if (this.isOpen()) this.panelTarget.hidePopover();
      disconnectCalendar();
      for (const input of [this.startTarget, this.endTarget]) {
        const current = input.value;
        input.type = "date";
        input.defaultValue = this.sourceDefaults.get(input) ?? "";
        input.value = current;
        input.setCustomValidity("");
        input.min = this.minDateValue;
        input.max = this.maxDateValue;
      }
      // Turboのキャッシュ等で再表示されても、SSR直後と同じ構造から再接続する。
      this.controlTarget.hidden = false;
      this.displayTarget.disabled = true;
      this.fallbackTarget.hidden = false;
      this.element.dataset.enhancement = "pending";
      this.calendarEnabled = false;
      this.sourceDefaults.clear();
    };
  }

  private isOpen = () => this.calendarEnabled && this.panelTarget.matches(":popover-open");
  private canEdit = () => !this.startTarget.matches(":disabled") && !this.startTarget.readOnly;
  private boundSelection = (): DatePickerSelection =>
    this.kindTarget.value === "range"
      ? { kind: "range", start: this.startTarget.value, end: this.endTarget.value }
      : { kind: "single", start: this.startTarget.value };
  private draftSelection = (): DatePickerSelection =>
    this.modeValue === "range"
      ? { kind: "range", start: this.start, end: this.end }
      : { kind: "single", start: this.value };
  private setDraft = (selection: DatePickerSelection) => {
    this.modeValue = selection.kind;
    if (selection.kind === "single") this.value = parseDate(selection.start) ? selection.start : "";
    else {
      this.start = "";
      this.start = parseDate(selection.start) ? selection.start : "";
      this.end = parseDate(selection.end) ? selection.end : "";
    }
  };
  private referenceInput = (id: string, bound: string) => {
    const root = document.getElementById(id);
    const input =
      root instanceof HTMLInputElement
        ? root
        : root?.querySelector<HTMLInputElement>(
            `input[data-date-picker-target="${bound === "end" ? "end" : "start"}"]`,
          );
    return input && !this.element.contains(input) ? input : null;
  };
  private dateBounds = () =>
    resolveDateBounds({
      min: this.minDateValue,
      max: this.maxDateValue,
      minReference: this.referenceInput(this.minFromValue, this.minBoundValue)?.value,
      maxReference: this.referenceInput(this.maxFromValue, this.maxBoundValue)?.value,
      minOffset: this.minOffsetValue,
      maxOffset: this.maxOffsetValue,
    });
  private syncConstraints = () => {
    const bounds = this.dateBounds();
    for (const input of [this.startTarget, this.endTarget]) {
      input.min = bounds.min;
      input.max = bounds.max;
    }
    const selection = this.calendarEnabled ? this.parseDisplay() : this.boundSelection();
    if (selection) {
      const empty = !selection.start && (selection.kind === "single" || !selection.end);
      this.reflectError(empty ? "" : this.selectionError(selection));
    }
    if (this.isOpen()) this.renderMonth();
  };
  private referenceChanged = (event: Event) => {
    const sources = [
      this.referenceInput(this.minFromValue, this.minBoundValue),
      this.referenceInput(this.maxFromValue, this.maxBoundValue),
    ];
    const target = event.target;
    if (
      !sources.some(
        (source) =>
          source &&
          (target === source ||
            (event.type === "reset" && target === source.form) ||
            (event.type === "date-picker:sync" &&
              target instanceof Element &&
              target.contains(source))),
      )
    )
      return;
    if (event.type === "reset") {
      window.clearTimeout(this.referenceTask);
      this.referenceTask = window.setTimeout(() => {
        if (!event.defaultPrevented) this.syncConstraints();
      }, 0);
    } else this.syncConstraints();
  };
  private clampDate = (date: Date) => {
    const bounds = this.dateBounds();
    const min = parseDate(bounds.min);
    const max = parseDate(bounds.max);
    return min && date < min ? min : max && date > max ? max : date;
  };
  private initialDate = () => this.clampDate(parseDate(this.startTarget.value) ?? todayDate());

  /** バインド先を外部から更新した場合の表示同期。input/changeイベントでも呼ばれる。 */
  refresh = () => {
    const selection = this.boundSelection();
    this.displayTarget.value = formatSelection(selection);
    const empty = !selection.start && (selection.kind === "single" || !selection.end);
    this.reflectError(empty ? "" : this.selectionError(selection));
    this.setDraft(selection);
    this.reflectSelection();
    this.element.dispatchEvent(new CustomEvent("date-picker:sync", { bubbles: true }));
  };
  private selectionError = (selection: DatePickerSelection) => {
    if (!this.canEdit()) return "";
    const dates = selection.kind === "range" ? [selection.start, selection.end] : [selection.start];
    if (dates.every((value) => !value))
      return this.displayTarget.required ? "日付を入力してください。" : "";
    if (dates.some((value) => !value)) return "開始日と終了日を指定してください。";
    const bounds = this.dateBounds();
    const min = parseDate(bounds.min);
    const max = parseDate(bounds.max);
    if (bounds.empty) return "指定できる日付がありません。関連する日付を確認してください。";
    for (const value of dates) {
      const date = parseDate(value);
      if (!date) return "存在する日付をYYYY/MM/DD形式で入力してください。";
      if (min && date < min) return `${bounds.min}以降の日付にしてください。`;
      if (max && date > max) return `${bounds.max}以前の日付にしてください。`;
    }
    return selection.kind === "range" && selection.start > selection.end
      ? "終了日は開始日以降にしてください。"
      : "";
  };
  private reflectError = (message: string) => {
    this.displayTarget.setCustomValidity(message);
    this.errorTarget.hidden = !message;
    this.errorTextTarget.textContent = message;
    for (const input of [this.displayTarget, this.startTarget, this.endTarget]) {
      if (message) {
        input.dataset.invalid = "true";
        input.setAttribute("aria-invalid", "true");
      } else {
        delete input.dataset.invalid;
        input.removeAttribute("aria-invalid");
      }
      const description = [this.description, message ? this.errorTarget.id : ""]
        .filter(Boolean)
        .join(" ");
      if (description) input.setAttribute("aria-describedby", description);
      else input.removeAttribute("aria-describedby");
    }
    if (!this.calendarEnabled) this.startTarget.setCustomValidity(message);
  };
  private showInvalid = () => this.reflectError(this.displayTarget.validationMessage);
  private parseDisplay = (): DatePickerSelection | null => {
    const text = this.displayTarget.value.trim();
    if (!text)
      return this.boundSelection().kind === "range"
        ? { kind: "range", start: "", end: "" }
        : { kind: "single", start: "" };
    const match =
      /^(\d{4}[-/]\d{2}[-/]\d{2})(?:\s*(?:[–—~〜～]|\s-\s)\s*(\d{4}[-/]\d{2}[-/]\d{2}))?$/.exec(
        text,
      );
    if (!match?.[1]) return null;
    const start = match[1].replaceAll("/", "-");
    const end = match[2]?.replaceAll("/", "-");
    if (end && this.choiceValue !== "single") return { kind: "range", start, end };
    if (!end && this.choiceValue !== "range") return { kind: "single", start };
    return null;
  };
  private inputChanged = (event: Event) => {
    if (this.updatingBindings) return;
    if (event.target === this.displayTarget) {
      const selection = this.parseDisplay();
      const error = selection
        ? this.selectionError(selection)
        : this.choiceValue === "range"
          ? "期間はYYYY/MM/DD – YYYY/MM/DD形式で入力してください。"
          : this.choiceValue === "single"
            ? "日付はYYYY/MM/DD形式で入力してください。"
            : "日付はYYYY/MM/DD、期間は2つの日付を「–」で区切って入力してください。";
      this.reflectError(error);
      if (selection && !error) this.commitSelection(selection, false);
    } else if (
      event.target === this.startTarget ||
      event.target === this.endTarget ||
      event.target === this.kindTarget
    )
      this.refresh();
  };
  private commitSelection = (selection: DatePickerSelection, format: boolean) => {
    if (!this.canEdit()) return false;
    const previousSelection = this.boundSelection();
    const changed = JSON.stringify(selection) !== JSON.stringify(previousSelection);
    const detail = { selection, previousSelection };
    if (
      changed &&
      !this.element.dispatchEvent(
        new CustomEvent("date-picker:beforechange", { bubbles: true, cancelable: true, detail }),
      )
    ) {
      this.refresh();
      return false;
    }
    this.updatingBindings = true;
    const updates = [
      [this.startTarget, selection.start],
      [this.endTarget, selection.kind === "range" ? selection.end : ""],
      [this.kindTarget, selection.kind],
    ] as const;
    const changedInputs = updates.filter(([input, value]) => input.value !== value);
    // 表示用の文字列は送信せず、名前を指定された各フィールドへ同時に確定する。
    for (const [input, value] of changedInputs) input.value = value;
    for (const [input] of changedInputs) {
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
    this.updatingBindings = false;
    if (format) this.displayTarget.value = formatSelection(selection);
    this.reflectError("");
    this.setDraft(selection);
    this.reflectSelection();
    if (changed)
      this.element.dispatchEvent(new CustomEvent("date-picker:change", { bubbles: true, detail }));
    return true;
  };
  private monthAvailable = (date: Date) => {
    const bounds = this.dateBounds();
    const min = parseDate(bounds.min);
    const max = parseDate(bounds.max);
    return (
      !bounds.empty &&
      date.getUTCFullYear() >= 1 &&
      date.getUTCFullYear() <= 9999 &&
      (!min || monthStart(date) >= monthStart(min)) &&
      (!max || monthStart(date) <= monthStart(max))
    );
  };
  private renderMonth = () => {
    this.monthTarget.textContent = `${this.viewMonth.getUTCFullYear()}年${this.viewMonth.getUTCMonth() + 1}月`;
    this.previousTarget.disabled = !this.monthAvailable(shiftMonth(this.viewMonth, -1));
    this.nextTarget.disabled = !this.monthAvailable(shiftMonth(this.viewMonth, 1));
    this.todayTarget.disabled = !this.monthAvailable(todayDate());
    const first = shiftDays(this.viewMonth, -((this.viewMonth.getUTCDay() + 6) % 7));
    const today = isoDate(todayDate());
    const bounds = this.dateBounds();
    const min = parseDate(bounds.min);
    const max = parseDate(bounds.max);
    const fragment = document.createDocumentFragment();
    for (let week = 0; week < 6; week++) {
      const row = document.createElement("tr");
      for (let weekday = 0; weekday < 7; weekday++) {
        const date = shiftDays(first, week * 7 + weekday);
        const cell = document.createElement("td");
        row.append(cell);
        if (date.getUTCFullYear() < 1 || date.getUTCFullYear() > 9999) continue;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "day";
        button.dataset.datePickerTarget = "day";
        button.dataset.calendarValue = isoDate(date);
        button.textContent = String(date.getUTCDate());
        button.setAttribute("aria-label", dateLabel(date));
        button.disabled = bounds.empty || Boolean((min && date < min) || (max && date > max));
        if (date.getUTCMonth() !== this.viewMonth.getUTCMonth()) button.dataset.outside = "true";
        if (isoDate(date) === today) {
          button.dataset.today = "true";
          button.setAttribute("aria-current", "date");
        }
        cell.append(button);
      }
      fragment.append(row);
    }
    const selected = this.draftSelection();
    this.daysTarget.replaceChildren(fragment);
    this.setDraft(selected);
    this.reflectSelection();
  };
  private reflectSelection = () => {
    const selection = this.draftSelection();
    const pendingEnd = selection.kind === "range" && selection.start && !selection.end;
    this.panelTarget.dataset.selection = pendingEnd ? "end" : "start";
    this.panelTarget.dataset.sameDay = String(
      selection.kind === "range" && selection.start === selection.end,
    );
    if (this.hasRangeToggleTarget) this.rangeToggleTarget.checked = selection.kind === "range";
    this.selectionTarget.textContent = pendingEnd
      ? `${selection.start.replaceAll("-", "/")} → 終了日を選択`
      : selection.start
        ? formatSelection(selection)
        : selection.kind === "range"
          ? "開始日を選んでください。"
          : "日付を選んでください。";
    this.editorEndTarget.hidden = selection.kind === "single";
    this.editorsTarget.dataset.kind = selection.kind;
    if (document.activeElement !== this.editorStartTarget)
      this.editorStartTarget.value = selection.start.replaceAll("-", "/");
    if (document.activeElement !== this.editorEndTarget)
      this.editorEndTarget.value =
        selection.kind === "range" ? selection.end.replaceAll("-", "/") : "";
    this.editorStartTarget.dataset.active = String(this.activeBound === "start");
    this.editorEndTarget.dataset.active = String(this.activeBound === "end");
    this.positionCalendar();
  };
  private beforeToggle = (event: Event) => {
    if (!(event instanceof ToggleEvent)) return;
    // native popoverを開いても、計測と配置が終わるまでは描画しない。
    this.panelTarget.dataset.positioned = "false";
    if (event.newState !== "open") return;
    if (!this.canEdit()) {
      event.preventDefault();
      return;
    }
    this.activeBound = "start";
    this.reflectEditorError("");
    this.setDraft(this.boundSelection());
    this.viewMonth = monthStart(this.initialDate());
    this.renderMonth();
  };
  private afterToggle = () => {
    this.triggerTarget.setAttribute("aria-expanded", String(this.isOpen()));
    if (this.isOpen()) {
      this.positionCalendar();
      // タッチではソフトキーボードを勝手に開かず、日付のタップを先にできるようにする。
      if (window.matchMedia("(pointer: coarse)").matches)
        this.focusDate(isoDate(this.initialDate()));
      else {
        this.editorStartTarget.focus({ preventScroll: true });
        this.editorStartTarget.select();
      }
      window.addEventListener("resize", this.positionCalendar);
      window.addEventListener("scroll", this.positionCalendar, true);
      window.visualViewport?.addEventListener("resize", this.positionCalendar);
      window.visualViewport?.addEventListener("scroll", this.positionCalendar);
    } else {
      this.stopPositioning();
      this.reflectEditorError("");
      this.setDraft(this.boundSelection());
    }
  };
  private stopPositioning = () => {
    this.panelTarget.dataset.positioned = "false";
    window.removeEventListener("resize", this.positionCalendar);
    window.removeEventListener("scroll", this.positionCalendar, true);
    window.visualViewport?.removeEventListener("resize", this.positionCalendar);
    window.visualViewport?.removeEventListener("scroll", this.positionCalendar);
  };
  private positionCalendar = () => {
    if (!this.isOpen()) return;
    const viewport = window.visualViewport;
    const width = viewport?.width ?? window.innerWidth;
    const height = viewport?.height ?? window.innerHeight;
    // ソフトキーボードや拡大で狭くなった表示領域に収めてから実寸を測る。
    this.panelTarget.style.maxInlineSize = `${Math.max(0, width - 16)}px`;
    this.panelTarget.style.maxBlockSize = `${Math.max(0, height - 16)}px`;
    const position = calendarPosition({
      anchor: this.controlTarget.getBoundingClientRect(),
      panel: layoutRect(this.panelTarget),
      viewport: {
        width,
        height,
        offsetLeft: viewport?.offsetLeft ?? 0,
        offsetTop: viewport?.offsetTop ?? 0,
      },
      layoutWidth: window.innerWidth,
      rtl: getComputedStyle(this.panelTarget).direction === "rtl",
    });
    this.panelTarget.style.insetInlineStart = `${position.inlineStart}px`;
    this.panelTarget.style.insetBlockStart = `${position.blockStart}px`;
    this.panelTarget.dataset.positioned = "true";
  };
  private focusDate = (value: string) => {
    const enabled = this.dayTargets.filter((day) => !day.matches(":disabled"));
    (enabled.find((day) => day.dataset.calendarValue === value) ?? enabled[0])?.focus({
      preventScroll: true,
    });
  };
  previousMonth = () => this.moveMonth(-1);
  nextMonth = () => this.moveMonth(1);
  private moveMonth = (offset: number) => {
    const next = shiftMonth(this.viewMonth, offset);
    if (!this.monthAvailable(next)) return;
    this.viewMonth = next;
    this.renderMonth();
  };
  currentMonth = () => {
    if (!this.monthAvailable(todayDate())) return;
    this.viewMonth = monthStart(todayDate());
    this.renderMonth();
    this.focusDate(isoDate(this.clampDate(todayDate())));
  };
  private calendarChanged = () => {
    const selection = this.draftSelection();
    if (!this.selectionError(selection)) this.commitSelection(selection, true);
    else this.setDraft(this.boundSelection());
    this.reflectEditorError("");
    this.editorStartTarget.value = this.boundSelection().start.replaceAll("-", "/");
    const committed = this.boundSelection();
    this.editorEndTarget.value =
      committed.kind === "range" ? committed.end.replaceAll("-", "/") : "";
    this.reflectSelection();
  };
  editStart = () => {
    this.activateBound("start");
  };
  editEnd = () => {
    this.activateBound("end");
  };
  private activateBound = (bound: "start" | "end") => {
    this.activeBound = bound;
    const selection = this.draftSelection();
    const date = parseDate(
      bound === "end" && selection.kind === "range" ? selection.end : selection.start,
    );
    if (date && monthStart(date).getTime() !== this.viewMonth.getTime()) {
      this.viewMonth = monthStart(date);
      this.renderMonth();
    }
    this.reflectSelection();
  };
  editDates = () => {
    const start =
      parseDateInput(this.editorStartTarget.value) ?? this.editorStartTarget.value.trim();
    const end = parseDateInput(this.editorEndTarget.value) ?? this.editorEndTarget.value.trim();
    const selection: DatePickerSelection =
      this.modeValue === "range" ? { kind: "range", start, end } : { kind: "single", start };
    const error = this.selectionError(selection);
    this.reflectEditorError(error);
    if (!error && this.commitSelection(selection, true)) this.activateBound(this.activeBound);
  };
  private reflectEditorError = (message: string) => {
    this.editorErrorTarget.textContent = message;
    this.editorErrorTarget.hidden = !message;
    for (const input of [this.editorStartTarget, this.editorEndTarget]) {
      if (message) {
        input.setAttribute("aria-describedby", this.editorErrorTarget.id);
        input.setAttribute("aria-invalid", "true");
      } else {
        input.removeAttribute("aria-describedby");
        input.removeAttribute("aria-invalid");
      }
    }
  };
  toggleRange = () => {
    const selection = selectionWithEndDate(
      this.boundSelection(),
      this.rangeToggleTarget.checked,
      isoDate(this.initialDate()),
    );
    if (!this.selectionError(selection) && this.commitSelection(selection, true)) {
      this.activeBound = selection.kind === "range" ? "end" : "start";
      this.reflectSelection();
    } else this.rangeToggleTarget.checked = this.boundSelection().kind === "range";
  };
  private calendarClick = (event: MouseEvent) => {
    const day = event.target;
    if (!(day instanceof HTMLButtonElement) || !this.dayTargets.includes(day)) return;
    const extend =
      this.choiceValue === "flexible" && event.shiftKey && Boolean(this.draftSelection().start);
    if (!extend && this.modeValue !== "range") return;
    event.preventDefault();
    event.stopImmediatePropagation();
    this.chooseDay(day, event.detail === 0 ? "keyboard" : "pointer", extend);
  };
  private chooseDay = (day: HTMLButtonElement, reason: "pointer" | "keyboard", extend = false) => {
    const value = day.dataset.calendarValue;
    if (!this.canEdit() || day.disabled || !value) return;
    const previous = this.draftSelection();
    const selection = selectCalendarDate(previous, value, { bound: this.activeBound, extend });
    if (selection.kind !== "range" || this.selectionError(selection)) return;
    const detail = {
      start: selection.start,
      end: selection.end,
      previousStart: previous.start,
      previousEnd: previous.kind === "range" ? previous.end : "",
      reason,
    };
    if (
      !this.element.dispatchEvent(
        new CustomEvent("calendar:beforechange", { bubbles: true, cancelable: true, detail }),
      )
    )
      return;
    this.setDraft(selection);
    this.activeBound = "end";
    this.element.dispatchEvent(new CustomEvent("calendar:change", { bubbles: true, detail }));
  };
  clearSelection = () => {
    const kind = this.boundSelection().kind;
    const selection: DatePickerSelection =
      kind === "range" ? { kind, start: "", end: "" } : { kind, start: "" };
    if (this.commitSelection(selection, true)) {
      this.reflectError(this.selectionError(selection));
      this.closeCalendar();
    }
  };
  closeCalendar = () => {
    if (this.isOpen()) this.panelTarget.hidePopover();
    this.triggerTarget.focus({ preventScroll: true });
  };
  private leaveCalendar = (event: FocusEvent) => {
    if (
      event.relatedTarget instanceof Node &&
      !this.panelTarget.contains(event.relatedTarget) &&
      event.relatedTarget !== this.triggerTarget &&
      this.isOpen()
    )
      this.panelTarget.hidePopover();
  };
  private calendarKeydown = (event: KeyboardEvent) => {
    if (!this.isOpen()) return;
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.closeCalendar();
      return;
    }
    const day = event.target;
    if (day === this.editorStartTarget || day === this.editorEndTarget) {
      if (event.key === "Enter") {
        event.preventDefault();
        this.editDates();
        if (this.editorErrorTarget.hidden) this.closeCalendar();
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        this.focusDate(
          this.activeBound === "end" ? this.end || this.start : this.draftSelection().start,
        );
      }
      return;
    }
    if (!(day instanceof HTMLButtonElement) || !this.dayTargets.includes(day)) return;
    if (
      this.choiceValue === "flexible" &&
      event.shiftKey &&
      ["Enter", " "].includes(event.key) &&
      this.draftSelection().start
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.chooseDay(day, "keyboard", true);
      return;
    }
    const date = parseDate(day.dataset.calendarValue ?? "");
    if (!date) return;
    let target: Date;
    if (event.key === "PageUp" || event.key === "PageDown")
      target = shiftMonth(date, (event.key === "PageUp" ? -1 : 1) * (event.shiftKey ? 12 : 1));
    else if (event.key === "Home" || event.key === "End")
      target = shiftDays(date, -((date.getUTCDay() + 6) % 7) + (event.key === "End" ? 6 : 0));
    else {
      const direction = getComputedStyle(this.element).direction === "rtl" ? -1 : 1;
      const offsets: Record<string, number> = {
        ArrowLeft: -direction,
        ArrowRight: direction,
        ArrowUp: -7,
        ArrowDown: 7,
      };
      const offset = offsets[event.key];
      if (offset === undefined) return;
      target = shiftDays(date, offset);
      // 表示中の日付の矢印移動は上流のroving focusに任せる。
      if (this.dayTargets.some((entry) => entry.dataset.calendarValue === isoDate(target))) return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    target = this.clampDate(target);
    if (!this.monthAvailable(target)) return;
    if (!this.dayTargets.some((entry) => entry.dataset.calendarValue === isoDate(target))) {
      this.viewMonth = monthStart(target);
      this.renderMonth();
    }
    this.focusDate(isoDate(target));
  };
  private guardSelection = (event: Event) => {
    if (!this.canEdit()) {
      event.preventDefault();
      this.closeCalendar();
    }
  };
  private resetPicker = (event: Event) => {
    window.clearTimeout(this.resetTask);
    this.resetTask = window.setTimeout(() => {
      if (event.defaultPrevented) return;
      if (this.isOpen()) this.panelTarget.hidePopover();
      // hidden入力のvalueはdefaultValueも更新するため、接続時の初期値を明示的に復元する。
      for (const [input, value] of this.sourceDefaults) input.value = value;
      this.kindTarget.value = this.initialKind;
      this.refresh();
    }, 0);
  };
}
