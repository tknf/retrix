import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { TaskList, Timeline } from "../src/hono";

test("Timelineの日の区切りは、olの子のliから一覧の行の役割を外さない", async () => {
  const markup = String(
    await html`${(
      <Timeline
        label="対応の記録"
        items={[
          { datetime: "2026-09-14T09:00", time: "9:00", title: "受け付けました", day: "今日" },
        ]}
      />
    )}`,
  );
  expect(markup).toContain('<li class="day">');
  expect(markup).not.toContain('role="none"');
});

test("TaskListの一覧の名前の行は、ulの子のliから一覧の行の役割を外さない", async () => {
  const markup = String(
    await html`${(
      <TaskList
        label="公開前の確認"
        title="公開前"
        items={[{ name: "a", label: "題名を確かめる" }]}
      />
    )}`,
  );
  expect(markup).toContain('<li class="heading">');
  expect(markup).not.toContain('role="none"');
});
