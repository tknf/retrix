import type { Child } from "hono/jsx";

export type TableOfContentsSection = {
  /** 見出しのid。目次のページ内リンクの行き先になる。空白を含めず、ページ内で一意にする。 */
  id: string;
  /** 見出しの文言。目次の項目と本文の見出しの両方に出す。 */
  title: string;
  /**
   * 見出しの段。2は章（h2）、3は小見出し（h3）で、目次では「1.1」のように一段下げる。
   * 前に章が一つもない3は章として扱う。
   */
  level?: 2 | 3;
  /** 見出しの下に置く本文。 */
  content: Child;
};

export type TableOfContentsProps = {
  /** 目次の見出しと、navの読み上げ名。 */
  label: string;
  /** 目次と本文に並べる節。書いた順に番号を振る。 */
  sections: readonly TableOfContentsSection[];
  /**
   * 現在地を判定する位置。画面の上端からの距離（px）で、この位置を越えた最後の見出しを現在地にする。
   * 固定したバーで見出しが隠れる時は、その高さに合わせる。0未満や数でない値は既定に戻す。
   */
  offset?: number;
};

/** 長い資料の見出しとページ内リンクを一緒に描画する。 */
export const TableOfContents = ({ label, sections, offset = 80 }: TableOfContentsProps) => {
  let chapter = 0;
  let subsection = 0;
  const links = sections.map((section) => {
    const level = section.level === 3 && chapter > 0 ? 3 : 2;
    if (level === 3) {
      subsection += 1;
      return { section, level, number: `${chapter}.${subsection}` };
    }
    chapter += 1;
    subsection = 0;
    return { section, level, number: String(chapter) };
  });
  return (
    <div
      class="rx-table-of-contents"
      data-controller="table-of-contents"
      data-table-of-contents-offset-value={Number.isFinite(offset) && offset >= 0 ? offset : 80}
    >
      <nav aria-label={label} data-table-of-contents-target="nav">
        <p class="heading">{label}</p>
        <ol>
          {links.map(({ section, level, number }) => (
            <li data-level={level}>
              <a href={`#${section.id}`} data-table-of-contents-target="link">
                <span class="number" aria-hidden="true">
                  {number}
                </span>
                <span class="title">{section.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div class="body">
        {links.map(({ section, level }) => (
          <section data-level={level}>
            {level === 3 ? (
              <h3 id={section.id} data-table-of-contents-target="heading">
                {section.title}
              </h3>
            ) : (
              <h2 id={section.id} data-table-of-contents-target="heading">
                {section.title}
              </h2>
            )}
            <div class="content">{section.content}</div>
          </section>
        ))}
      </div>
    </div>
  );
};
