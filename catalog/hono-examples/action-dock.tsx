import { ActionDock, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <ActionDock
      label="このスレッドの操作"
      items={[
        { label: "今すぐ返信", icon: "reply", shortcut: "R", badge: "下書き" },
        { label: "あとで返信", icon: "clock", shortcut: "L" },
        { label: "取っておく", icon: "layers", shortcut: "A" },
        { label: "浮かせる", icon: "sparkle", shortcut: "Z", accent: "coral" },
        { label: "ほかの操作", icon: "grip", shortcut: "M" },
      ]}
    />
    <DisclosureGroup label="置き方の違い">
      <Disclosure summary="移動のリンクと使えない操作">
        <ActionDock
          label="移動"
          items={[
            { label: "ピン留め", icon: "layers", href: "/", shortcut: "P" },
            { label: "検索", icon: "search", href: "/", shortcut: "K" },
            { label: "通知", icon: "bell", href: "/", shortcut: "N", disabled: true },
          ]}
        />
      </Disclosure>
      <Disclosure summary="狭い場所：横にスクロール">
        <div style="max-inline-size: 18rem">
          <ActionDock
            label="狭い場所の操作"
            items={[
              { label: "今すぐ返信", icon: "reply" },
              { label: "あとで返信", icon: "clock" },
              { label: "取っておく", icon: "layers" },
              { label: "浮かせる", icon: "sparkle" },
            ]}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <ActionDock
            label="الإجراءات"
            items={[
              { label: "رد", icon: "reply", shortcut: "R" },
              { label: "لاحقًا", icon: "clock", shortcut: "L" },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
