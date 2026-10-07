import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { SearchResults } from "../src/hono";

const marks = async (title: string, query: string) =>
  [
    ...String(
      await html`${<SearchResults label="結果" query={query} results={[{ title, href: "/" }]} />}`,
    ).matchAll(/<mark>(.*?)<\/mark>/g),
  ].map((match) => match[1]);

test("SearchResultsは小文字で長さが変わる文字の後ろでも、一致した語だけを強調する", async () => {
  // 「İ」は小文字にすると2文字分（i + 結合点）になる。
  expect(await marks("İstanbul Guide", "guide")).toEqual(["Guide"]);
  expect(await marks("İİİ Plan plan", "PLAN")).toEqual(["Plan", "plan"]);
  expect(await marks("İstanbul", "i̇stanbul")).toEqual(["İstanbul"]);
});

test("SearchResultsは大文字と小文字を区別せず、重ならない一致を全て強調する", async () => {
  expect(await marks("Retrix retrix RETRIX", " retrix ")).toEqual(["Retrix", "retrix", "RETRIX"]);
  expect(await marks("aaa", "aa")).toEqual(["aa"]);
  expect(await marks("招待の案内", "招待")).toEqual(["招待"]);
});
