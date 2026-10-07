import {
  TextEditor,
  Composer,
  SplitButton,
  Button,
  Disclosure,
  DisclosureGroup,
} from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <TextEditor id="comment-editor" label="コメント" name="comment" placeholder="コメントを書く…" />
    <DisclosureGroup label="置き方と書式ツールの違い">
      <Disclosure summary="書式ツールを下に置き、送る操作を並べる" open>
        <TextEditor
          id="reply-editor"
          label="返信"
          name="reply"
          placeholder="返信を書く…"
          placement="bottom"
          actions={
            <SplitButton
              id="reply-send"
              label="送る"
              type="submit"
              items={[
                { value: "schedule", label: "送る日時を決める" },
                { value: "draft", label: "下書きとして保存" },
              ]}
            />
          }
        />
      </Disclosure>
      <Disclosure summary="書式ツールを絞る">
        <TextEditor
          id="note-editor"
          label="メモ"
          name="note"
          placeholder="メモを書く…"
          tools={["bold", "italic", "link", "|", "bullets"]}
        />
      </Disclosure>
      <Disclosure summary="Composerの入力エリアに入れる">
        <Composer
          id="composer-with-editor"
          label="お知らせ"
          name="announcement"
          submitLabel="投稿する"
          editor={
            <TextEditor
              id="announcement-editor"
              label="お知らせ"
              name="announcement"
              placeholder="お知らせを書く…"
            />
          }
        />
      </Disclosure>
      <Disclosure summary="狭い場所：ツールバーは折り返す">
        <div style="max-inline-size: 18rem">
          <TextEditor
            id="narrow-editor"
            label="狭い場所のメモ"
            name="narrow"
            placeholder="書く…"
            actions={<Button size="compact">保存</Button>}
          />
        </div>
      </Disclosure>
      <Disclosure summary="使えない時・右から左に読む場合">
        <div class="rx-stack" data-space="small">
          <TextEditor id="disabled-editor" label="締め切ったコメント" name="closed" disabled />
          <div dir="rtl" lang="ar">
            <TextEditor id="rtl-editor" label="تعليق" name="rtl" placeholder="اكتب تعليقًا…" />
          </div>
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
