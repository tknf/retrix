import { expect, test } from "@playwright/test";

test("文字数controllerが入力数と上限超過を表示する", async ({ page }) => {
  await page.goto("/components/field");
  const input = page.getByRole("textbox", { name: "紹介文（文字数表示）", exact: true });
  const counter = page.locator(".rx-character-count");
  await input.fill("あ".repeat(41));
  await expect(counter).toHaveCSS("--character-count-value", "41");
  await expect(counter).toHaveAttribute("data-state", "over");
  await expect(page.getByText("文字数の上限を超えています。", { exact: true })).toBeVisible();
  await expect(input).toHaveAttribute(
    "aria-describedby",
    "hono-counted-description-count hono-counted-description-over-error",
  );
  await expect(input).toHaveAttribute("aria-invalid", "true");
  expect(
    await input.evaluate((field) => field instanceof HTMLTextAreaElement && field.checkValidity()),
  ).toBe(false);
  await input.fill("紹介文");
  await expect(counter).toHaveCSS("--character-count-value", "3");
  await expect(page.getByText("文字数の上限を超えています。", { exact: true })).toBeHidden();
  await expect(input).toHaveAttribute("aria-describedby", "hono-counted-description-count");
  await expect(input).not.toHaveAttribute("aria-invalid", "true");
  expect(
    await input.evaluate((field) => field instanceof HTMLTextAreaElement && field.checkValidity()),
  ).toBe(true);
});

test("パスワードcontrollerで表示と非表示を切り替える", async ({ page }) => {
  await page.goto("/components/field");
  const input = page.getByLabel("パスワード（表示切替）", { exact: true });
  await expect(input).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "パスワードを表示", exact: true }).click();
  await expect(input).toHaveAttribute("type", "text");
  await expect(input).toHaveValue("Retrix-demo-123");
  await page.getByRole("button", { name: "パスワードを隠す", exact: true }).click();
  await expect(input).toHaveAttribute("type", "password");
});

test("数値・日時controllerが境界状態とresetに追従する", async ({ page }) => {
  await page.goto("/components/field");
  const number = page.getByRole("spinbutton", { name: "部数", exact: true });
  await number.press("PageUp");
  await expect(number).toHaveValue("20");
  await expect(page.getByText("部数：20", { exact: true })).toBeVisible();
  await number.fill("100");
  await expect(number).toHaveAttribute("data-state", "max");
  const date = page.getByLabel("利用日", { exact: true });
  await date.fill("2026-01-01");
  await expect(date).toHaveAttribute("data-state", "min");
  const time = page.getByLabel("開始時刻", { exact: true });
  await time.fill("18:00");
  await expect(time).toHaveAttribute("data-state", "max");
  await page.getByRole("button", { name: "日時と部数を戻す", exact: true }).click();
  await expect(number).toHaveValue("10");
  await expect(date).toHaveValue("2026-09-11");
  await expect(time).toHaveValue("10:00");
  await expect(time).toHaveAttribute("data-state", "between");
});

test("候補選択controllerを矢印・Enter・Escapeで操作できる", async ({ page }) => {
  await page.goto("/components/field");
  const input = page.getByRole("combobox", { name: "担当部署（候補選択）", exact: true });
  await input.press("ArrowDown");
  await expect(page.getByRole("listbox", { name: "担当部署の候補", exact: true })).toBeVisible();
  await input.press("End");
  await input.press("Enter");
  await expect(input).toHaveValue("制作部");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await input.press("ArrowDown");
  await input.press("Escape");
  await expect(input).toHaveAttribute("aria-expanded", "false");
  await expect(input).toBeFocused();
});

test("閲覧専用の候補選択はキーと開閉操作で値を変えない", async ({ page }) => {
  await page.goto("/components/field");
  const input = page.getByRole("combobox", { name: "確定済みの担当部署", exact: true });
  await expect(input).not.toBeEditable();
  await expect(page.getByRole("button", { name: "候補を開閉", exact: true })).toBeDisabled();
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(input).toHaveValue("編集部");
  await expect(input).toHaveAttribute("aria-expanded", "false");
});

