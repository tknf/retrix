import type { Child } from "hono/jsx";
import { classes, type ElementProps } from "./types";

export type SearchResult = {
  /** 結果の題名。リンクの文字にし、queryに一致した語を強調する。 */
  title: string;
  /** 題名のリンクの移動先。 */
  href: string;
  /** 本文の抜粋。文字で渡すと、queryに一致した語を強調する。 */
  excerpt?: Child;
  /** 置き場所・日付などの補足。 */
  meta?: Child;
  /** アバターや種類のアイコン。 */
  leading?: Child;
};
export type SearchResultsProps = ElementProps<"ol"> & {
  /** 結果の一覧の名前。olのaria-labelに入れる。 */
  label: string;
  /** 一致した語。題名と文字の抜粋の中で強調する。 */
  query?: string;
  /** 並べる結果。並び順は利用側で決める。 */
  results: readonly SearchResult[];
};

/**
 * 一文字ずつ小文字にし、小文字の各位置が元の文字のどこから始まりどこで終わるかを残す。
 * 「İ」のように小文字で長さが変わる文字があっても、見つけた位置を元の文字へ戻せるようにする。
 */
const fold = (text: string) => {
  let lower = "";
  const starts: number[] = [];
  const ends: number[] = [];
  let index = 0;
  for (const char of text) {
    const folded = char.toLocaleLowerCase();
    for (let unit = 0; unit < folded.length; unit++) {
      starts.push(index);
      ends.push(index + char.length);
    }
    lower += folded;
    index += char.length;
  }
  return { lower, starts, ends };
};

/** 文字を一致した語の前後で分け、一致した部分をmarkで包む（大文字と小文字は区別しない）。 */
const highlight = (text: string, query?: string): Child => {
  const needle = query?.trim();
  if (!needle) return text;
  const { lower, starts, ends } = fold(text);
  const target = fold(needle).lower;
  const parts: Child[] = [];
  let from = 0;
  for (let at = lower.indexOf(target); at !== -1; at = lower.indexOf(target, at + 1)) {
    const last = at + target.length - 1;
    const start = starts[at],
      end = ends[last];
    // 一文字を小文字にした途中から始まる・途中で終わる一致は、元の文字で切れないので使わない。
    if (
      start === undefined ||
      end === undefined ||
      start < from ||
      (at > 0 && starts[at - 1] === start) ||
      (last + 1 < lower.length && starts[last + 1] === starts[last])
    )
      continue;
    if (start > from) parts.push(text.slice(from, start));
    parts.push(<mark>{text.slice(start, end)}</mark>);
    from = end;
  }
  parts.push(text.slice(from));
  return <>{parts}</>;
};

/**
 * 題名・抜粋・補足を並べ、一致した語を淡い黄の背景で強調する。
 * 条件を追加する列はOptionalFieldsのstackで、ページの側に置く。
 */
export const SearchResults = ({
  label,
  query,
  results,
  class: className,
  ...attributes
}: SearchResultsProps) => (
  <ol {...attributes} class={classes("rx-search-results", className)} aria-label={label}>
    {results.map((result) => (
      <li data-leading={result.leading != null ? "true" : undefined}>
        {result.leading != null && <span class="leading">{result.leading}</span>}
        <a class="title" href={result.href}>
          {highlight(result.title, query)}
        </a>
        {result.excerpt != null && result.excerpt !== false && (
          <p class="excerpt">
            {typeof result.excerpt === "string" ? highlight(result.excerpt, query) : result.excerpt}
          </p>
        )}
        {result.meta != null && result.meta !== false && <p class="meta">{result.meta}</p>}
      </li>
    ))}
  </ol>
);
