import {
  Composer,
  FileInput,
  Avatar,
  Button,
  Icon,
  Disclosure,
  DisclosureGroup,
} from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <Composer
      id="message-composer"
      label="メッセージ"
      name="body"
      action="/apps/people"
      method="get"
      placeholder="メッセージを書く"
      submitLabel="送信する"
      to={
        <>
          <span>宛先</span>
          <Avatar name="森 美咲" initials="美" tone="green" />
          <span>森 美咲</span>
        </>
      }
      status="下書きを保存しました"
      attachments={<FileInput id="message-file" name="files" label="添付ファイル" multiple />}
      required
    />
    <DisclosureGroup label="書き方と状態の違い">
      <Disclosure summary="書式の操作と下書きの保存" open>
        <Composer
          id="composer-actions"
          label="コメント"
          name="comment"
          placeholder="コメントを書く"
          submitLabel="投稿する"
          actions={
            <>
              <Button size="compact" data-icon-only="true" aria-label="ファイルを添付">
                <Icon name="file" />
              </Button>
              <Button size="compact">下書きに保存</Button>
            </>
          }
        />
      </Disclosure>
      <Disclosure summary="リッチテキストエディター（ProseMirror・Tiptapの構造）">
        <Composer
          id="composer-editor"
          label="議事録"
          name="minutes"
          submitLabel="保存する"
          status="エディターが送信用の値を持ちます"
          editor={
            <div class="tiptap">
              <div class="ProseMirror" contenteditable role="textbox" aria-multiline="true">
                <p>9月の打ち合わせで決まったこと</p>
                <ul>
                  <li>カテゴリは5つにまとめる</li>
                  <li>公開は9月30日</li>
                </ul>
                <p>次回は10月7日の14時からです。</p>
              </div>
            </div>
          }
        />
      </Disclosure>
      <Disclosure summary="何も書いていないエディター">
        <Composer
          id="composer-empty-editor"
          label="メモ"
          name="memo"
          submitLabel="保存する"
          editor={
            <div
              contenteditable
              role="textbox"
              aria-multiline="true"
              aria-label="メモの本文"
              data-placeholder="思いついたことを書き留める"
            />
          }
        />
      </Disclosure>
      <Disclosure summary="送信中">
        <Composer
          id="composer-busy"
          label="返信"
          name="busy-reply"
          value="資料を確認しました。明日までに戻します。"
          submitLabel="送信する"
          busy
        />
      </Disclosure>
      <Disclosure summary="送信できなかったとき">
        <Composer
          id="composer-error"
          label="返信"
          name="reply"
          submitLabel="再送する"
          error="送信できませんでした。内容を確認して、もう一度送信してください。"
        />
      </Disclosure>
      <Disclosure summary="狭い場所：操作が折り返す">
        <div style="max-inline-size: 22rem">
          <Composer
            id="composer-narrow"
            label="返信"
            name="narrow-reply"
            placeholder="返信を書く"
            submitLabel="送信する"
            to={
              <>
                <span>宛先</span>
                <span>海外拠点の予約窓口チーム（review-abcdefghijklmnopqrstuvwxyz）</span>
              </>
            }
            status="下書きを保存しました"
            actions={<Button size="compact">下書きに保存</Button>}
          />
        </div>
      </Disclosure>
      <Disclosure summary="右から左へ書く言語">
        <div dir="rtl" lang="ar">
          <Composer
            id="composer-rtl"
            label="رسالة"
            name="rtl-body"
            placeholder="اكتب رسالة"
            submitLabel="إرسال"
            status="تم حفظ المسودة"
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