test.describe("タッチ操作", () => {
  test.use({ hasTouch: true, viewport: { width: 375, height: 812 } });

  test("入力欄と開閉ボタンから候補を開いてタップで選択できる", async ({ page }) => {
    await page.goto("/components/field");
    const input = page.getByRole("combobox", { name: "担当部署（候補選択）", exact: true });
    const toggle = page.getByRole("button", { name: "担当部署の候補を開閉", exact: true });
    const list = page.getByRole("listbox", { name: "担当部署の候補", exact: true });
    await toggle.tap();
    await expect(list).toBeVisible();
    const option = page.getByRole("option", { name: "営業部", exact: true });
    const bounds = await option.boundingBox();
    if (!bounds) throw new Error("候補が描画されていません");
    // Firefoxの矩形には0.00003px程度の浮動小数誤差がある。1pxの不足は許容しない。
    expect(Math.round(bounds.height * 1000) / 1000).toBeGreaterThanOrEqual(44);
    await option.tap();
    await expect(input).toHaveValue("営業部");
    await expect(list).toBeHidden();
    await input.tap();
    await expect(list).toBeVisible();
    await page.getByRole("option", { name: "編集部", exact: true }).tap();
    await expect(input).toHaveValue("編集部");
    await expect(list).toBeHidden();
    await toggle.tap();
    await expect(list).toBeVisible();
    await toggle.tap();
    await expect(list).toBeHidden();
  });
});

test("複数チェックの全選択・一部選択・解除とresetが同期する", async ({ page }) => {
  await page.goto("/components/field");
  // 見本には全選択を持つグループが二つあるので、「複数選択・全選択」のグループに絞る。
  const group = page.getByRole("group", { name: "複数選択・全選択", exact: true });
  const all = group.getByRole("checkbox", { name: "すべて選択", exact: true });
  const articles = group.getByRole("checkbox", { name: "新しい記事", exact: true });
  const comments = group.getByRole("checkbox", { name: "コメント", exact: true });
  await expect(all).toHaveJSProperty("indeterminate", true);
  await group.getByText("すべて選択", { exact: true }).click();
  await expect(all).toBeChecked();
  await expect(all).toHaveJSProperty("indeterminate", false);
  await expect(comments).toBeChecked();
  await expect(
    group.getByRole("checkbox", { name: "利用できない通知", exact: true }),
  ).not.toBeChecked();
  await all.press("Space");
  await expect(all).not.toBeChecked();
  await expect(articles).not.toBeChecked();
  await expect(comments).not.toBeChecked();
  await expect(
    group.getByRole("checkbox", { name: "常に受け取る通知", exact: true }),
  ).toBeChecked();
  await comments.check();
  await expect(all).toHaveJSProperty("indeterminate", true);
  await page.getByRole("button", { name: "選択を戻す", exact: true }).click();
  await expect(articles).toBeChecked();
  await expect(comments).not.toBeChecked();
  await expect(all).toHaveJSProperty("indeterminate", true);
});

test("複数チェックの変更を利用アプリで取り消せる", async ({ page }) => {
  await page.goto("/components/field");
  const group = page.getByRole("group", { name: "複数選択・全選択", exact: true });
  await group.evaluate((element) => {
    element.addEventListener("checkbox-group:beforechange", (event) => event.preventDefault());
  });
  await group.getByRole("checkbox", { name: "コメント", exact: true }).click();
  await expect(group.getByRole("checkbox", { name: "コメント", exact: true })).not.toBeChecked();
  await expect(group.getByRole("checkbox", { name: "すべて選択", exact: true })).toHaveJSProperty(
    "indeterminate",
    true,
  );
});

test("Fieldの補足・エラー・ラベルが入力に関連付く", async ({ page }) => {
  await page.goto("/components/field");
  const input = page.getByRole("textbox", { name: "名前", exact: true });
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAttribute("data-invalid", "true");
  await expect(input).toHaveAccessibleDescription("一覧に表示します。 名前を入力してください。");
  await expect(input).toHaveAttribute("required", "");
  // コンポーネントのページの表にも「名前」があるので、見本の中のラベルに絞る。
  await page.locator('[data-example="hono"]').getByText("名前", { exact: true }).click();
  await expect(input).toBeFocused();
  await input.fill("確認用の名前");
  await expect(input).toHaveValue("確認用の名前");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("名前を入力してください。", { exact: true })).toBeVisible();
});

