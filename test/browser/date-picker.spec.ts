import { expect, test, type Page } from "@playwright/test";

const picker = (page: Page, id: string) => {
  const root = page.locator(`#picker-${id}`);
  return {
    root,
    field: root.locator(".control > input"),
    trigger: root.getByRole("button", { name: /のカレンダーを開く$/ }),
    panel: root.getByRole("dialog"),
  };
};
const open = async (page: Page, id: string) => {
  const current = picker(page, id);
  if (!(await current.panel.isVisible())) await current.trigger.click();
  await expect(current.panel).toBeVisible();
  await expect(current.panel.locator('[data-date-picker-target="editorStart"]')).toBeVisible();
  return current;
};
const values = (page: Page) =>
  page.getByRole("form", { name: "日付の選択例" }).evaluate((element) => {
    if (!(element instanceof HTMLFormElement)) throw new Error("フォームがありません");
    return Object.fromEntries(new FormData(element));
  });

test("初回と再表示のどちらも配置前のカレンダーを見せない", async ({ page }) => {
  await page.goto("/components/date-picker");
  const single = picker(page, "single");
  const panel = single.root.locator('[data-date-picker-target="panel"]');
  for (let opening = 0; opening < 2; opening++) {
    const hiddenOrPositioned = await panel.evaluate((element) => {
      if (!(element instanceof HTMLElement)) throw new Error("カレンダーがありません");
      // 前回の座標が残っていても、開く途中のフレームに使わせない。
      element.style.insetInlineStart = "0px";
      element.style.insetBlockStart = "0px";
      element.showPopover();
      const box = element.getBoundingClientRect();
      return getComputedStyle(element).visibility === "hidden" || (box.x >= 8 && box.y >= 8);
    });
    expect(hiddenOrPositioned).toBe(true);
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    if (!box) throw new Error("カレンダーがありません");
    expect(box.x).toBeGreaterThanOrEqual(8);
    expect(box.y).toBeGreaterThanOrEqual(8);
    await expect(panel.locator('[data-date-picker-target="editorStart"]')).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
  }
});

test("単日と期間の両端はホバー・押下中も選択色を保つ", async ({ page }) => {
  await page.goto("/components/date-picker");
  for (const [id, dates] of [
    ["single", [12]],
    ["range", [1, 30]],
  ] as const) {
    const current = await open(page, id);
    for (const date of dates) {
      const day = current.panel.getByRole("button", { name: `2026年9月${date}日`, exact: true });
      const selected = await day.evaluate((element) => {
        const style = getComputedStyle(element);
        return { background: style.backgroundColor, color: style.color };
      });
      await day.hover();
      await expect(day).toHaveCSS("background-color", selected.background);
      await expect(day).toHaveCSS("color", selected.color);
      await page.mouse.down();
      await expect(day).toHaveCSS("background-color", selected.background);
      await expect(day).toHaveCSS("color", selected.color);
      // 選択を確定せず、押下状態だけを解除する。
      await current.panel.locator(".month").hover();
      await page.mouse.up();
    }
    await page.keyboard.press("Escape");
  }
});

test("今日は黄色の面で示し、選んだ日は青緑の塗りに白い文字にする", async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 8, 12, 12));
  await page.goto("/components/date-picker");
  const single = await open(page, "single");
  const today = single.panel.getByRole("button", { name: "2026年9月12日", exact: true });
  const look = () =>
    today.evaluate((element) => ({
      text: getComputedStyle(element).color,
      background: getComputedStyle(element).backgroundColor,
    }));
  const selected = await look();
  expect(selected.text).toBe("rgb(255, 255, 255)");
  await single.panel.getByRole("button", { name: "2026年9月15日", exact: true }).click();
  const neutral = await look();
  const regular = await single.panel
    .getByRole("button", { name: "2026年9月11日", exact: true })
    .evaluate((element) => getComputedStyle(element).color);
  expect(neutral.text).toBe(regular);
  expect(neutral.background).toBe("rgb(255, 255, 203)");
  expect(neutral.background).not.toBe(selected.background);
});

