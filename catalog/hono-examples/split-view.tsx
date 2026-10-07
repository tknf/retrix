import {
  SplitView,
  Section,
  Tag,
  Badge,
  ValueList,
  MessageList,
  Avatar,
  Disclosure,
  DisclosureGroup,
} from "../../src/hono";

const draft = (
  <Section title="公開案内の原稿">
    <p>新しい利用案内を公開します。本文、リンク先、添付資料を確認してください。</p>
    <p>内容を確定した後、公開日時を設定します。</p>
  </Section>
);

const status = (
  <Section title="確認状況">
    <div class="rx-cluster">
      <Tag label="確認中" accent="amber" />
      <span>担当：田中 遥</span>
    </div>
    <p>添付資料：2件</p>
  </Section>
);

export default () => (
  <div class="rx-stack">
    <SplitView layout="inspector" resizable primary={draft} secondary={status} />
    <DisclosureGroup label="配置と中身の違い">
      <Disclosure summary="一覧と本文（reader）：左の一覧を読みながら右で開く" open>
        <SplitView
          layout="reader"
          resizable
          primary={
            <MessageList
              label="受信した連絡"
              items={[
                {
                  id: "split-categories",
                  sender: "森 美咲",
                  title: "カテゴリ案をまとめました",
                  preview: "5つのカテゴリに整理しました。",
                  href: "/apps/inbox/categories",
                  time: "10:24",
                  unread: true,
                  current: true,
                  avatar: <Avatar name="森 美咲" initials="美" tone="green" size="small" />,
                },
                {
                  id: "split-meeting",
                  sender: "佐藤 健",
                  title: "来週の打ち合わせについて",
                  preview: "火曜日14時からはいかがでしょうか。",
                  href: "/apps/inbox/meeting",
                  time: "9:42",
                  avatar: <Avatar name="佐藤 健" initials="健" tone="blue" size="small" />,
                },
              ]}
            />
          }
          secondary={
            <Section title="カテゴリ案をまとめました">
              <p>
                5つのカテゴリに整理しました。実際の記事を入れて試してみませんか。一覧で選んだ連絡は、右の面で開きます。
              </p>
            </Section>
          }
        />
      </Disclosure>
      <Disclosure summary="幅を変えない：作業と、その値の一覧">
        <SplitView
          layout="inspector"
          primary={draft}
          secondary={
            <ValueList
              items={[
                { label: "公開状態", value: <Badge tone="info">確認待ち</Badge> },
                { label: "担当者", value: "田中 遥" },
                { label: "公開予定", value: "9月30日" },
              ]}
            />
          }
        />
      </Disclosure>
      <Disclosure summary="長い本文：面の高さは長い側にそろう">
        <SplitView
          layout="inspector"
          resizable
          initialSize={60}
          primary={
            <Section title="利用規約の改訂">
              <p>
                予約の取り消しは前日までを無料とし、当日の変更は受付で相談できるようにします。会議室の利用時間は、予約した時間の5分前から鍵をお渡しします。
              </p>
              <p>
                初めての方は入口右手の窓口で名前をお伝えください。長期利用の方は、月初めに利用票を提出してください。利用票は受付と、このページの添付資料から受け取れます。
              </p>
              <p>
                改訂は10月1日から適用します。それまでに受け付けた予約は、改訂前の条件のまま扱います。
              </p>
            </Section>
          }
          secondary={status}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：上下に積み、境目の罫線は横になる">
        <div style="max-inline-size: 28rem">
          <SplitView layout="inspector" resizable primary={draft} secondary={status} />
        </div>
      </Disclosure>
      <Disclosure summary="右から左へ書く言語">
        <div dir="rtl" lang="ar">
          <SplitView
            layout="inspector"
            resizable
            primary={
              <Section title="المسودة">
                <p>راجع النص والروابط والمرفقات قبل النشر.</p>
              </Section>
            }
            secondary={
              <Section title="الحالة">
                <p>قيد المراجعة</p>
              </Section>
            }
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
