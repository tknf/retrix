import {
  Message,
  Avatar,
  AvatarGroup,
  Tag,
  TagGroup,
  Button,
  ActionLink,
  FileItem,
  Disclosure,
  DisclosureGroup,
} from "../../src/hono";

const mori = <Avatar name="森 美咲" initials="美" tone="green" size="small" />;
const sato = <Avatar name="佐藤 健" initials="健" size="small" />;
const tanaka = <Avatar name="田中 遥" initials="田" tone="amber" size="small" />;

export default () => (
  <div class="rx-stack">
    <div>
      <Message
        author="森 美咲"
        time="今日 10:24"
        datetime="2026-09-15T10:24:00+09:00"
        avatar={mori}
      >
        <p>
          記事のカテゴリを5つにまとめました。まずはこの形で、実際に探しやすいか試してみたいです。
        </p>
      </Message>
      <Message
        author="佐藤 健"
        time="今日 10:31"
        datetime="2026-09-15T10:31:00+09:00"
        avatar={sato}
        actions={
          <>
            <Button size="compact">返信する</Button>
            <Button size="compact" variant="link">
              リンクをコピー
            </Button>
          </>
        }
      >
        <p>いいと思います。</p>
      </Message>
    </div>
    <DisclosureGroup label="会話の形と文書の形">
      <Disclosure summary="返信をまとめる">
        <Message
          author="田中 遥"
          time="9月14日 16:02"
          datetime="2026-09-14T16:02:00+09:00"
          avatar={tanaka}
          replies={
            <>
              <Message
                author="森 美咲"
                time="9月14日 16:10"
                datetime="2026-09-14T16:10:00+09:00"
                avatar={mori}
              >
                <p>18時からで大丈夫です。</p>
              </Message>
              <Message
                author="佐藤 健"
                time="9月14日 16:25"
                datetime="2026-09-14T16:25:00+09:00"
                avatar={sato}
              >
                <p>少し遅れて参加します。資料は先に共有しておきます。</p>
              </Message>
            </>
          }
        >
          <p>読書会の開始時間を18時に変えてもよいですか。</p>
        </Message>
      </Disclosure>
      <Disclosure summary="アバターなし・複数段落・添付">
        <div>
          <Message author="予約の受付" time="9月13日 9:00" datetime="2026-09-13T09:00:00+09:00">
            <p>中会議室の予約を受け付けました。</p>
          </Message>
          <Message
            author="森 美咲"
            time="9月13日 9:12"
            datetime="2026-09-13T09:12:00+09:00"
            avatar={mori}
          >
            <p>当日の進め方をまとめました。</p>
            <p>最初の10分で近況を話し、そのあと一人ずつ本を紹介します。</p>
            <FileItem name="当日の進め方.pdf" description="PDF · 120 KB" href="/apps/files" />
          </Message>
        </div>
      </Disclosure>
      <Disclosure summary="メールのスレッドをカードを重ねて表示する">
        <div class="rx-stack">
          <div class="rx-cluster">
            <AvatarGroup label="森 美咲、佐藤 健" size="small">
              {mori}
              {sato}
            </AvatarGroup>
            <TagGroup label="ラベル">
              <Tag label="読書会" accent="blue" />
            </TagGroup>
          </div>
          <h3>来週の打ち合わせについて</h3>
          <div>
            <Message
              layout="document"
              author="森 美咲"
              time="9月15日"
              datetime="2026-09-15T09:00:00+09:00"
              avatar={mori}
            >
              <p>来週の打ち合わせの資料を共有します。事前に目を通しておいてください。</p>
              <FileItem
                name="料金表-2026年秋.pdf"
                description="PDF · 47.7 KB"
                href="/apps/files"
                preview={
                  <svg viewBox="0 0 40 40" role="img" aria-label="料金表の1ページ目">
                    <rect width="40" height="40" fill="#ffffff" />
                    <rect x="6" y="7" width="14" height="2" fill="#243946" />
                    <rect x="6" y="13" width="28" height="1" fill="#b7c4cc" />
                    <rect x="6" y="17" width="28" height="1" fill="#b7c4cc" />
                    <rect x="6" y="21" width="20" height="1" fill="#b7c4cc" />
                  </svg>
                }
              />
            </Message>
            <Message
              layout="document"
              author="佐藤 健"
              time="9月15日"
              datetime="2026-09-15T11:20:00+09:00"
              avatar={sato}
            >
              <p>ありがとうございます。料金の表だけ、先に確認しておきます。</p>
            </Message>
            <Message
              layout="document"
              author="森 美咲"
              time="9月16日"
              datetime="2026-09-16T08:45:00+09:00"
              avatar={mori}
              actions={
                <>
                  <Button size="compact">返信する</Button>
                  <Button size="compact">後で返信</Button>
                </>
              }
            >
              <p>助かります。気になる点があれば、この返信にまとめてください。</p>
              <p>当日は14時から、2階の小部屋で始めます。</p>
            </Message>
          </div>
        </div>
      </Disclosure>
      <Disclosure summary="長い名前・長い本文">
        <div class="rx-stack">
          <Message
            author="株式会社とても長い名前の制作会社・海外事業部／山田"
            time="9月12日 18:40"
            datetime="2026-09-12T18:40:00+09:00"
            avatar={<Avatar name="山田" initials="山" tone="coral" size="small" />}
          >
            <p>
              https://example.com/documents/abcdefghijklmnopqrstuvwxyz0123456789
              に資料を置きました。確認の際は、共有設定が「組織内」になっていることもあわせて確かめてください。
            </p>
          </Message>
          <Message
            layout="document"
            author="株式会社とても長い名前の制作会社・海外事業部／山田"
            time="9月12日"
            datetime="2026-09-12T18:40:00+09:00"
            avatar={<Avatar name="山田" initials="山" tone="coral" size="small" />}
            actions={<ActionLink href="/apps/docs">元のメールを開く</ActionLink>}
          >
            <p>
              https://example.com/documents/abcdefghijklmnopqrstuvwxyz0123456789
              に資料を置きました。共有設定が「組織内」になっていることもあわせて確かめてください。
            </p>
          </Message>
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Message
            author="ليلى"
            time="اليوم ١٠:٢٤"
            datetime="2026-09-15T10:24:00+09:00"
            avatar={<Avatar name="ليلى" initials="ل" tone="coral" size="small" />}
          >
            <p>أحضر كتابًا قرأته مؤخرًا وشارك انطباعاتك.</p>
          </Message>
          <Message
            layout="document"
            author="عمر"
            time="١٥ سبتمبر"
            datetime="2026-09-15T11:20:00+09:00"
            avatar={<Avatar name="عمر" initials="ع" size="small" />}
          >
            <p>شكرًا، سأراجع الجدول قبل الاجتماع.</p>
          </Message>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
