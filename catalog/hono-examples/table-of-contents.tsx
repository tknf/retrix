import { TableOfContents } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <p>公開前の確認事項を、担当者が上から順に読み進めるための資料です。</p>
    <TableOfContents
      label="この資料の目次"
      sections={[
        {
          id: "guide-purpose",
          title: "この資料の目的",
          content: (
            <p>
              公開する内容、添付ファイル、共有範囲を一つずつ確認します。修正が必要な項目は、公開する前に担当者へ戻してください。
            </p>
          ),
        },
        {
          id: "guide-content",
          title: "内容の確認",
          content: (
            <ul>
              <li>見出しと本文が、現在の案内内容と一致しているか</li>
              <li>日時や連絡先が、予定表と一致しているか</li>
              <li>リンク先を開き、閲覧できるか</li>
            </ul>
          ),
        },
        {
          id: "guide-attachments",
          title: "添付ファイル",
          level: 3,
          content: (
            <p>
              最新版のファイルが添付されていることを確認します。古い版が残っている場合は、公開前に取り除いてください。
            </p>
          ),
        },
        {
          id: "guide-sharing",
          title: "共有範囲",
          level: 3,
          content: (
            <p>
              閲覧できる人と公開開始日を確認します。限定公開の資料は、対象外の人へリンクを送らないでください。
            </p>
          ),
        },
        {
          id: "guide-final",
          title: "最終確認",
          content: (
            <p>修正が反映された内容をもう一度読み返し、担当者と確認日を記録してから公開します。</p>
          ),
        },
      ]}
    />
  </div>
);
