import { expect, test } from "vite-plus/test";
import {
  parseDateInput,
  resolveDateBounds,
  selectCalendarDate,
  selectionWithEndDate,
  type DatePickerSelection,
} from "../src/internal/date-picker";

const singleDate = (start = "2026-09-14"): DatePickerSelection => ({ kind: "single", start });
const dateRange = (start = "2026-09-14", end = "2026-09-16"): DatePickerSelection => ({
  kind: "range",
  start,
  end,
});

test("終了日を有効にすると同日の期間になり解除すると開始日の単日に戻る", () => {
  const single = singleDate();
  expect(selectionWithEndDate(single, true, "2026-09-12")).toEqual(
    dateRange("2026-09-14", "2026-09-14"),
  );
  expect(selectionWithEndDate(dateRange(), false, "2026-09-12")).toEqual(single);
  expect(single).toEqual(singleDate());
});

test("空の日付へ終了日を追加すると指定した初期日を使う", () => {
  expect(selectionWithEndDate(singleDate(""), true, "2026-09-12")).toEqual(
    dateRange("2026-09-12", "2026-09-12"),
  );
});

test("Shift選択で前後両方向の期間と同日の期間を作る", () => {
  const selection = singleDate();
  expect(selectCalendarDate(selection, "2026-09-16", { extend: true })).toEqual(dateRange());
  expect(selectCalendarDate(selection, "2026-09-12", { extend: true })).toEqual(
    dateRange("2026-09-12", "2026-09-14"),
  );
  expect(selectCalendarDate(selection, "2026-09-14", { extend: true })).toEqual(
    dateRange("2026-09-14", "2026-09-14"),
  );
});

test("通常の単日選択では終了日を作らない", () => {
  expect(selectCalendarDate(singleDate(), "2026-09-20")).toEqual(singleDate("2026-09-20"));
});

test("指定した端点だけを編集し期間が逆転するときだけ同日に揃える", () => {
  const selection = dateRange();
  expect(selectCalendarDate(selection, "2026-09-12", { bound: "start" })).toEqual(
    dateRange("2026-09-12", "2026-09-16"),
  );
  expect(selectCalendarDate(selection, "2026-09-20", { bound: "end" })).toEqual(
    dateRange("2026-09-14", "2026-09-20"),
  );
  expect(selectCalendarDate(selection, "2026-09-20", { bound: "start" })).toEqual(
    dateRange("2026-09-20", "2026-09-20"),
  );
  expect(selectCalendarDate(selection, "2026-09-10", { bound: "end" })).toEqual(
    dateRange("2026-09-10", "2026-09-10"),
  );
  expect(selection).toEqual(dateRange());
});

test("固定の境界と連動する境界の厳しい方を使う", () => {
  expect(
    resolveDateBounds({
      min: "2026-09-01",
      max: "2026-09-30",
      minReference: "2026-09-10",
      maxReference: "2026-09-20",
    }),
  ).toEqual({ min: "2026-09-10", max: "2026-09-20", empty: false });
  expect(
    resolveDateBounds({
      min: "2026-09-01",
      max: "2026-09-30",
      minReference: "2026-08-10",
      maxReference: "2026-10-20",
    }),
  ).toEqual({ min: "2026-09-01", max: "2026-09-30", empty: false });
});

test("参照日が変わると条件が変わり空値や不正な参照は固定条件に戻る", () => {
  const limits = { min: "2026-09-01", max: "2026-09-30" };
  expect(resolveDateBounds({ ...limits, minReference: "2026-09-12" }).min).toBe("2026-09-12");
  expect(resolveDateBounds({ ...limits, minReference: "2026-09-20" }).min).toBe("2026-09-20");
  for (const minReference of ["", "入力途中", "2026-02-29"]) {
    expect(resolveDateBounds({ ...limits, minReference })).toEqual({ ...limits, empty: false });
  }
});

test("日数差で翌日以降と前日以前を指定でき月と年とうるう日をまたげる", () => {
  expect(resolveDateBounds({ minReference: "2026-09-30", minOffset: 1 }).min).toBe("2026-10-01");
  expect(resolveDateBounds({ maxReference: "2026-01-01", maxOffset: -1 }).max).toBe("2025-12-31");
  expect(resolveDateBounds({ minReference: "2024-02-28", minOffset: 1 }).min).toBe("2024-02-29");
  expect(resolveDateBounds({ minReference: "2026-02-28", minOffset: 1 }).min).toBe("2026-03-01");
});

test("固定境界と参照境界が衝突したら選択可能な日付なしとする", () => {
  expect(resolveDateBounds({ max: "2026-09-10", minReference: "2026-09-12" }).empty).toBe(true);
  expect(resolveDateBounds({ minReference: "2026-09-12", maxReference: "2026-09-12" }).empty).toBe(
    false,
  );
  expect(
    resolveDateBounds({ minReference: "2026-09-12", minOffset: 1, maxReference: "2026-09-12" })
      .empty,
  ).toBe(true);
});

test("表現できる年を越える日数差や不正な差を無制約にしない", () => {
  expect(resolveDateBounds({ minReference: "9999-12-31", minOffset: 1 }).empty).toBe(true);
  expect(resolveDateBounds({ maxReference: "0001-01-01", maxOffset: -1 }).empty).toBe(true);
  expect(resolveDateBounds({ minReference: "2026-09-12", minOffset: Number.NaN }).empty).toBe(true);
});

test("ゼロ埋めなしの日付を正規化し存在しない日付は受け付けない", () => {
  expect(parseDateInput("2026/9/14")).toBe("2026-09-14");
  expect(parseDateInput("2024/2/29")).toBe("2024-02-29");
  for (const value of ["2026/2/29", "2026/13/1", "2026/9/31", "0000/1/1", "明日", ""]) {
    expect(parseDateInput(value)).toBeNull();
  }
});
