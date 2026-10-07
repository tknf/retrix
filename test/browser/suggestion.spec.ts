import { expect, test } from "@playwright/test";

test("入力を絞り込み矢印とEnterで選択し標準イベントを通知する", async ({ page }) => {
  const warnings: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "warning" && message.text().includes("combobox controller"))
      warnings.push(message.text());
  });
  await page.goto("/components/suggestion");
  const input = page.locator("#hono-category");
  const root = page.locator(".rx-suggestion").filter({ has: input });
  await expect(input).toHaveAccessibleName("分類（自由入力可）");
  await expect(input).toHaveAccessibleDescription(
    "入力すると候補を絞り込みます。候補にない分類もそのまま使えます。",
  );
  await expect(input).not.toHaveAttribute("list");
  await input.fill("仕事");
  await expect(root.getByRole("option")).toHaveText(["仕事場", "仕事の道具"]);
  await input.evaluate((element) => {
    element.addEventListener("input", () => element.setAttribute("data-input-received", "true"));
    element.addEventListener("change", () => element.setAttribute("data-change-received", "true"));
  });
  await input.press("ArrowDown");
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(input).toHaveValue("仕事の道具");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await expect(input).toHaveAttribute("data-input-received", "true");
  await expect(input).toHaveAttribute("data-change-received", "true");
  await expect(input).toBeFocused();
  await input.press("ArrowDown");
  await input.press("Escape");
  await expect(root.getByRole("listbox")).toBeHidden();
  expect(warnings).toEqual([]);
});

test("全候補の開閉と同じ値の選び直しを扱い変更キャンセルを保つ", async ({ page }) => {
  await page.goto("/components/suggestion");
  const input = page.locator("#hono-category");
  const root = page.locator(".rx-suggestion").filter({ has: input });
  const toggle = root.getByRole("button");
  await input.fill("仕事");
  await toggle.click();
  await expect(root.getByRole("listbox")).toBeHidden();
  await toggle.click();
  await expect(root.getByRole("option")).toHaveCount(6);
  await root.getByRole("option", { name: "暮らし", exact: true }).click();
  await expect(input).toHaveValue("暮らし");
  await expect(root.getByRole("listbox")).toBeHidden();
  await input.click();
  await root.getByRole("option", { name: "暮らし", exact: true }).click();
  await expect(root.getByRole("listbox")).toBeHidden();
  await input.click();
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(root.getByRole("listbox")).toBeHidden();
  await root.evaluate((element) => {
    element.addEventListener("combobox:beforechange", (event) => event.preventDefault(), {
      once: true,
    });
  });
  await toggle.click();
  await root.getByRole("option", { name: "イベント", exact: true }).click();
  await expect(input).toHaveValue("暮らし");
  await expect(root.getByRole("listbox")).toBeVisible();
  await page.getByRole("textbox", { name: "記事名", exact: true }).click();
  await expect(root.getByRole("listbox")).toBeHidden();
});

test("候補外の自由入力を送信し初期値と候補をリセットする", async ({ page }) => {
  await page.goto("/components/suggestion");
  const form = page.getByRole("form", { name: "記事の分類設定" });
  const input = page.locator("#hono-category");
  const root = page.locator(".rx-suggestion").filter({ has: input });
  await input.fill("取材記録");
  await expect(root.getByRole("status")).toHaveText(
    "一致する候補はありません。入力した内容をそのまま使えます。",
  );
  await expect(root.getByRole("listbox")).toBeHidden();
  expect(
    await form.evaluate((element) =>
      element instanceof HTMLFormElement ? new FormData(element).get("category") : null,
    ),
  ).toBe("取材記録");
  await page.getByText("初期値・候補なし・エラー・利用不可", { exact: true }).click();
  const initial = page.getByRole("combobox", { name: "初期値のある分類", exact: true });
  await initial.fill("運営");
  await form.getByRole("button", { name: "初期値に戻す", exact: true }).click();
  await expect(input).toHaveValue("");
  await expect(initial).toHaveValue("編集");
  await expect(root.getByRole("status", { includeHidden: true })).toBeEmpty();
  await input.press("ArrowDown");
  await expect(root.getByRole("option")).toHaveCount(6);
});

