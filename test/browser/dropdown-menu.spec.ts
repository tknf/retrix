import { expect, test } from "@playwright/test";

// ブラウザ実行が許可されたときに、3エンジンで操作と表示領域を検証する。
test.beforeEach(async ({ page }) => {
  await page.goto("/components/dropdown-menu");
});

test("Endで末尾へ移りEnterで選んだ値をdropdown-menu:selectで渡し、操作へ戻る", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator('[data-example="hono"]').evaluate((element) => {
    element.addEventListener("dropdown-menu:select", (event) => {
      if (
        event instanceof CustomEvent &&
        typeof event.detail === "object" &&
        event.detail !== null &&
        "value" in event.detail &&
        typeof event.detail.value === "string"
      ) {
        element.setAttribute("data-selected", event.detail.value);
      }
    });
  });
  await page.getByRole("button", { name: "項目の操作", exact: true }).click();
  await page.keyboard.press("End");
  await expect(page.getByRole("menuitem", { name: "複製する", exact: true })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-example="hono"]')).toHaveAttribute("data-selected", "copy");
  await expect(page.getByRole("button", { name: "項目の操作", exact: true })).toBeFocused();
});

test("主操作とDropdownを接続しメニューを開ける", async ({ page }) => {
  await page
    .getByText("トリガーのサイズ・アイコンのみ・主要操作との組み合わせ", { exact: true })
    .click();
  const group = page.getByRole("group", { name: "公開操作", exact: true });
  const primary = group.getByRole("button", { name: "公開する", exact: true });
  const trigger = group.getByRole("button", { name: "公開方法を選ぶ", exact: true });
  const left = await primary.boundingBox(),
    right = await trigger.boundingBox();
  if (!left || !right) throw new Error("接続ボタンがありません");
  expect(right.x - left.x - left.width).toBeCloseTo(-1, 1);
  expect(right.y).toBeCloseTo(left.y, 1);
  await trigger.click();
  await expect(
    page.getByRole("menuitem", { name: "日時を指定して公開", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("多段メニューを左右矢印で往復しEscapeで元の操作へ戻る", async ({ page }) => {
  await page.getByText("サブメニュー・多段の階層・無効なサブメニュー", { exact: true }).click();
  const trigger = page.getByRole("button", { name: "書き出しと共有", exact: true });
  await trigger.click();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("menuitem", { name: "PDF", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("menuitem", { name: "PNG", exact: true })).toBeFocused();
  await page.keyboard.press("End");
  await expect(page.getByRole("menuitem", { name: "JPEG", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("menuitem", { name: "画像", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menuitem", { name: "書き出す", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("チェックと一部選択は更新後も開き単一選択は同じグループだけを切り替える", async ({ page }) => {
  await page.getByText("複数選択・一部選択・単一選択", { exact: true }).click();
  const trigger = page.getByRole("button", { name: "表示設定", exact: true });
  await trigger.click();
  const assignee = page.getByRole("menuitemcheckbox", { name: "担当者", exact: true });
  await assignee.click();
  await expect(assignee).toHaveAttribute("aria-checked", "false");
  const mixed = page.getByRole("menuitemcheckbox", { name: "通知", exact: true });
  await expect(mixed).toHaveAttribute("aria-checked", "mixed");
  await mixed.click();
  await expect(mixed).toHaveAttribute("aria-checked", "true");
  await page.getByRole("menuitemradio", { name: "名前順", exact: true }).click();
  await expect(
    page.getByRole("menuitemradio", { name: "更新が新しい順", exact: true }),
  ).toHaveAttribute("aria-checked", "false");
  await expect(page.getByRole("menuitemradio", { name: "名前順", exact: true })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await expect(mixed).toHaveAttribute("aria-checked", "true");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await trigger.click();
  await expect(mixed).toHaveAttribute("aria-checked", "true");
});

test("サブメニューはマウスでも開き兄弟項目へ移ると閉じる", async ({ page }) => {
  await page.getByText("サブメニュー・多段の階層・無効なサブメニュー", { exact: true }).click();
  await page.getByRole("button", { name: "書き出しと共有", exact: true }).click();
  const submenu = page.getByRole("menuitem", { name: "書き出す", exact: true });
  await submenu.hover();
  await expect(page.getByRole("menuitem", { name: "PDF", exact: true })).toBeVisible();
  await page.getByRole("menuitem", { name: "共有する", exact: true }).hover();
  await expect(submenu).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("menuitem", { name: "リンクをコピー", exact: true })).toBeVisible();
});

test("空と全項目無効でもEscapeとTabで抜けられる", async ({ page }) => {
  await page.getByText("無効・処理中・空・全項目が無効", { exact: true }).click();
  const empty = page.getByRole("button", { name: "操作がない場合", exact: true });
  await empty.click();
  await expect(page.getByRole("menu", { name: "操作がない場合", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(empty).toBeFocused();
  const disabled = page.getByRole("button", { name: "権限がない場合", exact: true });
  await disabled.click();
  await expect(page.getByRole("menu", { name: "権限がない場合", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(disabled).toHaveAttribute("aria-expanded", "false");
  await expect(empty).toBeFocused();
});

test("選択の取消と開いたままの操作は状態を保つ", async ({ page }) => {
  await page.getByText("選択後も開く操作・選択後に閉じるチェック", { exact: true }).click();
  const trigger = page.getByRole("button", { name: "選択後の動作", exact: true });
  await trigger.click();
  await page.getByRole("menuitem", { name: "リンクをコピー", exact: true }).click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.locator("#menu-stay").evaluate((panel) => {
    panel.parentElement?.addEventListener(
      "dropdown-menu:beforeselect",
      (event) => event.preventDefault(),
      { once: true },
    );
  });
  const checkbox = page.getByRole("menuitemcheckbox", { name: "通知を受け取る", exact: true });
  await checkbox.click();
  await expect(checkbox).toHaveAttribute("aria-checked", "false");
  await checkbox.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(checkbox).toHaveAttribute("aria-checked", "true");
});

test("右端と狭い画面でも親子メニューが画面内に収まる", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.getByText("右寄せ・右から左・長文・スクロール", { exact: true }).click();
  await page.getByRole("button", { name: "右端の操作", exact: true }).click();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("menu")).toHaveCount(2);
  for (const menu of await page.getByRole("menu").all()) {
    // 開く動きは少し行き過ぎてから戻るので、途中の拡大した状態で測らないよう、動きの終わりを待つ。
    await menu.evaluate((element) =>
      Promise.all(element.getAnimations().map((animation) => animation.finished)),
    );
    const box = await menu.boundingBox();
    expect(box).not.toBeNull();
    if (box) {
      expect(box.x).toBeGreaterThanOrEqual(7);
      expect(box.x + box.width).toBeLessThanOrEqual(368);
      expect(box.y).toBeGreaterThanOrEqual(7);
      expect(box.y + box.height).toBeLessThanOrEqual(693);
    }
  }
});

test("右から左では左矢印で入り右矢印で戻る", async ({ page }) => {
  await page.getByText("右寄せ・右から左・長文・スクロール", { exact: true }).click();
  await page.getByRole("button", { name: "右から左の操作", exact: true }).click();
  await page.keyboard.press("ArrowLeft");
  await expect(page.getByRole("menuitem", { name: "PDF", exact: true })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("menuitem", { name: "書き出す", exact: true })).toBeFocused();
});

test("大量項目の末尾へ移動でき外側を押すと閉じる", async ({ page }) => {
  await page.getByText("右寄せ・右から左・長文・スクロール", { exact: true }).click();
  const trigger = page.getByRole("button", { name: "大量の項目", exact: true });
  await trigger.click();
  await page.keyboard.press("End");
  await expect(page.getByRole("menuitem", { name: "保存先 30", exact: true })).toBeFocused();
  await expect(page.getByRole("menuitem", { name: "保存先 30", exact: true })).toBeInViewport();
  await page.mouse.click(2, 2);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("外側のクリックは閉じるだけに使い背後の操作を実行しない", async ({ page }) => {
  await page.evaluate(() => {
    const button = document.createElement("button");
    button.id = "outside-action";
    button.textContent = "背後の操作";
    button.style.cssText = "position:fixed;inset-block-end:8px;inset-inline-end:8px";
    button.addEventListener("click", () => {
      button.dataset.executed = "true";
    });
    for (const name of ["pointerdown", "mousedown", "pointerup", "mouseup"]) {
      button.addEventListener(name, () => {
        button.dataset.pressed = "true";
      });
    }
    document.body.append(button);
  });
  const outside = page.locator("#outside-action");
  const trigger = page.getByRole("button", { name: "項目の操作", exact: true });
  await trigger.click();
  const bounds = await outside.boundingBox();
  expect(bounds).not.toBeNull();
  if (!bounds) return;
  const shield = page.locator(".shield:popover-open");
  await expect(shield).toBeVisible();
  const hitsShield = await page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y)?.classList.contains("shield"),
    { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 },
  );
  expect(hitsShield).toBe(true);
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(outside).not.toHaveAttribute("data-executed", "true");
  await expect(outside).not.toHaveAttribute("data-pressed", "true");
  await expect(trigger).toBeFocused();
  await expect(shield).toHaveCount(0);
  await outside.click();
  await expect(outside).toHaveAttribute("data-executed", "true");
});