test("閲覧専用はフォーカスできるが編集できずdisabledはTabで飛ばす", async ({ page }) => {
  await page.goto("/components/field");
  const readonly = page.getByRole("textbox", { name: "現在の名前", exact: true });
  const disabled = page.getByRole("textbox", { name: "利用できない入力", exact: true });
  await expect(readonly).not.toBeEditable();
  await expect(disabled).toBeDisabled();
  await readonly.focus();
  await expect(readonly).toBeFocused();
  await readonly.press("x");
  await expect(readonly).toHaveValue("現在の値");
  await readonly.press("Tab");
  await expect(page.getByRole("textbox", { name: "説明", exact: true })).toBeFocused();
});

test("TextareaとSelectをキーボードで編集できる", async ({ page }) => {
  await page.goto("/components/field");
  const textarea = page.getByRole("textbox", { name: "説明", exact: true });
  await textarea.fill("一行目\n二行目");
  await expect(textarea).toHaveValue("一行目\n二行目");
  await textarea.press("Tab");
  const select = page.getByRole("combobox", { name: "表示状態", exact: true });
  await expect(select).toBeFocused();
  await select.selectOption({ label: "非表示" });
  await expect(select).toHaveValue("非表示");
});

test("Textarea・Selectの状態表示とradioの無効化が保たれる", async ({ page }) => {
  await page.goto("/components/field");
  await page.getByText("入力・選択のほかの状態", { exact: true }).click();
  for (const [role, name, message] of [
    ["textbox", "説明（エラー）", "説明を入力してください。"],
    ["combobox", "表示状態（エラー）", "表示状態を選んでください。"],
  ] as const) {
    const control = page.getByRole(role, { name, exact: true });
    await expect(control).toHaveAttribute("aria-invalid", "true");
    await expect(control).toHaveAccessibleDescription(message);
    await control.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(control).toHaveCSS("outline-style", "solid");
  }
  const readonly = page.getByRole("textbox", { name: "説明（閲覧専用）", exact: true });
  await readonly.press("x");
  await expect(readonly).toHaveValue("公開済みの説明です。");
  await expect(page.getByRole("textbox", { name: "説明（利用不可）", exact: true })).toBeDisabled();
  await expect(
    page.getByRole("combobox", { name: "表示状態（利用不可）", exact: true }),
  ).toBeDisabled();
  const email = page.getByRole("radio", { name: "メール", exact: true });
  await email.focus();
  await email.press("ArrowDown");
  await expect(page.getByRole("radio", { name: "電話", exact: true })).toBeChecked();
  await expect(page.getByRole("radio", { name: "郵送（利用不可）", exact: true })).toBeDisabled();
  const locked = page.getByRole("radio", { name: "メール（固定）", exact: true });
  await expect(locked).toBeDisabled();
  await expect(locked).toBeChecked();
});

test("エラー・閲覧専用・disabledと長い補足が狭幅の文字拡大でも収まる", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.goto("/components/field");
  await page.evaluate(() => {
    document.documentElement.style.fontSize = "200%";
    const help = document.querySelector("#hono-error-help > span");
    if (help) help.textContent = "入力内容を確認してください。".repeat(12);
  });
  expect(
    await page
      .locator('[data-example="hono"]')
      .evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
  ).toBe(true);
  for (const name of ["名前", "現在の名前", "利用できない入力", "説明"]) {
    const input = page.getByRole("textbox", { name, exact: true });
    const bounds = await input.boundingBox();
    if (!bounds) throw new Error(`${name}が描画されていません`);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(375);
  }
  await expect(page.getByText("名前を入力してください。", { exact: true })).toBeVisible();
});

test("文字数の欄はcontrollerが接続してから数えた値で出す", async ({ page }) => {
  await page.goto("/components/field");
  const counter = page.locator("#hono-counted-description-count");
  await expect(counter).toBeVisible();
  const text = await counter.evaluate(
    (element) => `${getComputedStyle(element, "::before").content}${element.textContent}`,
  );
  expect(text).not.toContain("0 / 0");
});

