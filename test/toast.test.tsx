import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { Toast } from "../src/hono";

test("Toastの閉じるボタンは自分を指すpopovertargetで、JavaScriptなしでも閉じられる", async () => {
  const markup = String(await html`${<Toast id="saved">保存しました</Toast>}`);
  expect(markup).toContain('popover="manual"');
  expect(markup).toMatch(
    /<button[^>]*popovertarget="saved"[^>]*popovertargetaction="hide"[^>]*aria-label="閉じる"/,
  );
  expect(markup).not.toContain('data-toast-target="dismiss"');
});
