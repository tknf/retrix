import { html } from "hono/html";
import { expect, test } from "vite-plus/test";
import { Table, tableWidthsCookieName } from "../src/hono";
import { parseTableWidths, serializeTableWidths } from "../src/internal/table-widths";

const render = async (node: unknown) => String(await html`${node}`);

const table = (props: { savedColumnWidths?: string; storageKey?: string }) => (
  <Table caption="取引先" resizable {...props}>
    <thead>
      <tr>
        <th scope="col">コード</th>
        <th scope="col">名前</th>
        <th scope="col">メモ</th>
      </tr>
    </thead>
  </Table>
);

test("列の幅の保存値は数と空欄を読み、範囲の外と数でない値を幅なしとして扱う", () => {
  expect(parseTableWidths("120,,96")).toEqual([120, null, 96]);
  expect(parseTableWidths("10,abc,99999")).toEqual([null, null, null]);
  expect(parseTableWidths(undefined)).toEqual([]);
  expect(serializeTableWidths([120.4, null, 96])).toBe("120,,96");
  expect(tableWidthsCookieName("取引先 一覧")).toBe(
    `rx-table-widths-${encodeURIComponent("取引先 一覧")}`,
  );
});

test("resizableはtable-resizeを登録し、保存した幅があれば初回の描画から列の幅を固定する", async () => {
  const plain = await render(table({ storageKey: "customers" }));
  expect(plain).toContain('data-controller="table-resize"');
  expect(plain).toContain('data-table-resize-storage-key-value="customers"');
  expect(plain).not.toContain("<colgroup");

  const saved = await render(table({ storageKey: "customers", savedColumnWidths: "96,240," }));
  expect(saved).toContain('data-resized="true"');
  expect(saved).toContain('style="inline-size: max(100%, 464px)"');
  expect(saved).toContain('<col style="inline-size: 96px"/>');
  expect(saved).toContain('<col style="inline-size: 240px"/>');
});

test("storageKeyが無い時は保存した幅を読まない", async () => {
  const output = await render(table({ savedColumnWidths: "96,240," }));
  expect(output).not.toContain("<colgroup");
});
