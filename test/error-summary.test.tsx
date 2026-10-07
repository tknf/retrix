import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { ErrorSummary } from "../src/hono";

test("ErrorSummaryはautofocusを渡すと、読み込んだ時にフォーカスを受け取れる形で描く", async () => {
  const markup = String(
    await html`${(
      <ErrorSummary autofocus errors={[{ label: "記事名を入力してください", href: "#title" }]} />
    )}`,
  );
  expect(markup).toMatch(/^<aside[^>]* autofocus[ >=]/);
  expect(markup).toContain('tabindex="-1"');
});
