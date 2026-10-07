import { EditableProperty, Button, Disclosure, DisclosureGroup } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <EditableProperty id="property-owner" label="担当者" name="owner" value="田中 遥" required />
    <EditableProperty id="property-note" label="メモ" name="note" emptyLabel="未登録" />
    <EditableProperty
      id="property-summary"
      label="打ち合わせの要点"
      name="summary"
      value={"カテゴリは5つにまとめる。\n公開は9月30日。\n次回は10月7日の14時から。"}
      multiline
    />
    <p class="catalog-footnote">
      値か鉛筆のアイコンを押して編集を始め、⌘＋Enter（WindowsなどではCtrl＋Enter）か「確定」で編集を終えます。Escapeか「取消」で元の値に戻します。一行でも複数行でも同じで、Enterだけでは確定しません。
    </p>
    <DisclosureGroup label="値と置き場所の違い">
      <Disclosure summary="項目を並べる" open>
        <div class="rx-split">
          <EditableProperty
            id="sheet-title"
            label="件名"
            name="title"
            value="秋の読書会のお知らせ"
            required
          />
          <EditableProperty id="sheet-owner" label="担当者" name="sheet-owner" value="森 美咲" />
          <EditableProperty id="sheet-date" label="公開日" name="date" value="9月30日" />
          <EditableProperty
            id="sheet-code"
            label="管理番号（8文字まで）"
            name="code"
            value="AUT-0930"
            maxLength={8}
          />
        </div>
      </Disclosure>
      <Disclosure summary="複数行：空のメモと長い文">
        <div class="rx-split">
          <EditableProperty
            id="property-memo-empty"
            label="引き継ぎのメモ"
            name="handover"
            emptyLabel="未登録"
            multiline
          />
          <EditableProperty
            id="property-memo-long"
            label="会場の案内"
            name="guide"
            value={
              "入口右手の窓口で名前をお伝えください。会議室の鍵は、予約した時間の5分前からお渡しします。\n長期利用の方は、月初めに利用票を提出してください。"
            }
            multiline
          />
        </div>
      </Disclosure>
      <Disclosure summary="空のままでは確定できない値">
        <EditableProperty
          id="property-required"
          label="連絡先"
          name="contact"
          emptyLabel="未登録（必須）"
          required
        />
      </Disclosure>
      <Disclosure summary="編集できない値">
        <EditableProperty
          id="property-disabled"
          label="作成者"
          name="author"
          value="佐藤 健"
          disabled
        />
      </Disclosure>
      <Disclosure summary="長い値">
        <EditableProperty
          id="property-long"
          label="共有リンク"
          name="link"
          value="https://example.com/articles/autumn-reading-club-2026-abcdefghijklmnopqrstuvwxyz0123456789"
        />
      </Disclosure>
      <Disclosure summary="フォームで送る値と取り消し">
        <form id="property-form" class="rx-stack" action="/apps/people" method="get">
          <EditableProperty
            id="property-form-place"
            label="会場"
            name="place"
            value="3階の会議室"
            form="property-form"
          />
          <div class="rx-cluster">
            <Button type="submit" variant="primary">
              送信する
            </Button>
            <Button type="reset">最初の値に戻す</Button>
          </div>
        </form>
      </Disclosure>
      <Disclosure summary="右から左に読む場合">
        <div dir="rtl" lang="ar">
          <EditableProperty id="property-rtl" label="المسؤول" name="owner-rtl" value="سارة" />
        </div>
      </Disclosure>
    </DisclosureGroup>
  </div>
);
