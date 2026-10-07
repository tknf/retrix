import { expect, test, type Page } from "@playwright/test";

const file = (name: string, size = 1024) => ({
  name,
  mimeType: "application/pdf",
  buffer: Buffer.alloc(size),
});
const root = (page: Page, id = "hono-file") => page.locator(`.rx-file-input:has(> #${id})`);

test("複数ファイルの名前・サイズと送信内容が一致し選択を解除できる", async ({ page }) => {
  await page.goto("/components/file-input");
  const input = page.getByLabel("添付資料", { exact: true });
  const control = root(page);
  const longName = `${"長いファイル名".repeat(12)}.pdf`;
  await input.setInputFiles([file("案内.pdf"), file(longName, 0)]);
  await expect(control.getByRole("listitem")).toHaveCount(2);
  await expect(control.getByRole("listitem").first()).toHaveText("案内.pdf1 KB");
  await expect(control.getByRole("listitem").last()).toHaveText(`${longName}0 B`);
  const names = await input.evaluate((element) => {
    if (!(element instanceof HTMLInputElement) || !element.form)
      throw new Error("ファイルのフォームがありません");
    return new FormData(element.form)
      .getAll(element.name)
      .map((entry) => (entry instanceof File ? entry.name : entry));
  });
  expect(names).toEqual(["案内.pdf", longName]);
  await control.getByRole("button", { name: "選択を解除", exact: true }).click();
  await expect(control.getByRole("list")).toBeHidden();
  await expect(input).toBeFocused();
  expect(await input.evaluate((element: HTMLInputElement) => element.files?.length)).toBe(0);
});

test("リセットの取消しを保ち通常のリセットは選択と一覧を空にする", async ({ page }) => {
  await page.goto("/components/file-input");
  await page.getByLabel("添付資料", { exact: true }).setInputFiles(file("資料.pdf"));
  const form = page.getByRole("form", { name: "ファイルの添付例" });
  await form.evaluate((element) => {
    element.addEventListener("reset", (event) => event.preventDefault(), { once: true });
  });
  await form.getByRole("button", { name: "選択をリセット", exact: true }).click();
  await expect(root(page).getByRole("listitem")).toHaveCount(1);
  await form.getByRole("button", { name: "選択をリセット", exact: true }).click();
  await expect(root(page).getByRole("list")).toBeHidden();
});

test("ドロップは標準の変更通知を送り単一選択とdisabledを守る", async ({ page }) => {
  await page.goto("/components/file-input");
  const transfer = await page.evaluateHandle(() => {
    const data = new DataTransfer();
    data.items.add(new File(["sample"], "資料.pdf", { type: "application/pdf" }));
    return data;
  });
  const control = root(page);
  await control.evaluate((element) => {
    for (const type of ["input", "change"])
      element.addEventListener(type, () => {
        element.setAttribute("data-events", `${element.getAttribute("data-events") ?? ""}${type} `);
      });
  });
  await control.dispatchEvent("dragenter", { dataTransfer: transfer });
  await control.dispatchEvent("drop", { dataTransfer: transfer });
  await expect(control).toHaveAttribute("data-events", "input change ");
  await expect(control.getByRole("listitem")).toHaveText("資料.pdf6 B");

  await page.getByText("1ファイル・必須・エラー・利用不可", { exact: true }).click();
  const disabled = root(page, "hono-file-disabled-group");
  await disabled.dispatchEvent("dragenter", { dataTransfer: transfer });
  await disabled.dispatchEvent("drop", { dataTransfer: transfer });
  await expect(disabled).toHaveAttribute("data-state", "idle");
  expect(
    await disabled.locator("input").evaluate((element: HTMLInputElement) => element.files?.length),
  ).toBe(0);

  await transfer.evaluate((data) => data.items.add(new File(["second"], "別の資料.pdf")));
  const single = root(page, "hono-file-single");
  await single.dispatchEvent("dragenter", { dataTransfer: transfer });
  await single.dispatchEvent("drop", { dataTransfer: transfer });
  await expect(single).toHaveAttribute("data-state", "idle");
  await expect(single.getByRole("status")).toHaveText("一度に選択できるのは1ファイルです。");
  expect(
    await single.locator("input").evaluate((element: HTMLInputElement) => element.files?.length),
  ).toBe(0);
  await transfer.dispose();
});

test("acceptに当てはまらないファイルを含むドロップは受け付けずに通知する", async ({ page }) => {
  await page.goto("/components/file-input");
  const control = root(page);
  const input = control.locator("input[type=file]");
  const drop = async (files: { name: string; type: string }[]) => {
    const transfer = await page.evaluateHandle((entries) => {
      const data = new DataTransfer();
      for (const entry of entries)
        data.items.add(new File(["sample"], entry.name, { type: entry.type }));
      return data;
    }, files);
    await control.dispatchEvent("dragenter", { dataTransfer: transfer });
    await control.dispatchEvent("drop", { dataTransfer: transfer });
    await transfer.dispose();
  };

  await drop([
    { name: "資料.pdf", type: "application/pdf" },
    { name: "メモ.txt", type: "text/plain" },
  ]);
  await expect(control).toHaveAttribute("data-state", "idle");
  await expect(control.getByRole("status")).toHaveText(
    "選択できない形式のファイルが含まれています。",
  );
  expect(await input.evaluate((element: HTMLInputElement) => element.files?.length)).toBe(0);

  // 拡張子は大文字と小文字を区別せず、MIMEの無いファイルも拡張子で受け付ける。
  await drop([{ name: "資料.PDF", type: "" }]);
  await expect(control.getByRole("listitem")).toHaveText("資料.PDF6 B");
  await expect(control.getByRole("status")).toHaveText("1件のファイルを選択しました。");

  await page.getByText("1ファイル・必須・エラー・利用不可", { exact: true }).click();
  const image = root(page, "hono-file-single");
  const imageTransfer = await page.evaluateHandle(() => {
    const data = new DataTransfer();
    data.items.add(new File(["sample"], "表紙.png", { type: "image/png" }));
    return data;
  });
  await image.dispatchEvent("dragenter", { dataTransfer: imageTransfer });
  await image.dispatchEvent("drop", { dataTransfer: imageTransfer });
  await expect(image.getByRole("listitem")).toHaveText("表紙.png6 B");
  await imageTransfer.dispose();
});

test.describe("JavaScriptなし", () => {
  test.use({ javaScriptEnabled: false });

  test("標準入力で複数のファイルを選択できる", async ({ page }) => {
    await page.goto("/components/file-input");
    const input = page.getByLabel("添付資料", { exact: true });
    await expect(input).toBeVisible();
    await input.setInputFiles([file("資料1.pdf"), file("資料2.pdf")]);
    expect(await input.evaluate((element: HTMLInputElement) => element.files?.length)).toBe(2);
    await expect(root(page).getByRole("button", { name: "選択を解除", exact: true })).toBeHidden();
  });
});
