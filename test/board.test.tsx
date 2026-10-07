import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { Board } from "../src/hono";

test("Boardの開閉ボタンは、controllerが接続するまで隠して描く", async () => {
  const markup = String(
    await html`${(
      <Board
        label="問い合わせ"
        columns={[
          { id: "todo", title: "これから", collapsible: true, items: [] },
          { id: "done", title: "完了", collapsible: true, collapsed: true, items: [] },
          { id: "fixed", title: "保留", items: [] },
        ]}
      />
    )}`,
  );
  const toggles = markup.match(/<button[^>]*data-board-toggle[^>]*>/g) ?? [];
  expect(toggles).toHaveLength(2);
  for (const toggle of toggles) expect(toggle).toMatch(/\shidden[\s>=]/);
  expect(markup).toContain('data-controller="board"');
});
