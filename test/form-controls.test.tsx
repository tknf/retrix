import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { Combobox, CopyField, CountedTextarea, Input, OptionalFields, Range } from "../src/hono";

const render = async (node: unknown) => String(await html`${node}`);

test("CountedTextareaは数えるcontrollerが接続するまで文字数の欄を隠す", async () => {
  const markup = await render(<CountedTextarea id="bio" limit={40} />);
  expect(markup).toMatch(/<p class="count" id="bio-count"[^>]* hidden/);
  // 上限を超えた時のエラーはcontrollerが関連付けるので、最初は説明に含めない。
  expect(markup).not.toContain("aria-describedby");
});

test("Comboboxは接続するまで一行の入力として出し、開閉の矢印を隠す", async () => {
  const markup = await render(
    <Combobox id="team" aria-label="担当部署" options={[{ value: "編集部", label: "編集部" }]} />,
  );
  const input = markup.match(/<input[^>]*>/)?.[0] ?? "";
  expect(input).toContain('type="text"');
  expect(input).not.toContain('role="combobox"');
  expect(input).not.toContain("aria-expanded");
  expect(markup).toMatch(/<button[^>]*class="[^"]*toggle[^"]*"[^>]* hidden/);
  expect(markup).toMatch(/<ul class="options"[^>]* hidden/);
});

test("CopyFieldはコピーボタンを接続まで隠し、コピーできなかった時の文を隠して用意する", async () => {
  const markup = await render(<CopyField id="link" label="公開リンク" value="https://a.test" />);
  expect(markup).toMatch(/<button[^>]*data-copy-field-target="trigger"[^>]* hidden/);
  expect(markup).toMatch(
    /<p class="failure" data-copy-field-target="failure" hidden="">[\s\S]*コピーできませんでした。欄の値を選んでコピーしてください。/,
  );
  const custom = await render(
    <CopyField id="key" label="鍵" value="abc" failedLabel="コピーできませんでした。" />,
  );
  expect(custom).toContain("<span>コピーできませんでした。</span>");
});

test("Rangeの範囲指定は下限・上限の数の入力にunitを添えて説明にする", async () => {
  const markup = await render(
    <Range id="budget" label="予算" name="budget" min={0} max={100} value={[10, 50]} unit="円" />,
  );
  for (const bound of ["start", "end"]) {
    expect(markup).toContain(`<span class="affix" id="budget-${bound}-number-suffix">円</span>`);
    expect(markup).toMatch(
      new RegExp(
        `id="budget-${bound}-number"[^>]*aria-describedby="budget-${bound}-number-suffix"`,
      ),
    );
  }
  const plain = await render(<Range id="plain" label="予算" min={0} max={100} value={[10, 50]} />);
  expect(plain).not.toContain('class="affix"');
});

test("OptionalFieldsはJavaScriptが無くても全ての欄を出し、チップと削除する操作を隠す", async () => {
  const markup = await render(
    <OptionalFields
      label="予定に追加する項目"
      items={[
        { id: "place", label: "場所", open: true, field: <Input aria-label="場所" name="place" /> },
        { id: "note", label: "メモ", field: <Input aria-label="メモ" name="note" /> },
      ]}
    />,
  );
  for (const [id, open] of [
    ["place", "true"],
    ["note", "false"],
  ]) {
    const slot = markup.match(new RegExp(`<fieldset[^>]*id="${id}-slot"[^>]*>`))?.[0] ?? "";
    expect(slot).toContain(`data-open="${open}"`);
    expect(slot).not.toContain("hidden");
    expect(slot).not.toContain("disabled");
  }
  expect(markup).toMatch(/<button[^>]*aria-label="メモを削除"[^>]* hidden/);
  expect(markup).toMatch(
    /<button[^>]*aria-controls="note-slot"[^>]*aria-expanded="false"[^>]* hidden/,
  );
  expect(markup).toMatch(
    /<button[^>]*aria-controls="place-slot"[^>]*aria-expanded="true"[^>]* hidden/,
  );
});
