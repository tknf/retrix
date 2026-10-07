import { Countdown, Card, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <Countdown value={70} before="閉じるまで" after="日" label="自動で閉じるまであと70日" />
      <Countdown value={3} before="あと" after="日" tone="danger" label="締め切りまであと3日" />
      <Countdown value={12} before="残り" after="件" tone="info" label="残り12件" />
      <Countdown value="完" tone="success" label="完了" />
    </div>
    <DisclosureGroup label="置き場所の違い">
      <Disclosure summary="カードの縁にまたがせる（置く側で位置を決める）" open>
        <div style="position: relative; max-inline-size: 24rem; padding-inline-end: 1.5rem">
          <Card title="会場を予約する">
            <p>第二会議室を18時から21時まで。</p>
          </Card>
          <Countdown
            value={5}
            before="あと"
            after="日"
            label="締め切りまであと5日"
            style="position: absolute; inset-block-start: 0.75rem; inset-inline-end: 0"
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <Countdown value={70} before="يغلق خلال" after="يوم" label="يغلق خلال 70 يوم" />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