test("クリアは下線付きの文字にし、終了日と左右・行高を揃えて文字を中央に置く", async ({ page }) => {
  await page.goto("/components/date-picker");
  const flexible = await open(page, "flexible");
  // 拡大しながら現れる動きの途中で測らないよう、動きの終わりを待つ。
  await flexible.panel.evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  );
  // クリアはBasecamp 2の「No due date」と同じく、下線付きのリンクの文字にする。
  await expect(flexible.panel.getByRole("button", { name: "クリア", exact: true })).toHaveCSS(
    "text-decoration-line",
    "underline",
  );
  const rows = await flexible.panel.locator(".actions > *").evaluateAll((elements) => {
    return elements.map((element) => {
      const label = element.querySelector(":scope > span");
      if (!label) throw new Error("操作行のラベルがありません");
      const box = element.getBoundingClientRect();
      const text = label.getBoundingClientRect();
      // Firefoxは同じ寸法でも小数の末尾がわずかにずれるので、0.01px単位で比べる。
      const round = (value: number) => Math.round(value * 100) / 100;
      return {
        left: round(box.left),
        right: round(box.right),
        height: round(box.height),
        textOffset: round(text.top - box.top),
        textHeight: round(text.height),
        centered: Math.abs((text.left + text.right - box.left - box.right) / 2) < 0.5,
      };
    });
  });
  expect(rows).toHaveLength(2);
  const [endDate, clear] = rows;
  if (!endDate || !clear) throw new Error("下部の操作行がありません");
  expect(clear).toEqual({ ...endDate, centered: true });
});

test("単日と期間を各一欄に表示し指定された名前で送信する", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/components/date-picker");
  const single = picker(page, "single");
  const range = picker(page, "range");
  await expect(single.field).toHaveValue("2026/09/12");
  await expect(range.field).toHaveValue("2026/09/01 – 2026/09/30");
  await expect(range.root.locator("input:visible")).toHaveCount(1);
  await expect(range.field).not.toHaveAttribute("name");
  expect(await values(page)).toMatchObject({
    published_on: "2026-09-12",
    report_start: "2026-09-01",
    report_end: "2026-09-30",
    "schedule[kind]": "single",
    "schedule[start]": "2026-09-12",
    "schedule[end]": "",
  });
  expect(errors).toEqual([]);
});

test("singleは日付だけを選択しその場で反映する", async ({ page }) => {
  await page.goto("/components/date-picker");
  const single = await open(page, "single");
  await expect(single.panel.getByRole("switch")).toHaveCount(0);
  await single.panel
    .getByRole("button", { name: "2026年9月15日", exact: true })
    .click({ modifiers: ["Shift"] });
  await expect(single.field).toHaveValue("2026/09/15");
  await page.keyboard.press("Escape");
  await expect(single.panel).toBeHidden();
  await expect(single.trigger).toBeFocused();
  await expect(single.field).toHaveValue("2026/09/15");
  expect((await values(page)).published_on).toBe("2026-09-15");
});

test("rangeの上部入力で端点を選び月をまたぐ期間を編集する", async ({ page }) => {
  await page.goto("/components/date-picker");
  const range = await open(page, "range");
  await range.panel.getByRole("button", { name: "2026年9月28日", exact: true }).click();
  await expect(range.field).toHaveValue("2026/09/28 – 2026/09/30");
  await range.panel.getByRole("button", { name: "次の月", exact: true }).click();
  await range.panel.getByRole("button", { name: "2026年10月5日", exact: true }).click();
  await expect(range.field).toHaveValue("2026/09/28 – 2026/10/05");
  const start = range.panel.locator('[data-date-picker-target="editorStart"]');
  await start.fill("2026/9/20");
  await expect(range.field).toHaveValue("2026/09/20 – 2026/10/05");
  expect(await values(page)).toMatchObject({
    report_start: "2026-09-20",
    report_end: "2026-10-05",
  });
});

