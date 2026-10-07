import { expect, test } from "@playwright/test";

test("Reactionsは付け外しの前にreactions:beforetoggleを出し、取り消すとリアクションを変えない", async ({
  page,
}) => {
  await page.goto("/components/reactions");
  const reactions = page.locator('[data-example="hono"] .rx-reactions').first();
  await reactions.evaluate((element) => {
    const log: string[] = [];
    for (const name of ["reactions:beforetoggle", "reactions:toggle"])
      element.addEventListener(name, (event) => {
        if (!(event instanceof CustomEvent)) return;
        const detail: unknown = event.detail;
        if (!detail || typeof detail !== "object") return;
        const read = (key: string) => (key in detail ? String(Reflect.get(detail, key)) : "");
        log.push(`${name}:${read("content")}:${read("name")}:${read("selected")}`);
        element.setAttribute("data-log", log.join(","));
        if (name === "reactions:beforetoggle" && element.hasAttribute("data-block"))
          event.preventDefault();
      });
  });
  const rocket = reactions.getByRole("button", { name: "ロケット：田中 遥", exact: true });
  await reactions.evaluate((element) => element.setAttribute("data-block", ""));
  await rocket.click();
  await expect(rocket).toHaveAttribute("aria-pressed", "false");
  await expect(rocket).toHaveText(/1/);
  await expect(reactions).toHaveAttribute("data-log", "reactions:beforetoggle:🚀:ロケット:true");
  await reactions.evaluate((element) => element.removeAttribute("data-block"));
  await rocket.click();
  const pressed = reactions.getByRole("button", { name: "ロケット：田中 遥、自分", exact: true });
  await expect(pressed).toHaveAttribute("aria-pressed", "true");
  await expect(reactions).toHaveAttribute(
    "data-log",
    [
      "reactions:beforetoggle:🚀:ロケット:true",
      "reactions:beforetoggle:🚀:ロケット:true",
      "reactions:toggle:🚀:ロケット:true",
    ].join(","),
  );
});
