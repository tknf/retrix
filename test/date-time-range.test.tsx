import { Hono } from "hono";
import { html } from "hono/html";
import type { Child } from "hono/jsx";
import { expect, test } from "vite-plus/test";
import { DateTimeRange } from "../src/hono";

const render = async (content: Child) => {
  const app = new Hono().get("/", (c) => c.html(html`${content}`));
  return (await app.request("/")).text();
};

test("開始と終了の小さな名前に、どこからも参照しないIDを付けない", async () => {
  const result = await render(<DateTimeRange legend="日時" name="event" />);
  expect(result).toContain('<span class="caption">開始</span>');
  expect(result).toContain('<span class="caption">終了</span>');
  expect(result).not.toContain('id="event-start"');
  expect(result).not.toContain('id="event-end"');
});

test("終日の時も時刻の欄を同じ名前で送信する", async () => {
  const result = await render(
    <DateTimeRange legend="日時" name="event" start={{ time: "09:00" }} allDay />,
  );
  expect(result).toMatch(/<input[^>]*name="event\[start_time\]"[^>]*value="09:00"/);
  expect(result).not.toMatch(/<input[^>]*name="event\[start_time\]"[^>]*disabled/);
});
