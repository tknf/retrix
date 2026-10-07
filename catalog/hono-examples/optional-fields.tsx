import {
  OptionalFields,
  Field,
  Input,
  Textarea,
  Disclosure,
  DisclosureGroup,
} from "../../src/hono";

const field = (id: string, label: string, textarea = false) => (
  <Field id={id} label={label}>
    {(control) =>
      textarea ? <Textarea {...control} name={id} rows={3} /> : <Input {...control} name={id} />
    }
  </Field>
);

export default () => (
  <div class="rx-stack">
    <OptionalFields
      label="予定に追加する項目"
      items={[
        { id: "event-link", label: "リンク", icon: "link", field: field("event-link", "リンク") },
        { id: "event-place", label: "場所", icon: "file", field: field("event-place", "場所") },
        {
          id: "event-people",
          label: "招待",
          icon: "user",
          field: field("event-people", "招待する人"),
        },
        {
          id: "event-note",
          label: "メモ",
          icon: "pencil",
          field: field("event-note", "メモ", true),
        },
        {
          id: "event-repeat",
          label: "繰り返し",
          icon: "redo",
          field: field("event-repeat", "繰り返し"),
        },
      ]}
    />
    <DisclosureGroup label="並べ方と状態の違い">
      <Disclosure summary="縦に並べる（検索の条件）" open>
        <OptionalFields
          label="検索の条件"
          layout="stack"
          items={[
            {
              id: "q-has",
              label: "添付がある",
              icon: "attach",
              field: field("q-has", "添付の種類"),
            },
            { id: "q-words", label: "含む語", icon: "plus", field: field("q-words", "含む語") },
            { id: "q-from", label: "差出人", icon: "user", field: field("q-from", "差出人") },
            { id: "q-date", label: "期間", icon: "calendar", field: field("q-date", "期間") },
          ]}
        />
      </Disclosure>
      <Disclosure summary="値が入っている項目は最初から出す">
        <OptionalFields
          label="予定に追加する項目"
          items={[
            { id: "open-place", label: "場所", open: true, field: field("open-place", "場所") },
            { id: "open-note", label: "メモ", field: field("open-note", "メモ", true) },
          ]}
        />
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <OptionalFields
            label="إضافة"
            items={[
              {
                id: "rtl-place",
                label: "المكان",
                icon: "file",
                field: field("rtl-place", "المكان"),
              },
            ]}
          />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
