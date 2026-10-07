import { Progress, Disclosure, DisclosureGroup } from "../../src/hono";
export default () => (
  <div class="rx-stack">
    <Progress label="処理待ち" value={0} />
    <Progress label="添付ファイルを送信しています" value={3} max={5} />
    <Progress label="送信完了直前" value={99.5} max={100} />
    <Progress label="送信が完了しました" value={100} />
    <Progress label="残り時間を確認中" />
    <Progress
      label="すべての添付ファイルと画像の変換が完了するまでお待ちください"
      value={7}
      max={12}
    />
    <DisclosureGroup label="置き場所の違い">
      <Disclosure summary="少しだけ進んだ" open>
        <Progress label="読み込みを始めました" value={1} max={100} />
      </Disclosure>
      <Disclosure summary="狭い場所で折り返す">
        <div class="rx-stack" style="max-inline-size: 14rem">
          <Progress label="秋の読書会の資料と参加者名簿を書き出しています" value={42} />
          <Progress label="確認中" />
          <Progress label="完了" value={8} max={8} />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div class="rx-stack" dir="rtl" lang="ar">
          <Progress label="جارٍ إرسال المرفقات" value={3} max={5} />
          <Progress label="اكتمل الإرسال" value={100} />
          <Progress label="جارٍ التحقق" />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
