import { CopyField, Button, Icon, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <CopyField
      id="public-link"
      label="公開リンク"
      value="https://example.com/public/boards/6Kq2"
      help="ログインしなくても、このボードだけを見られます。"
    />
    <DisclosureGroup label="操作と長さの違い">
      <Disclosure summary="作り直す操作を添える（招待リンク）" open>
        <CopyField
          id="invite-link"
          label="招待リンク"
          value="https://example.com/join/AJqP-fXVM-mirH"
          help="この招待は10回中0回使われています。"
          actions={
            <Button data-icon-only="true" aria-label="招待リンクを作り直す">
              <Icon name="redo" />
            </Button>
          }
        />
      </Disclosure>
      <Disclosure summary="狭い場所：長い値は欄の中で省略する">
        <div style="max-inline-size: 16rem">
          <CopyField
            id="narrow-link"
            label="共有の住所"
            value="https://example.com/articles/autumn-reading-club-2026/guide"
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <CopyField id="rtl-link" label="رابط الدعوة" value="https://example.com/join/AJqP" />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
