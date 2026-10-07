import { expect, test, type Page } from "@playwright/test";

type RecordedWindow = typeof window & { rxEvents?: unknown[] };
const recorded = (page: Page) => page.evaluate(() => (window as RecordedWindow).rxEvents ?? []);

test("一つを選ぶPickerのbeforechangeは実際に選ぶ値だけをselectedに持つ", async ({ page }) => {
  await page.goto("/components/picker");
  const root = page.locator(".rx-picker").filter({ has: page.locator("#picker-owner-search") });
  await root.evaluate((element) => {
    const events: unknown[] = [];
    (window as RecordedWindow).rxEvents = events;
    for (const type of ["combobox:beforechange", "picker:change"])
      element.addEventListener(type, (event) => {
        if (event instanceof CustomEvent) events.push([event.type, event.detail?.selected]);
      });
  });
  const search = page.getByRole("combobox", { name: "担当者", exact: true });
  await search.click();
  await page.getByRole("option", { name: "佐藤 健", exact: true }).click();
  expect(await recorded(page)).toEqual([
    ["combobox:beforechange", ["sato"]],
    ["picker:change", ["sato"]],
  ]);
  // 選び済みの候補を選び直しても、選択は変わらないので変更として通知しない。
  await search.click();
  await page.getByRole("option", { name: "佐藤 健", exact: true }).click();
  const events = await recorded(page);
  expect(events.at(-1)).toEqual(["combobox:beforechange", ["sato"]]);
  expect(
    events.filter((event) => Array.isArray(event) && event[0] === "picker:change"),
  ).toHaveLength(1);
  await expect(page.locator("#picker-owner-native")).toHaveValue("sato");
});

test("一つだけ選ぶToggleGroupはオンのボタンを押してもオンのまま", async ({ page }) => {
  await page.goto("/components/toggle-group");
  const group = page.getByRole("group", { name: "表示密度", exact: true });
  const comfortable = group.getByRole("button", { name: "標準", exact: true });
  const compact = group.getByRole("button", { name: "コンパクト", exact: true });
  await group.evaluate((element) => {
    const events: unknown[] = [];
    (window as RecordedWindow).rxEvents = events;
    element.addEventListener("toggle-group:change", (event) => events.push(event.type));
  });
  await comfortable.click();
  await expect(comfortable).toHaveAttribute("aria-pressed", "true");
  await comfortable.press("Space");
  await expect(comfortable).toHaveAttribute("aria-pressed", "true");
  expect(await recorded(page)).toEqual([]);
  await compact.click();
  await expect(compact).toHaveAttribute("aria-pressed", "true");
  await expect(comfortable).toHaveAttribute("aria-pressed", "false");
  expect(await recorded(page)).toEqual(["toggle-group:change"]);
  // 複数を選ぶグループは、オンのボタンを押すとオフにする。
  const date = page
    .getByRole("group", { name: "表示する項目", exact: true })
    .getByRole("button", { name: "日付", exact: true });
  await date.click();
  await expect(date).toHaveAttribute("aria-pressed", "false");
});

test("CopyFieldはコピーできなかった時に欄の下へ理由を出し、次にコピーすると消す", async ({
  page,
}) => {
  await page.addInitScript(() => {
    let fail = true;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          if (fail) {
            fail = false;
            throw new DOMException("拒否", "NotAllowedError");
          }
        },
      },
    });
  });
  await page.goto("/components/copy-field");
  const root = page.locator(".rx-copy-field").filter({ has: page.locator("#public-link") });
  const copy = root.getByRole("button", { name: "コピー", exact: true });
  // 見える文は.failure、読み上げは別のstatusで同じ文を伝える。
  const failure = root.locator(".failure");
  await copy.click();
  await expect(failure).toBeVisible();
  await expect(failure).toHaveText("コピーできませんでした。欄の値を選んでコピーしてください。");
  await expect(root.getByRole("status")).toHaveText(
    "コピーできませんでした。欄の値を選んでコピーしてください。",
  );
  await expect(root).not.toHaveAttribute("data-copied", "true");
  await copy.click();
  await expect(failure).toBeHidden();
  await expect(root).toHaveAttribute("data-copied", "true");
  await expect(root.getByRole("status")).toHaveText("コピーしました");
});