test("候補を選ぶと欄で標準のinput・changeを出す", async ({ page }) => {
  await page.goto("/components/field");
  const input = page.getByRole("combobox", { name: "担当部署（候補選択）", exact: true });
  await expect(
    page.getByRole("button", { name: "担当部署の候補を開閉", exact: true }),
  ).toBeVisible();
  await input.evaluate((element) => {
    const events: string[] = [];
    (window as typeof window & { rxEvents?: string[] }).rxEvents = events;
    for (const type of ["input", "change", "combobox:change"])
      element
        .closest(".rx-combobox")
        ?.addEventListener(type, (event) =>
          events.push(`${event.type}:${event.target === element}`),
        );
  });
  await input.press("ArrowDown");
  await input.press("ArrowDown");
  await input.press("Enter");
  await expect(input).toHaveValue("営業部");
  expect(
    await page.evaluate(() => (window as typeof window & { rxEvents?: string[] }).rxEvents),
  ).toEqual(expect.arrayContaining(["combobox:change:false", "input:true", "change:true"]));
  // 同じ候補を選び直しても値は変わらないので、標準のイベントも出さない。
  await input.press("ArrowDown");
  await page.getByRole("option", { name: "営業部", exact: true }).click();
  await expect(input).toHaveValue("営業部");
  expect(
    await page.evaluate(() => (window as typeof window & { rxEvents?: string[] }).rxEvents),
  ).toHaveLength(3);
});

test("PageUp・PageDownで変えた数も標準のinput・changeを一度ずつ出す", async ({ page }) => {
  await page.goto("/components/field");
  const number = page.getByRole("spinbutton", { name: "部数", exact: true });
  await number.evaluate((element) => {
    const events: string[] = [];
    (window as typeof window & { rxEvents?: string[] }).rxEvents = events;
    for (const type of ["input", "change", "number-field:change"])
      element.addEventListener(type, (event) => events.push(event.type));
  });
  const recorded = async () => {
    const result: Record<string, number> = { input: 0, change: 0, "number-field:change": 0 };
    const events =
      (await page.evaluate(() => (window as typeof window & { rxEvents?: string[] }).rxEvents)) ??
      [];
    for (const type of events) result[type] = (result[type] ?? 0) + 1;
    return result;
  };
  await number.press("PageUp");
  await expect(number).toHaveValue("20");
  expect(await recorded()).toEqual({ input: 1, change: 1, "number-field:change": 1 });
  // 矢印キーはブラウザがinput・changeを出すので、重ねて出さない。
  await number.press("ArrowUp");
  await number.press("Tab");
  expect(await recorded()).toEqual({ input: 2, change: 2, "number-field:change": 2 });
  // 取り消した時は値が戻るので、標準のイベントを出さない。
  await number.evaluate((element) =>
    element.addEventListener("number-field:beforechange", (event) => event.preventDefault(), {
      once: true,
    }),
  );
  await number.focus();
  await number.press("PageDown");
  await expect(number).toHaveValue("21");
  expect(await recorded()).toEqual({ input: 2, change: 2, "number-field:change": 2 });
});

test("入力内の表示切替はhoverと文字拡大でも入力の枠内に収まる", async ({ page }) => {
  for (const id of ["field", "date-picker"]) {
    await page.goto("/components/" + id);
    const toggle = page.locator('[data-example="hono"] .toggle').first();
    await expect(toggle).toBeVisible();
    for (const size of ["100%", "200%"]) {
      await page.evaluate((value) => {
        document.documentElement.style.fontSize = value;
      }, size);
      await toggle.hover();
      const bounds = await toggle.evaluate((element) => {
        const input = element.parentElement?.querySelector("input");
        if (!input) throw new Error("入力がありません");
        const control = input.getBoundingClientRect(),
          button = element.getBoundingClientRect();
        return {
          insetTop: button.top - control.top,
          insetBottom: control.bottom - button.bottom,
          insetEnd: control.right - button.right,
        };
      });
      expect(bounds.insetTop).toBeGreaterThanOrEqual(0.75);
      expect(bounds.insetBottom).toBeGreaterThanOrEqual(0.75);
      expect(bounds.insetEnd).toBeGreaterThanOrEqual(0.75);
    }
  }
});

test("タッチ画面では入力の文字を16px以上にし、入力時の拡大を起こさない", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("/components/field");
  const inputSize = await page
    .locator(".rx-input")
    .first()
    .evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
  expect(inputSize).toBeGreaterThanOrEqual(16);
  await context.close();
});

test.describe("JavaScriptなし（文字数・候補選択）", () => {
  test.use({ javaScriptEnabled: false });
  test("文字数の欄と候補の開閉を出さず、欄は一行の入力になる", async ({ page }) => {
    await page.goto("/components/field");
    await expect(page.locator("#hono-counted-description-count")).toBeHidden();
    await expect(
      page.getByRole("textbox", { name: "担当部署（候補選択）", exact: true }),
    ).toBeEditable();
    await expect(
      page.getByRole("button", { name: "担当部署の候補を開閉", includeHidden: true }),
    ).toBeHidden();
  });
});