test("候補なし・エラー・利用不可・読み取り専用を区別する", async ({ page }) => {
  await page.goto("/components/suggestion");
  await page.getByText("初期値・候補なし・エラー・利用不可", { exact: true }).click();
  const empty = page.getByRole("combobox", { name: "新しい分類", exact: true });
  await empty.fill("日記");
  await expect(empty).toHaveValue("日記");
  await expect(empty).toHaveAttribute("aria-expanded", "false");
  const error = page.getByRole("combobox", { name: "分類（必須）", exact: true });
  await expect(error).toHaveAttribute("aria-invalid", "true");
  await expect(error).toHaveAccessibleDescription("分類を入力してください。");
  await expect(
    page.getByRole("combobox", { name: "分類（利用不可）", exact: true }),
  ).toBeDisabled();
  const readonly = page.getByRole("combobox", { name: "分類（読み取り専用）", exact: true });
  await readonly.press("ArrowDown");
  await readonly.press("Enter");
  await expect(readonly).toHaveAttribute("aria-expanded", "false");
  await expect(readonly).toHaveValue("お知らせ");
  await expect(
    page.getByRole("button", { name: "分類（読み取り専用）の候補を開閉", exact: true }),
  ).toBeDisabled();
});

test("日本語変換中のEnterで選択せず変換確定後に絞り込む", async ({ page }) => {
  await page.goto("/components/suggestion");
  const input = page.locator("#hono-category");
  const root = page.locator(".rx-suggestion").filter({ has: input });
  await input.click();
  await input.press("ArrowDown");
  await input.dispatchEvent("compositionstart");
  await input.evaluate((element) => {
    if (!(element instanceof HTMLInputElement)) throw new Error("入力欄がありません");
    element.value = "仕事";
    element.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        inputType: "insertCompositionText",
        data: "仕事",
        isComposing: true,
      }),
    );
  });
  await input.press("Enter");
  await expect(input).toHaveValue("仕事");
  await expect(root.getByRole("option")).toHaveCount(6);
  await input.dispatchEvent("compositionend");
  await expect(root.getByRole("option")).toHaveText(["仕事場", "仕事の道具"]);
});

test.describe("タッチ操作", () => {
  test.use({ hasTouch: true, viewport: { width: 375, height: 812 } });
  test("開閉ボタンから候補を開きタップで選ぶ", async ({ page }) => {
    await page.goto("/components/suggestion");
    const input = page.locator("#hono-category");
    const root = page.locator(".rx-suggestion").filter({ has: input });
    await root.getByRole("button").tap();
    const option = root.getByRole("option", { name: "制作ノート", exact: true });
    const box = await option.boundingBox();
    if (!box) throw new Error("候補がありません");
    expect(box.height).toBeGreaterThanOrEqual(44);
    await option.tap();
    await expect(input).toHaveValue("制作ノート");
    await expect(root.getByRole("listbox")).toBeHidden();
  });
});

test.describe("JavaScriptなし", () => {
  test.use({ javaScriptEnabled: false });
  test("標準datalistと自由入力・リセットを保つ", async ({ page }) => {
    await page.goto("/components/suggestion");
    const input = page.locator("#hono-category");
    const root = page.locator(".rx-suggestion").filter({ has: input });
    await expect(input).toHaveAttribute("list", "hono-category-options");
    await expect(root.locator("datalist option")).toHaveCount(6);
    await expect(root.getByRole("button", { includeHidden: true })).toBeHidden();
    await input.fill("候補にない分類");
    await expect(input).toHaveValue("候補にない分類");
    await page.getByRole("button", { name: "初期値に戻す", exact: true }).click();
    await expect(input).toHaveValue("");
  });
});

for (const width of [375, 1280]) {
  test(`${width}pxの文字拡大・RTL・強制配色で候補を表示する`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/components/suggestion");
    const form = page.getByRole("form", { name: "記事の分類設定" });
    await page.getByText("初期値・候補なし・エラー・利用不可", { exact: true }).click();
    const input = page.getByRole("combobox", { name: "長い分類名", exact: true });
    const root = page.locator(".rx-suggestion").filter({ has: input });
    await input.click();
    await form.screenshot({ path: testInfo.outputPath(`suggestion-${width}.png`) });
    await page.evaluate(() => {
      document.documentElement.style.fontSize = "200%";
    });
    await form.evaluate((element) => element.setAttribute("dir", "rtl"));
    await input.press("ArrowDown");
    expect(
      await page
        .locator('[data-example="hono"]')
        .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
    ).toBe(true);
    const box = await root.getByRole("listbox").boundingBox();
    if (!box) throw new Error("候補一覧がありません");
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    await root.getByRole("listbox").scrollIntoViewIfNeeded();
    const inputBox = await root.boundingBox();
    const listBox = await root.getByRole("listbox").boundingBox();
    if (!inputBox || !listBox) throw new Error("入力欄と候補一覧がありません");
    const clip = {
      x: inputBox.x,
      y: inputBox.y,
      width: inputBox.width,
      height: listBox.y + listBox.height - inputBox.y,
    };
    await page.screenshot({ path: testInfo.outputPath(`suggestion-${width}-rtl-200.png`), clip });
    await page.emulateMedia({ forcedColors: "active" });
    await page.screenshot({ path: testInfo.outputPath(`suggestion-${width}-forced.png`), clip });
  });
}