// PlaywrightのtoBeDisabledはfieldset自身を対象にしないので、disabledのプロパティで確かめる。
test("OptionalFieldsは削除する操作でチップへ戻し、隠れた欄を送信しない", async ({ page }) => {
  await page.goto("/components/optional-fields");
  const root = page.locator(".rx-optional-fields").first();
  const chips = root.getByRole("group", { name: "予定に追加する項目", exact: true });
  const place = page.getByRole("textbox", { name: "場所", exact: true });
  await expect(place).toBeHidden();
  await expect(page.locator("#event-place-slot")).toHaveJSProperty("disabled", true);
  await chips.getByRole("button", { name: "場所", exact: true }).click();
  await expect(place).toBeFocused();
  await place.fill("会議室A");
  await expect(page.locator("#event-place-slot")).toHaveJSProperty("disabled", false);
  const remove = root.getByRole("button", { name: "場所を削除", exact: true });
  await remove.click();
  await expect(place).toBeHidden();
  await expect(page.locator("#event-place-slot")).toHaveJSProperty("disabled", true);
  await expect(chips.getByRole("button", { name: "場所", exact: true })).toBeFocused();
  // 隠れた欄はfieldsetごと使えないので、フォームの値に含まれない。
  expect(
    await page.locator("#event-place-slot").evaluate((slot) => {
      const form = document.createElement("form");
      const clone = slot.cloneNode(true);
      form.append(clone);
      return [...new FormData(form).keys()];
    }),
  ).toEqual([]);
  await chips.getByRole("button", { name: "場所", exact: true }).click();
  await expect(place).toHaveValue("会議室A");
});

test("Dialは9個目以降を選んだ時に違う目盛りを指さないよう針を隠す", async ({ page }) => {
  await page.goto("/components/dial");
  const face = page.locator(".rx-dial > .face").first();
  const pointer = face.locator(".knob > .pointer");
  await expect(pointer).toBeVisible();
  await face.evaluate((element) => {
    const stops = element.querySelectorAll(":scope > .stop");
    const last = stops[stops.length - 1];
    if (!last) return;
    for (let count = stops.length; count < 9; count += 1) {
      const clone = last.cloneNode(true);
      if (!(clone instanceof HTMLElement)) return;
      const input = clone.querySelector("input");
      if (input) input.value = `extra-${count}`;
      last.parentElement?.insertBefore(clone, element.querySelector(":scope > .knob"));
    }
    const ninth = element.querySelectorAll<HTMLInputElement>(":scope > .stop > input")[8];
    if (ninth) ninth.checked = true;
  });
  await expect(pointer).toBeHidden();
});

test.describe("JavaScriptなし（コピー・欄の追加）", () => {
  test.use({ javaScriptEnabled: false });
  test("コピーボタンを出さず、追加できる欄は全て出して入力できる", async ({ page }) => {
    await page.goto("/components/copy-field");
    await expect(
      page.getByRole("button", { name: "コピー", includeHidden: true }).first(),
    ).toBeHidden();
    await page.goto("/components/optional-fields");
    const place = page.getByRole("textbox", { name: "場所", exact: true }).first();
    await expect(place).toBeVisible();
    await expect(place).toBeEditable();
    await expect(
      page.getByRole("button", { name: "場所を削除", includeHidden: true }).first(),
    ).toBeHidden();
    await expect(
      page
        .getByRole("group", { name: "予定に追加する項目", exact: true })
        .first()
        .getByRole("button"),
    ).toHaveCount(0);
  });
});
