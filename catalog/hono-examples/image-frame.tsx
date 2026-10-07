import { ImageFrame, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <ImageFrame
        src="/assets/sample-photo.svg"
        alt="窓辺の机の写真"
        shape="square"
        caption="窓辺の机.jpg"
        meta="552 KB · 9月26日"
      />
      <ImageFrame
        src="/assets/sample-cover.svg"
        alt="暮らしの記録の表紙"
        shape="square"
        caption="暮らしの記録.pdf"
        meta="1.2 MB · 9月15日"
      />
      <ImageFrame alt="会場の見取り図" shape="square" caption="見取り図.png" meta="未登録" />
    </div>
    <DisclosureGroup label="形・収め方・長い名前の違い">
      {(["portrait", "square", "landscape"] as const).map((shape) => (
        <Disclosure summary={`${shape}の枠に収める`}>
          <div class="rx-cluster">
            <ImageFrame
              src="/assets/sample-photo.svg"
              alt={`${shape}の枠に全体を表示した横長の写真`}
              shape={shape}
              caption="全体を表示（横長）"
            />
            <ImageFrame
              src="/assets/sample-cover.svg"
              alt={`${shape}の枠に全体を表示した縦長の表紙`}
              shape={shape}
              caption="全体を表示（縦長）"
            />
            <ImageFrame
              src="/assets/sample-photo.svg"
              alt={`${shape}の枠に切り抜いた写真`}
              shape={shape}
              fit="cover"
              caption="切り抜いて表示"
            />
            <ImageFrame alt={`${shape}の未登録画像`} shape={shape} caption="未登録" />
          </div>
        </Disclosure>
      ))}
      <Disclosure summary="長い名前・右から左に読む場合">
        <div class="rx-cluster">
          <ImageFrame
            src="/assets/sample-photo.svg"
            alt="秋の読書会の会場の写真"
            shape="square"
            caption="autumn-reading-club-2026-venue-photo-original.jpg"
            meta="3.4 MB · 9月20日"
          />
          <div dir="rtl" lang="ar">
            <ImageFrame
              src="/assets/sample-photo.svg"
              alt="صورة المكتب"
              shape="square"
              caption="المكتب.jpg"
              meta="٥٥٢ كيلوبايت"
            />
          </div>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