test("flexibleのShift選択は前後両方向の期間と同日の種別を保持する", async ({ page }) => {
  await page.goto("/components/date-picker");
  const flexible = picker(page, "flexible");
  for (const end of [15, 10, 12]) {
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "初期値に戻す", exact: true }).click();
    await open(page, "flexible");
    await flexible.panel
      .getByRole("button", { name: `2026年9月${end}日`, exact: true })
      .click({ modifiers: ["Shift"] });
    await expect(flexible.panel.getByRole("switch", { name: "終了日", exact: true })).toBeChecked();
    expect(await values(page)).toMatchObject({
      "schedule[kind]": "range",
      "schedule[start]": `2026-09-${Math.min(12, end)}`,
      "schedule[end]": `2026-09-${Math.max(12, end)}`,
    });
  }
  await page.keyboard.press("Escape");
  await page.getByText("未入力・同日・境界・利用不可", { exact: true }).click();
  await expect(picker(page, "same").field).toHaveValue("2026/09/12 – 2026/09/12");
  expect((await values(page))["same[kind]"]).toBe("range");
});

test("flexibleはチェック操作で期間にし終了日をオフにして単日に戻せる", async ({ page }) => {
  await page.goto("/components/date-picker");
  const flexible = await open(page, "flexible");
  const toggle = flexible.panel.getByRole("switch", { name: "終了日", exact: true });
  await toggle.check();
  await expect(flexible.field).toHaveValue("2026/09/12 – 2026/09/12");
  await flexible.panel.getByRole("button", { name: "2026年9月18日", exact: true }).click();
  await expect(flexible.field).toHaveValue("2026/09/12 – 2026/09/18");
  await open(page, "flexible");
  await toggle.uncheck();
  expect(await values(page)).toMatchObject({
    "schedule[kind]": "single",
    "schedule[start]": "2026-09-12",
    "schedule[end]": "",
  });
});

test("独立したsingleは必須性と値をそれぞれ保つ", async ({ page }) => {
  await page.goto("/components/date-picker");
  const start = picker(page, "independent-start").field;
  const end = picker(page, "independent-end").field;
  await expect(start).toHaveAttribute("required");
  await expect(end).not.toHaveAttribute("required");
  await end.fill("2026/08/01");
  await expect(end).toHaveAttribute("aria-invalid", "true");
  await end.fill("2026/09/10");
  await expect(end).not.toHaveAttribute("aria-invalid");
  expect(await values(page)).toMatchObject({ starts_on: "2026-09-01", ends_on: "2026-09-10" });
  await end.fill("");
  expect((await values(page)).ends_on).toBe("");
  await start.fill("");
  await expect(start).toHaveAttribute("aria-invalid", "true");
});

test("手入力の不正日付・片側だけの期間・逆転・境界を検証する", async ({ page }) => {
  await page.goto("/components/date-picker");
  const single = picker(page, "single");
  await single.field.fill("2026/02/29");
  await expect(single.field).toHaveAttribute("aria-invalid", "true");
  await expect(single.field).toHaveValue("2026/02/29");
  await single.field.fill("2024-02-29");
  await expect(single.field).not.toHaveAttribute("aria-invalid");
  expect((await values(page)).published_on).toBe("2024-02-29");
  const range = picker(page, "range");
  await range.field.fill("2026/09/12");
  await expect(range.field).toHaveAttribute("aria-invalid", "true");
  await range.field.fill("2026/09/12 – 2026/09/10");
  await expect(range.field).toHaveAccessibleDescription(/終了日は開始日以降/);
  await range.field.fill("2026/09/12 – 2026/09/12");
  await expect(range.field).not.toHaveAttribute("aria-invalid");
  await page.keyboard.press("Escape");
  await page.getByText("未入力・同日・境界・利用不可", { exact: true }).click();
  const bounded = picker(page, "bounded");
  await bounded.field.fill("2026/09/01 – 2026/10/01");
  await expect(bounded.field).toHaveAccessibleDescription(/2026-09-30以前/);
  await open(page, "bounded");
  await expect(bounded.panel.getByRole("button", { name: "前の月", exact: true })).toBeDisabled();
  await expect(bounded.panel.getByRole("button", { name: "次の月", exact: true })).toBeDisabled();
  await expect(
    bounded.panel.getByRole("button", { name: "2026年10月1日", exact: true }),
  ).toBeDisabled();
});

