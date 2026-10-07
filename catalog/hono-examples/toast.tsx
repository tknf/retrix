import { Toast, ToastStack, Button, ActionLink, Disclosure, DisclosureGroup } from "../../src/hono";
export default () => (
  <div class="rx-stack">
    <p>続けて開くと右下に重なります。重なりを押すと広がり、外側を押すかEscで畳みます。</p>
    <div class="rx-cluster">
      <Button popovertarget="hono-toast">結果表示を試す</Button>
      <Button popovertarget="hono-toast-timed">5秒で閉じる通知</Button>
      <Button popovertarget="hono-toast-short">短い通知</Button>
      <Button popovertarget="hono-toast-warning">注意の通知</Button>
      <Button popovertarget="hono-toast-danger">失敗の通知</Button>
    </div>
    <ToastStack>
      <Toast
        id="hono-toast"
        tone="success"
        actions={<ActionLink href="/apps/docs">記事を確認する</ActionLink>}
      >
        「初めて仕事場を利用する方へのご案内」を下書きに保存しました。公開する前に内容を確認できます。
      </Toast>
      <Toast id="hono-toast-timed" duration={5000}>
        変更を保存しました。
      </Toast>
      <Toast id="hono-toast-short" tone="success">
        コピーしました
      </Toast>
      <Toast id="hono-toast-warning" tone="warning">
        通信が不安定です。保存は続けています。
      </Toast>
      <Toast
        id="hono-toast-danger"
        tone="danger"
        live="assertive"
        actions={<Button>もう一度保存する</Button>}
      >
        保存できませんでした。接続を確認してください。
      </Toast>
    </ToastStack>
    <DisclosureGroup label="置き場所と読む向きの違い">
      <Disclosure summary="下の中央・左下に置く">
        <div class="rx-cluster">
          <Button popovertarget="hono-toast-center">下の中央に出す</Button>
          <Button popovertarget="hono-toast-start">左下に出す</Button>
        </div>
        <ToastStack placement="center">
          <Toast id="hono-toast-center">下の中央に出す通知です。</Toast>
        </ToastStack>
        <ToastStack placement="start">
          <Toast id="hono-toast-start">左下に出す通知です。</Toast>
        </ToastStack>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <Button popovertarget="hono-toast-rtl">右から左に読む通知</Button>
        <div dir="rtl" lang="ar">
          <ToastStack>
            <Toast id="hono-toast-rtl" closeLabel="إغلاق">
              تم حفظ التغييرات.
            </Toast>
          </ToastStack>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
