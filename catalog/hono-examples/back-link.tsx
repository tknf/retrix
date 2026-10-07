import { BackLink, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <BackLink href="/" label="受信トレイ" />
      <BackLink href="/" label="設定" />
    </div>
    <DisclosureGroup label="形の違い">
      <Disclosure summary="背景を持たない太字とショートカットキーの表示" open>
        <BackLink href="/" label="ボードへ戻る" tone="plain" shortcut="ESC" />
      </Disclosure>
      <Disclosure summary="長い名前">
        <div style="max-inline-size: 14rem">
          <BackLink href="/" label="秋の読書会の準備と当日の受付" />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <BackLink href="/" label="الإعدادات" />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
