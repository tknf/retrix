import { TaskList, Avatar, AvatarGroup, Badge, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <TaskList
      label="公開前の確認"
      heading="チェックリスト"
      title="公開前の確認"
      add={{ name: "new-task", placeholder: "項目を追加する" }}
      items={[
        { name: "proof", label: "本文を校正する", detail: "田中 · 9月12日" },
        { name: "photo", label: "写真を選ぶ", checked: true, detail: "佐藤 · 完了" },
        { name: "approval", label: "管理者の確認", disabled: true },
      ]}
    />
    <DisclosureGroup label="項目の違い">
      <Disclosure summary="担当と期限：行の末尾にアバターと期限のバッジ" open>
        <TaskList
          label="秋の読書会の準備"
          heading="読書会の準備"
          items={[
            {
              name: "venue",
              label: "会場を予約する",
              checked: true,
              end: <Avatar name="佐藤 健" initials="健" size="small" tone="green" />,
            },
            {
              name: "flyer",
              label: "案内のチラシを作る",
              detail: "A4・両面",
              end: (
                <>
                  <Avatar name="田中 遥" initials="遥" size="small" />
                  <Badge tone="danger">期限切れ 9月20日</Badge>
                </>
              ),
            },
            {
              name: "books",
              label: "課題の本を人数分そろえる",
              end: (
                <>
                  <AvatarGroup label="担当の2人" size="small">
                    <Avatar name="森 美咲" initials="美" size="small" tone="coral" />
                    <Avatar name="高橋 大輔" initials="大" size="small" tone="amber" />
                  </AvatarGroup>
                  <Badge tone="warning">明日まで</Badge>
                </>
              ),
            },
            {
              name: "snack",
              label: "お茶と菓子を用意する",
              end: <Badge>10月3日</Badge>,
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="全部終えた一覧：円が緑に塗られ、チェックが付く">
        <TaskList
          label="引っ越しの手続き"
          heading="引っ越しの手続き"
          items={[
            { name: "address", label: "住所の変更を届ける", checked: true },
            { name: "power", label: "電気とガスの開始を申し込む", checked: true },
            { name: "mail", label: "郵便の転送を申し込む", checked: true },
          ]}
        />
      </Disclosure>
      <Disclosure summary="見出しのない一覧：行だけを並べる">
        <TaskList
          label="今日のやること"
          items={[
            { name: "reply", label: "問い合わせに返信する" },
            { name: "invoice", label: "請求書を送る", checked: true },
            { name: "backup", label: "写真を保存する" },
          ]}
        />
      </Disclosure>
      <Disclosure summary="長い題名と狭い場所：題名は折り返し、末尾のバッジは次の行へ">
        <div style="max-inline-size: 22rem">
          <TaskList
            label="長い題名"
            heading="確認すること"
            items={[
              {
                name: "long",
                label:
                  "初めて利用する方に向けた予約方法と当日の受付の流れを、写真付きで分かりやすく書き直す",
                detail: "田中 · 9月30日",
                end: <Badge tone="info">レビュー中</Badge>,
              },
              {
                name: "long-done",
                label: "キャンセルの条件と返金の時期を、料金表の下にまとめて書き足す",
                checked: true,
                end: <Avatar name="佐藤 健" initials="健" size="small" tone="green" />,
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="まだ項目がない一覧：追加する欄だけ">
        <TaskList
          label="来月の準備"
          heading="来月の準備"
          add={{ name: "next-task", placeholder: "最初の項目を書く" }}
          items={[]}
        />
      </Disclosure>
    </DisclosureGroup>
  </div>
);
