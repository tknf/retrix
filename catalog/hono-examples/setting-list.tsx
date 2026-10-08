import {
  SettingList,
  Switch,
  Avatar,
  Icon,
  Button,
  Disclosure,
  DisclosureGroup,
} from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <SettingList
      label="ボードを見られる人"
      items={[
        {
          label: "全員",
          leading: <Icon name="user" />,
          control: <Switch label="全員に見せる" checked />,
        },
        {
          label: "田中 遥",
          description: "haruka@example.com",
          leading: <Avatar name="田中 遥" initials="遥" size="small" />,
          control: <Icon name="check" />,
        },
        {
          label: "佐藤 健",
          description: "ken@example.com",
          leading: <Avatar name="佐藤 健" initials="健" size="small" tone="green" />,
          control: <Icon name="check" />,
        },
      ]}
    />
    <DisclosureGroup label="操作の違い">
      <Disclosure summary="操作がボタン：通知の設定・人の役割">
        <SettingList
          label="通知"
          items={[
            {
              label: "秋の読書会",
              control: (
                <Button data-current="true" data-icon-only="true" aria-label="通知を止める">
                  <Icon name="bell" />
                </Button>
              ),
            },
            {
              label: "問い合わせの対応",
              control: (
                <Button data-icon-only="true" aria-label="通知を受け取る">
                  <Icon name="bell" />
                </Button>
              ),
            },
          ]}
        />
      </Disclosure>
      <Disclosure summary="長い名前と狭い場所：点線は1.5remだけ残す">
        <div style="max-inline-size: 18rem">
          <SettingList
            label="長い名前"
            items={[
              {
                label: "初めて利用する方に向けた予約方法と当日の受付",
                description: "説明会の案内",
                control: <Switch label="公開する" />,
              },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <SettingList
            label="الإشعارات"
            items={[{ label: "الجميع", control: <Switch label="مشاركة" checked /> }]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