test("Escapeと外側クリックで閉じても選んだ日付は残る", async ({ page }) => {
  await page.goto("/components/date-picker");
  for (const method of ["escape", "outside"]) {
    const flexible = await open(page, "flexible");
    await flexible.panel
      .getByRole("button", { name: "2026年9月15日", exact: true })
      .click({ modifiers: ["Shift"] });
    if (method === "escape") await page.keyboard.press("Escape");
    else await page.mouse.click(4, 4);
    await expect(flexible.panel).toBeHidden();
    expect(await values(page)).toMatchObject({
      "schedule[kind]": "range",
      "schedule[start]": "2026-09-12",
      "schedule[end]": "2026-09-15",
    });
  }
});

test("変更のキャンセルに従い選択イベントは確定値を渡す", async ({ page }) => {
  await page.goto("/components/date-picker");
  const flexible = await open(page, "flexible");
  await flexible.root.evaluate((element) => {
    element.addEventListener("calendar:beforechange", (event) => event.preventDefault(), {
      once: true,
    });
    element.addEventListener("date-picker:beforechange", (event) => event.preventDefault(), {
      once: true,
    });
    element.addEventListener("date-picker:change", (event) => {
      if (event instanceof CustomEvent)
        element.setAttribute("data-committed", JSON.stringify(event.detail));
    });
  });
  await flexible.panel
    .getByRole("button", { name: "2026年9月15日", exact: true })
    .click({ modifiers: ["Shift"] });
  await expect(
    flexible.panel.getByRole("switch", { name: "終了日", exact: true }),
  ).not.toBeChecked();
  await flexible.panel
    .getByRole("button", { name: "2026年9月15日", exact: true })
    .click({ modifiers: ["Shift"] });
  await expect(flexible.panel).toBeVisible();
  expect((await values(page))["schedule[kind]"]).toBe("single");
  await flexible.panel
    .getByRole("button", { name: "2026年9月15日", exact: true })
    .click({ modifiers: ["Shift"] });
  await expect(flexible.root).toHaveAttribute(
    "data-committed",
    JSON.stringify({
      selection: { kind: "range", start: "2026-09-12", end: "2026-09-15" },
      previousSelection: { kind: "single", start: "2026-09-12" },
    }),
  );
});

test("変更後もリセットは元の値と形式に戻りキャンセルしたresetには従う", async ({ page }) => {
  await page.goto("/components/date-picker");
  const flexible = await open(page, "flexible");
  await flexible.panel
    .getByRole("button", { name: "2026年9月18日", exact: true })
    .click({ modifiers: ["Shift"] });
  await page.keyboard.press("Escape");
  const form = page.getByRole("form", { name: "日付の選択例" });
  await form.evaluate((element) =>
    element.addEventListener("reset", (event) => event.preventDefault(), { once: true }),
  );
  await page.getByRole("button", { name: "初期値に戻す", exact: true }).click();
  await expect(flexible.field).toHaveValue("2026/09/12 – 2026/09/18");
  await picker(page, "range").field.fill("入力途中");
  await page.getByRole("button", { name: "初期値に戻す", exact: true }).click();
  await expect(flexible.field).toHaveValue("2026/09/12");
  await expect(picker(page, "range").field).toHaveValue("2026/09/01 – 2026/09/30");
  expect((await values(page))["schedule[kind]"]).toBe("single");
});

