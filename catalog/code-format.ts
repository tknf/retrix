import { format } from "prettier";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import html from "shiki/langs/html.mjs";
import tsx from "shiki/langs/tsx.mjs";
import json from "shiki/langs/json.mjs";
import theme from "shiki/themes/github-light.mjs";
import type { CodeToken } from "../src/hono/code-block";

// カタログのサーバーだけで生成する。ブラウザと配布するコンポーネントへフォーマッターを含めない。
const highlighter = createHighlighterCore({
  themes: [theme],
  langs: [html, tsx, json],
  engine: createJavaScriptRegexEngine(),
});

export const highlightCode = async (code: string, language: "html" | "tsx" | "json") => {
  const { tokens } = (await highlighter).codeToTokens(code, {
    lang: language,
    theme: "github-light",
  });
  return tokens.flatMap((line, index): CodeToken[] => [
    ...(index ? [{ content: "\n" }] : []),
    ...line.map(({ content, color }) => ({ content, color })),
  ]);
};

export const formatExample = async (code: string, language: "html" | "tsx") => {
  const formatted = await format(code, {
    parser: language === "html" ? "html" : "typescript",
    htmlWhitespaceSensitivity: "css",
    printWidth: 88,
    tabWidth: 2,
  });
  return { code: formatted, tokens: await highlightCode(formatted, language) };
};
