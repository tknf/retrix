import { expect, test } from "@playwright/test";

test("EditablePropertyは値そのものを押しても鉛筆と同じイベントを出し、取り消せば編集を始めない", async ({
  page,
}) => {
  await page.goto("/components/editable-property");
  const property = page.locator('[data-example="hono"] .rx-editable-property').first();
  await property.evaluate((element) => {
    const log: string[] = [];
    element.setAttribute("data-log", "");
    for (const name of ["editable:beforeedit", "editable:edit"])
      element.addEventListener(name, (event) => {
        if (!(event instanceof CustomEvent)) return;
        const detail: unknown = event.detail;
        const reason =
          detail && typeof detail === "object" && "reason" in detail ? String(detail.reason) : "";
        log.push(`${name}:${reason}`);
        element.setAttribute("data-log", log.join(","));
        if (name === "editable:beforeedit" && element.hasAttribute("data-block"))
          event.preventDefault();
      });
  });
  const value = property.locator(".value");
  // 取り消すと編集を始めず、editable:editも出さない。
  await property.evaluate((element) => element.setAttribute("data-block", ""));
  await value.click();
  await expect(property).toHaveAttribute("data-state", "viewing");
  await expect(property).toHaveAttribute("data-log", "editable:beforeedit:pointer");
  // 取り消さなければ編集を始め、鉛筆と同じ順にイベントを出して値の全体を選ぶ。
  await property.evaluate((element) => element.removeAttribute("data-block"));
  await value.click();
  await expect(property).toHaveAttribute("data-state", "editing");
  await expect(property).toHaveAttribute(
    "data-log",
    "editable:beforeedit:pointer,editable:beforeedit:pointer,editable:edit:pointer",
  );
  const input = property.getByRole("textbox", { name: "担当者" });
  await expect(input).toBeFocused();
  expect(
    await input.evaluate((element) =>
      element instanceof HTMLInputElement
        ? element.selectionEnd === element.value.length && element.selectionStart === 0
        : false,
    ),
  ).toBe(true);
});

test("EditablePropertyは確定した時だけ完了のマークを描き、未登録の色を値に合わせる", async ({
  page,
}) => {
  await page.goto("/components/editable-property");
  const property = page.locator('[data-example="hono"] .rx-editable-property').nth(1);
  const value = property.locator(".value");
  await expect(value).toHaveAttribute("data-empty", "true");
  await property.getByRole("button", { name: "メモを編集" }).click();
  await page.keyboard.type("9月中に確認");
  // 素のEnterでは確定せず、フォームも送らない。
  await page.keyboard.press("Enter");
  await expect(property).toHaveAttribute("data-state", "editing");
  await page.keyboard.press("ControlOrMeta+Enter");
  await expect(value).toHaveText("9月中に確認");
  await expect(value).not.toHaveAttribute("data-empty");
  await expect(property).toHaveAttribute("data-saved", "true");
  await expect(property).not.toHaveAttribute("data-saved", { timeout: 3000 });
  await property.getByRole("button", { name: "メモを編集" }).click();
  await page.keyboard.press("Escape");
  await expect(property).not.toHaveAttribute("data-saved");
});

test("EditablePropertyの複数行はEnterで改行し、Control / Meta+Enterで確定して改行を表示に残す", async ({
  page,
}) => {
  await page.goto("/components/editable-property");
  const property = page
    .locator('[data-example="hono"] .rx-editable-property[data-multiline="true"]')
    .first();
  const value = property.locator(".value");
  const rule = () =>
    property.evaluate((element) => {
      const editing = element.getAttribute("data-state") === "editing";
      const row = element.querySelector(editing ? ".editor > textarea" : ".preview");
      return row?.getBoundingClientRect().top;
    });
  const viewing = await rule();
  await property.getByRole("button", { name: "打ち合わせの要点を編集" }).click();
  expect(await rule()).toBe(viewing);
  await property
    .locator("textarea")
    .evaluate((element) =>
      element instanceof HTMLTextAreaElement
        ? element.setSelectionRange(element.value.length, element.value.length)
        : undefined,
    );
  await page.keyboard.press("Enter");
  await page.keyboard.type("資料は前日までに共有する。");
  await expect(property).toHaveAttribute("data-state", "editing");
  await page.keyboard.press("ControlOrMeta+Enter");
  await expect(property).toHaveAttribute("data-state", "viewing");
  expect(await value.textContent()).toBe(
    "カテゴリは5つにまとめる。\n公開は9月30日。\n次回は10月7日の14時から。\n資料は前日までに共有する。",
  );
  // 改行を表示にも残し、4行分の高さで表示する（値の行の上下の余白は除く）。
  const lines = await value.evaluate((element) => {
    const style = getComputedStyle(element);
    return (
      (element.getBoundingClientRect().height -
        Number.parseFloat(style.paddingTop) -
        Number.parseFloat(style.paddingBottom)) /
      Number.parseFloat(style.lineHeight)
    );
  });
  expect(Math.round(lines)).toBe(4);
});

test("EditablePropertyは表示と編集で一行目の高さと文字の開始位置を変えず、編集を始めると値を選ぶ", async ({
  page,
}) => {
  await page.goto("/components/editable-property");
  const property = page.locator('[data-example="hono"] .rx-editable-property').first();
  // 表示の値と編集中の欄の、一行目の中心の高さと文字の開始位置を測る。
  const measure = () =>
    property.evaluate((element) => {
      const editing = element.getAttribute("data-state") === "editing";
      const box = element.querySelector(editing ? ".editor > .rx-input" : ".preview > .value");
      if (!(box instanceof HTMLElement)) return null;
      const style = getComputedStyle(box);
      const rect = box.getBoundingClientRect();
      const line = parseFloat(style.lineHeight);
      const edge = editing ? parseFloat(style.borderTopWidth) : 0;
      return {
        middle:
          box instanceof HTMLInputElement
            ? rect.top + rect.height / 2
            : rect.top + edge + parseFloat(style.paddingTop) + line / 2,
        start:
          rect.left +
          (editing ? parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft) : 0),
        size: style.fontSize,
      };
    });
  const viewing = await measure();
  // 鉛筆だけでなく、値そのものを押しても編集を始める。
  await property.locator(".value").click();
  await expect(property).toHaveAttribute("data-state", "editing");
  const editing = await measure();
  expect(editing?.middle).toBeCloseTo(viewing?.middle ?? Number.NaN, 0);
  expect(editing?.start).toBeCloseTo(viewing?.start ?? Number.NaN, 0);
  expect(editing?.size).toBe(viewing?.size);
  const input = property.locator("input");
  await expect(input).toBeFocused();
  expect(
    await input.evaluate((element) =>
      element instanceof HTMLInputElement
        ? [element.selectionStart, element.selectionEnd, element.value.length]
        : [],
    ),
  ).toEqual([0, 4, 4]);
  await page.keyboard.press("Escape");
  await expect(property).toHaveAttribute("data-state", "viewing");
});
