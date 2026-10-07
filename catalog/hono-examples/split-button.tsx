import { SplitButton, Disclosure, DisclosureGroup } from "../../src/hono";

const items = [
  { value: "schedule", label: "送る日時を決める" },
  { value: "draft", label: "下書きとして保存" },
  { kind: "separator" as const },
  { value: "discard", label: "破棄する", danger: true },
];

export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <SplitButton id="send" label="送る" items={items} />
      <SplitButton id="save" label="保存する" variant="secondary" items={items} />
    </div>
    <DisclosureGroup label="大きさと状態の違い">
      <Disclosure summary="大きさ" open>
        <div class="rx-cluster">
          <SplitButton id="send-compact" label="送る" size="compact" items={items} />
          <SplitButton id="send-large" label="送る" size="large" items={items} />
        </div>
      </Disclosure>
      <Disclosure summary="使えない時・送っている時">
        <div class="rx-cluster">
          <SplitButton id="send-disabled" label="送る" disabled items={items} />
          <SplitButton id="send-busy" label="送っています…" busy items={items} />
        </div>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <SplitButton
            id="send-rtl"
            label="إرسال"
            items={[{ value: "draft", label: "حفظ كمسودة" }]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
