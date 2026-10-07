import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { CodeBlock } from "../src/hono/code-block";
import { formatExample } from "../catalog/code-format";

test("整形は文中の空白とpre内の改行を保ち、着色した文字を欠落させない", async () => {
  const code =
    '<section><p>前<span>中</span>後 <a href="/">次</a></p><pre> a\n  b</pre><input aria-label="入力" value="a &amp; b"></section>';
  const result = await formatExample(code, "html");
  expect(result.code).toContain("前<span>中</span>後 ");
  // HTMLパーサーはpre開始タグ直後の最初の改行を読み飛ばす。
  expect(result.code.match(/<pre>([\s\S]*?)<\/pre>/)?.[1]?.replace(/^\n/, "")).toBe(" a\n  b");
  expect(result.code).toContain('value="a &amp; b"');
  expect(result.code.split("\n").length).toBeGreaterThan(3);
  expect(result.tokens.map((token) => token.content).join("")).toBe(result.code);
});

test("着色したHTMLも文字として表示し、異なるコードのトークンは採用しない", async () => {
  const code = '<script>alert("例")</script>';
  const colored =
    await html`${<CodeBlock label="HTML" code={code} tokens={[{ content: code, color: "#123456" }]} copy />}`;
  expect(String(colored)).toContain("&lt;script&gt;");
  expect(String(colored)).not.toContain("<script>");
  const mismatch =
    await html`${<CodeBlock label="HTML" code={code} tokens={[{ content: "別のコード", color: "red" }]} />}`;
  expect(String(mismatch)).not.toContain("別のコード");
  expect(String(mismatch)).toContain("&lt;script&gt;");
});

test("行ごとに分けても文字は元のコードと同じで、行番号を文字に含めず強調する行にマークを付ける", async () => {
  const code = "const a = 1;\n\nconst b = 2;";
  const tokens = [
    { content: "const", color: "#d73a49" },
    { content: " a = 1;\n\n" },
    { content: "const", color: "#d73a49" },
    { content: " b = 2;" },
  ];
  const markup = String(
    await html`${<CodeBlock label="例" code={code} tokens={tokens} lineNumbers highlight={[3]} />}`,
  );
  const text = markup
    .match(/<code[^>]*>([\s\S]*)<\/code>/)?.[1]
    ?.replace(/<[^>]+>/g, "")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
  expect(text).toBe(code);
  expect(markup.match(/class="line"/g)).toHaveLength(3);
  expect(markup.match(/data-highlighted="true"/g)).toHaveLength(1);
  expect(markup).toContain('data-line-numbers="true"');
});

test("コピーの結果は成功をstatus、失敗を危険の色のalertとして別の通知に出す", async () => {
  const markup = String(await html`${<CodeBlock label="例" code="a" copy />}`);
  const toasts = markup.match(/<aside[^>]*class="rx-toast[^"]*"[^>]*>/g) ?? [];
  expect(toasts).toHaveLength(2);
  const [done, failed] = toasts;
  expect(done).toContain('data-tone="success"');
  expect(done).toContain('role="status"');
  expect(done).toContain('aria-live="polite"');
  expect(failed).toContain('data-tone="danger"');
  expect(failed).toContain('role="alert"');
  expect(failed).toContain('aria-live="assertive"');
  expect(markup).toContain("#rx-x-circle-fill");
  expect(String(await html`${<CodeBlock label="例" code="a" />}`)).not.toContain("rx-toast");
});