test("キーボードで月送りとShiftによる期間選択ができる", async ({ page }) => {
  await page.goto("/components/date-picker");
  const flexible = await open(page, "flexible");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("PageDown");
  await expect(
    flexible.panel.getByRole("button", { name: "2026年10月12日", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Enter");
  await expect(flexible.panel.getByRole("switch", { name: "終了日", exact: true })).toBeChecked();
  expect(await values(page)).toMatchObject({
    "schedule[start]": "2026-09-12",
    "schedule[end]": "2026-10-12",
  });
});

test.describe("JavaScriptなし", () => {
  test.use({ javaScriptEnabled: false });
  test("標準入力は独立した送信名と明示された形式を保つ", async ({ page }) => {
    await page.goto("/components/date-picker");
    const flexible = picker(page, "flexible");
    await expect(flexible.root.getByRole("combobox", { name: "日付の形式" })).toHaveValue("single");
    await flexible.root.getByRole("combobox", { name: "日付の形式" }).selectOption("range");
    await flexible.root
      .locator(".fallback")
      .getByLabel("終了日", { exact: true })
      .fill("2026-09-15");
    expect(await values(page)).toMatchObject({
      "schedule[kind]": "range",
      "schedule[start]": "2026-09-12",
      "schedule[end]": "2026-09-15",
    });
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "初期値に戻す", exact: true }).click();
    expect((await values(page))["schedule[kind]"]).toBe("single");
  });
});

for (const width of [375, 1280]) {
  test(`${width}pxと文字拡大・RTLで一欄の入力とカレンダーを表示する`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/components/date-picker");
    for (const enlarged of [false, true]) {
      if (enlarged)
        await page.evaluate(() => {
          document.documentElement.style.fontSize = "200%";
          document.documentElement.dir = "rtl";
        });
      const flexible = await open(page, "flexible");
      const box = await flexible.panel.boundingBox();
      if (!box) throw new Error("カレンダーがありません");
      expect(box.x).toBeGreaterThanOrEqual(7);
      expect(box.x + box.width).toBeLessThanOrEqual(width - 7);
      expect(box.y).toBeGreaterThanOrEqual(7);
      expect(box.y + box.height).toBeLessThanOrEqual(993);
      expect(
        await page
          .locator('[data-example="hono"]')
          .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
      ).toBe(true);
      await flexible.panel.screenshot({
        path: testInfo.outputPath(`picker-${width}-${enlarged ? "rtl-200" : "normal"}.png`),
      });
      await page.keyboard.press("Escape");
    }
  });
}

test("クリアは空文字を送り必須の送信は止める", async ({ page }) => {
  await page.goto("/components/date-picker");
  const flexible = await open(page, "flexible");
  await flexible.panel.getByRole("button", { name: "クリア", exact: true }).click();
  await expect(flexible.field).toHaveValue("");
  expect(await values(page)).toMatchObject({
    "schedule[kind]": "single",
    "schedule[start]": "",
    "schedule[end]": "",
  });
  const range = await open(page, "range");
  await range.panel.getByRole("button", { name: "クリア", exact: true }).click();
  await expect(range.field).toHaveAttribute("aria-invalid", "true");
  const form = page.getByRole("form", { name: "日付の選択例" });
  await form.evaluate((element) => {
    if (!(element instanceof HTMLFormElement)) throw new Error("フォームがありません");
    element.addEventListener("submit", (event) => {
      event.preventDefault();
      element.dataset.submitted = "true";
    });
    element.requestSubmit();
  });
  await expect(form).not.toHaveAttribute("data-submitted");
  await expect(range.field).toBeFocused();
});

