import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import BadgeExample from "../catalog/hono-examples/badge";

test("Badgeの見本は、役割の無いspanにaria-labelで名前を付けない", async () => {
  const markup = String(await html`${<BadgeExample />}`);
  expect(markup).toContain("今月の予約");
  expect(markup).not.toMatch(/class="rx-badge"[^>]*aria-label/);
  expect(markup).not.toMatch(/aria-label="[^"]*"[^>]*class="rx-badge"/);
});
