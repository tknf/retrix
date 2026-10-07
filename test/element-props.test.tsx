import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { Button, ChartFrame, Tag } from "../src/hono";

test("Tagは三つの形のどれでもclassとidなどのHTML属性をルートに渡す", async () => {
  const plain = String(await html`${<Tag label="暮らし" id="plain" class="extra" />}`);
  expect(plain).toContain('<span id="plain" class="rx-tag extra"');
  const link = String(
    await html`${<Tag label="暮らし" href="/tags/life" id="link" class="extra" rel="tag" />}`,
  );
  expect(link).toMatch(/<a id="link" rel="tag" class="rx-tag extra"[^>]*href="\/tags\/life"/);
  const removable = String(
    await html`${(
      <Tag
        label="暮らし"
        id="removable"
        data-value="life"
        removeButton={<Button aria-label="暮らしを解除" />}
      />
    )}`,
  );
  expect(removable).toContain('<span id="removable" data-value="life" class="rx-tag removable"');
});

test("ChartFrameはclassとidなどのHTML属性をfigureに渡しルートのクラスを保つ", async () => {
  const markup = String(
    await html`${(
      <ChartFrame
        id="sales"
        class="extra"
        aria-describedby="note"
        title="売上"
        graphic={<svg />}
        table={<table />}
        tableLabel="数値の表"
      />
    )}`,
  );
  expect(markup).toMatch(
    /^<figure id="sales" aria-describedby="note" class="rx-chart-frame extra"/,
  );
  expect(markup).not.toContain('title="売上"');
});
