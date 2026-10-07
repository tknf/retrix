import { Carousel, ImageFrame, Tag } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <Carousel
      label="編集部からのお知らせ"
      interval={5000}
      slides={[
        {
          title: "暮らしの記録を公開しました",
          eyebrow: <Tag label="新着" accent="blue" />,
          preview: <ImageFrame src="/assets/sample-cover.svg" alt="暮らしの記録 2026の表紙" />,
          content: <p>日々の仕事と暮らしを記録した、新しい読み物を公開しました。</p>,
          footer: <span>2026年9月24日</span>,
        },
        {
          title: "公開までの準備について",
          content: (
            <p>
              読み手が必要な情報に迷わずたどり着けるよう、原稿、関連資料、公開日時を順に確認します。
              画像がない場合でも見出しと本文の関係が崩れない構成です。
            </p>
          ),
          footer: <span>原稿・資料・日時</span>,
        },
        {
          title: "次の更新予定",
          content: <p>次回の更新に向けて、寄せられた意見を整理しています。</p>,
        },
      ]}
    />
    <Carousel
      label="お知らせが一件の例"
      slides={[
        { title: "公開準備中", content: <p>項目が一件のときは切り替え操作を表示しません。</p> },
      ]}
    />
    <Carousel label="お知らせがない例" slides={[]} />
  </div>
);