test("外部フォームへのバインドと外部からの値更新を表示へ同期する", async ({ page }) => {
  await page.goto("/components/date-picker");
  const flexible = picker(page, "flexible");
  await flexible.root.evaluate((element) => {
    const form = document.querySelector("#date-picker-examples");
    form?.after(element);
  });
  await expect(flexible.field).toHaveValue("2026/09/12");
  await flexible.root.evaluate((element) => {
    for (const [name, value] of [
      ["start", "2026-09-10"],
      ["end", "2026-09-20"],
      ["kind", "range"],
    ]) {
      const input = element.querySelector(`[data-date-picker-target="${name}"]`);
      if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement)
        input.value = value;
    }
    element
      .querySelector('[data-date-picker-target="kind"]')
      ?.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await expect(flexible.field).toHaveValue("2026/09/10 – 2026/09/20");
  expect(await values(page)).toMatchObject({
    "schedule[kind]": "range",
    "schedule[start]": "2026-09-10",
    "schedule[end]": "2026-09-20",
  });
  await page.getByRole("button", { name: "初期値に戻す", exact: true }).click();
  await expect(flexible.field).toHaveValue("2026/09/12");
});

test("利用不可と読み取り専用は編集できず送信の扱いを保つ", async ({ page }) => {
  await page.goto("/components/date-picker");
  await page.keyboard.press("Escape");
  await page.getByText("未入力・同日・境界・利用不可", { exact: true }).click();
  const disabled = page.getByRole("group", { name: "利用不可の日付", exact: true });
  const readonly = page.getByRole("group", { name: "読み取り専用の日付", exact: true });
  await expect(disabled.getByRole("textbox")).toBeDisabled();
  await expect(disabled.getByRole("button")).toBeDisabled();
  await expect(readonly.getByRole("textbox")).not.toBeEditable();
  await expect(readonly.getByRole("button")).toBeDisabled();
  const entries = await values(page);
  expect(entries).not.toHaveProperty("disabled_date");
  expect(entries.readonly_date).toBe("2026-09-12");
});

test("タッチ操作でもShiftを使わず期間を選択できる", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    viewport: { width: 375, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:5178/components/date-picker");
  const flexible = picker(page, "flexible");
  await flexible.trigger.tap();
  await flexible.panel.getByRole("switch", { name: "終了日", exact: true }).tap();
  await flexible.panel.getByRole("button", { name: "2026年9月18日", exact: true }).tap();
  await expect(flexible.field).toHaveValue("2026/09/12 – 2026/09/18");
  await context.close();
});

test("参照先の変更とクリアでカレンダーの下限が連動する", async ({ page }) => {
  // 開いた月が実行日に左右されないよう、他の検査と同じ日に固定する。
  await page.clock.setFixedTime(new Date(2026, 8, 12, 12));
  await page.goto("/components/date-picker");
  const start = picker(page, "independent-start");
  const end = picker(page, "independent-end");
  await start.field.fill("2026/09/15");
  await open(page, "independent-end");
  await end.panel.getByRole("textbox", { name: "日付", exact: true }).fill("2026/09/10");
  await expect(end.panel.locator('[data-date-picker-target="editorError"]')).toContainText(
    "2026-09-15以降",
  );
  await expect(
    end.panel.getByRole("button", { name: "2026年9月14日", exact: true }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await start.field.fill("2026/09/10");
  await open(page, "independent-end");
  await expect(end.panel.getByRole("button", { name: "2026年9月14日", exact: true })).toBeEnabled();
});

test("項目名によらず翌日以降・前日以前を相互に設定できる", async ({ page }) => {
  await page.goto("/components/date-picker");
  const deadline = picker(page, "deadline");
  const release = picker(page, "release");
  await open(page, "release");
  await expect(
    release.panel.getByRole("button", { name: "2026年9月15日", exact: true }),
  ).toBeDisabled();
  await expect(
    release.panel.getByRole("button", { name: "2026年9月16日", exact: true }),
  ).toBeEnabled();
  await page.keyboard.press("Escape");
  await deadline.field.fill("");
  await open(page, "release");
  await expect(
    release.panel.getByRole("button", { name: "2026年9月15日", exact: true }),
  ).toBeEnabled();
  await page.keyboard.press("Escape");
  await deadline.field.fill("2026/09/20");
  await expect(deadline.field).toHaveAccessibleDescription(/2026-09-19以前/);
  await expect(release.field).toHaveValue("2026/09/20");
});
