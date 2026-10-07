import { CodeBlock, Disclosure, DisclosureGroup } from "../../src/hono";
import { codeToTokens } from "shiki";

type Language = "html" | "json" | "ts" | "css" | "shell";

const highlight = async (code: string, lang: Language) => {
  const { tokens } = await codeToTokens(code, { lang, theme: "github-light" });
  return tokens.flatMap((line, index) => [...(index ? [{ content: "\n" }] : []), ...line]);
};

export default async () => {
  const markup = '<link rel="stylesheet" href="/retrix/components/button.css">';
  const settings =
    '{\n  "title": "秋の読書会",\n  "published": false,\n  "path": "/articles/abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789"\n}';
  const controller = [
    'import { Application } from "@hotwired/stimulus";',
    'import { BoardController } from "@tknf/retrix/controllers";',
    "",
    "const application = Application.start();",
    'application.register("board", BoardController);',
    "",
    "// 列を移ったら、サーバーへ新しい並びを送る。",
    'document.addEventListener("board:move", async (event) => {',
    "  const { id, toColumn, toIndex } = event.detail;",
    '  await fetch(`/cards/${id}`, { method: "PATCH", body: JSON.stringify({ toColumn, toIndex }) });',
    "});",
  ].join("\n");
  const styles = Array.from(
    { length: 30 },
    (_, index) =>
      `.note-${index + 1} {\n  margin-block-start: var(--rx-space-${(index % 6) + 1});\n}`,
  ).join("\n");
  const command = "vp add retrix\nvp run build";
  const [htmlTokens, jsonTokens, tsTokens, cssTokens, shellTokens] = await Promise.all([
    highlight(markup, "html"),
    highlight(settings, "json"),
    highlight(controller, "ts"),
    highlight(styles, "css"),
    highlight(command, "shell"),
  ]);
  return (
    <div class="rx-stack">
      <CodeBlock label="CSSの読み込み" code={markup} tokens={htmlTokens} copy />
      <CodeBlock
        label="公開設定の例"
        code={settings}
        tokens={jsonTokens}
        copy
        lineNumbers
        highlight={[4]}
      />
      <DisclosureGroup label="中身と置き場所の違い">
        <Disclosure summary="コマンド：短い数行" open>
          <CodeBlock label="インストール" code={command} tokens={shellTokens} copy />
        </Disclosure>
        <Disclosure summary="行番号と強調した行">
          <CodeBlock
            label="controllers.ts"
            code={controller}
            tokens={tsTokens}
            copy
            lineNumbers
            highlight={[8, 9, 10]}
          />
        </Disclosure>
        <Disclosure summary="長いコード：高さを決めて縦にスクロールする">
          <CodeBlock label="notes.css" code={styles} tokens={cssTokens} lineNumbers />
        </Disclosure>
        <Disclosure summary="着色しないコード：そのまま文字として表示する">
          <CodeBlock
            label="コードはそのまま文字として表示します"
            code={'<script>alert("実行されません")</script>'}
          />
        </Disclosure>
        <Disclosure summary="狭い場所">
          <div style="max-inline-size: 20rem">
            <CodeBlock label="CSSの読み込み" code={markup} tokens={htmlTokens} copy lineNumbers />
          </div>
        </Disclosure>
        <Disclosure summary="右から左に読むページ">
          <CodeBlock
            dir="rtl"
            lang="ar"
            label="الإعدادات"
            code={settings}
            tokens={jsonTokens}
            lineNumbers
          />
        </Disclosure>
      </DisclosureGroup>
    </div>
  );
};
