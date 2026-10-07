import { CommandMenu } from "../../src/hono";
export default () => (
  <div class="rx-stack" data-space="small" data-controller="command-demo">
    <CommandMenu
      id="command-example"
      shortcut="mod+k"
      label="Retrixの道具箱"
      action="command-menu:select->command-demo#selected"
      shortcuts={[
        { label: "カタログ", href: "/", icon: "grid", accent: "green" },
        { label: "入力", href: "/components/field", icon: "pencil", accent: "blue" },
        { label: "予定", href: "/components/calendar", icon: "calendar", accent: "amber" },
        { label: "通知", href: "/components/message-list", icon: "mail", accent: "coral" },
      ]}
      groups={[
        {
          label: "最近使ったコンポーネント",
          items: [
            {
              label: "Card",
              href: "/components/card",
              icon: "file",
              description: "内容をまとめる",
            },
            {
              label: "Table",
              href: "/components/table",
              icon: "grid",
              description: "数値や属性を比べる",
            },
            {
              label: "DatePicker",
              href: "/components/date-picker",
              icon: "calendar",
              description: "日付・期間",
              keywords: ["日付", "予定"],
            },
            {
              label: "編集できないコンポーネント（閲覧権限のみ）",
              value: "restricted",
              disabled: true,
            },
          ],
        },
        {
          label: "道具箱",
          items: [
            {
              label: "CommandMenu",
              href: "/components/command-menu",
              current: true,
              icon: "layers",
            },
            { label: "操作イベントを試す", value: "example", icon: "check" },
          ],
        },
      ]}
    />
    <output aria-live="polite">
      「操作イベントを試す」を選ぶと、受け取った値をここに表示します。
    </output>
  </div>
);
