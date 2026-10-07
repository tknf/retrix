import { expect, test } from "vite-plus/test";
import { html } from "hono/html";
import { MessageList } from "../src/hono";

test("MessageListの件数と添付の数はspanのaria-labelを使わず、読み上げ用の文で伝える", async () => {
  const markup = String(
    await html`${(
      <MessageList
        label="受信箱"
        items={[
          {
            id: "a",
            sender: "田中",
            title: "打ち合わせ",
            href: "/a",
            threadCount: 4,
            attachments: 2,
          },
        ]}
      />
    )}`,
  );
  expect(markup).not.toMatch(/<span[^>]*aria-label=/);
  expect(markup).toContain('<span class="rx-visually-hidden">4件の会話</span>');
  expect(markup).toContain('<span class="rx-visually-hidden">添付ファイル2件</span>');
  expect(markup).toContain('<span aria-hidden="true">4</span>');
  expect(markup).toContain('<span aria-hidden="true">2</span>');
});

test("MessageListは一覧の直下のliにlistitem以外の役割を付けない", async () => {
  const items = [{ id: "a", sender: "田中", title: "件名" }];
  for (const list of [
    <MessageList label="受信箱" items={items} newSince={{ id: "a" }} />,
    <MessageList label="受信箱" items={[]} />,
    <MessageList label="受信箱" items={items} state="loading" />,
  ]) {
    const markup = String(await html`${list}`);
    expect(markup).not.toMatch(/<li[^>]*\srole=/);
  }
  const divider = String(
    await html`${<MessageList label="受信箱" items={items} newSince={{ id: "a" }} />}`,
  );
  expect(divider).toContain(
    '<li class="divider"><div class="rx-divider"><span>ここから新着</span>',
  );
  const loading = String(await html`${<MessageList label="受信箱" items={[]} state="loading" />}`);
  expect(loading).toContain(
    '<li class="state"><div role="status">連絡を読み込んでいます…</div></li>',
  );
});
