import { html } from "hono/html";
import { expect, test } from "vite-plus/test";
import { AppShell } from "../src/hono";

const render = async (node: unknown) => String(await html`${node}`);

test("AppShellはsizeを作業面の幅としてdata-sizeに出し、省略時はdefaultにする", async () => {
  const plain = await render(
    <AppShell commands={<a href="/">移動</a>}>
      <p>作業面</p>
    </AppShell>,
  );
  expect(plain).toContain('data-size="default"');
  const wide = await render(
    <AppShell commands={<a href="/">移動</a>} size="wide">
      <p>作業面</p>
    </AppShell>,
  );
  expect(wide).toContain('data-size="wide"');
});
