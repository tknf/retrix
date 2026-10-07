import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { Button, Table } from "../src/hono";

test("Tableの選択バーは表の後に置き、JavaScriptがなくても見えるようpopoverにしない", async () => {
  const markup = String(
    await html`${(
      <Table caption="記事" selectable selectionActions={<Button type="submit">送る</Button>}>
        <tbody>
          <tr>
            <td>記事</td>
          </tr>
        </tbody>
      </Table>
    )}`,
  );
  const bar = markup.match(/<div class="selection-bar"[^>]*>/)?.[0] ?? "";
  expect(bar).toContain('role="group"');
  expect(bar).not.toContain("popover");
  expect(markup.indexOf("</table>")).toBeLessThan(markup.indexOf('class="selection-bar"'));
  expect(markup).toContain('data-controller="table"');
});
