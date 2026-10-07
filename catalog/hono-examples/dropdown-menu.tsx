import { DropdownMenu, Disclosure, Button, ButtonGroup, type MenuItem } from "../../src/hono";

const basicItems = () =>
  [
    { label: "確認する", value: "inspect" },
    { label: "選べない操作", value: "disabled", disabled: true },
    { label: "複製する", value: "copy" },
  ] satisfies MenuItem[];

export default () => (
  <div class="rx-stack">
    <DropdownMenu id="hono-menu" label="項目の操作" items={basicItems()} />
    <Disclosure summary="アイコン・説明・補助表記・区切り・危険操作">
      <DropdownMenu
        id="menu-actions"
        label="記事の操作"
        items={[
          {
            kind: "group",
            label: "編集",
            items: [
              { label: "編集する", value: "edit", icon: "pencil", shortcut: "⌘E" },
              {
                label: "複製する",
                value: "copy",
                icon: "layers",
                description: "新しい下書きを作ります",
              },
            ],
          },
          { kind: "separator" },
          { label: "削除する", value: "delete", icon: "trash", danger: true },
        ]}
      />
      <p>補助表記は表示のみです。削除を含め、この例ではデータを変更しません。</p>
    </Disclosure>
    <Disclosure summary="サブメニュー・多段の階層・無効なサブメニュー">
      <DropdownMenu
        id="menu-nested"
        label="書き出しと共有"
        items={[
          { label: "プレビュー", value: "preview", icon: "eye" },
          {
            kind: "submenu",
            label: "書き出す",
            items: [
              { label: "PDF", value: "pdf" },
              {
                kind: "submenu",
                label: "画像",
                items: [
                  { label: "PNG", value: "png" },
                  { label: "JPEG", value: "jpeg" },
                  { label: "SVG", value: "svg", disabled: true },
                ],
              },
            ],
          },
          {
            kind: "submenu",
            label: "共有する",
            items: [
              { label: "リンクをコピー", value: "copy-link" },
              { label: "メールで送る", value: "email" },
            ],
          },
          {
            kind: "submenu",
            label: "管理者の操作",
            disabled: true,
            items: [{ label: "所有者を変更", value: "owner" }],
          },
        ]}
      />
    </Disclosure>
    <Disclosure summary="複数選択・一部選択・単一選択">
      <DropdownMenu
        id="menu-checks"
        label="表示設定"
        items={[
          {
            kind: "group",
            label: "表示する項目",
            items: [
              { kind: "checkbox", label: "担当者", value: "assignee", checked: true },
              { kind: "checkbox", label: "期限", value: "due", checked: false },
              { kind: "checkbox", label: "通知", value: "notifications", checked: "mixed" },
              {
                kind: "checkbox",
                label: "管理者メモ",
                value: "admin-note",
                checked: true,
                disabled: true,
              },
            ],
          },
          { kind: "separator" },
          {
            kind: "group",
            label: "並び順",
            items: [
              {
                kind: "radio",
                name: "sort",
                label: "更新が新しい順",
                value: "updated",
                checked: true,
              },
              { kind: "radio", name: "sort", label: "名前順", value: "name" },
              { kind: "radio", name: "sort", label: "優先度順", value: "priority", disabled: true },
            ],
          },
          { kind: "separator" },
          { label: "完了", value: "done" },
        ]}
      />
      <p>チェック・単一選択は開いたまま更新します。完了またはEscapeで閉じます。</p>
    </Disclosure>
    <Disclosure summary="リンク・別タブ・無効なリンク">
      <DropdownMenu
        id="menu-links"
        label="関連ページ"
        items={[
          { kind: "link", label: "記事一覧", href: "/apps/search", icon: "files" },
          { kind: "link", label: "記事一覧を別タブで開く", href: "/apps/search", target: "_blank" },
          { kind: "link", label: "利用できないページ", href: "/apps/search", disabled: true },
        ]}
      />
    </Disclosure>
    <Disclosure summary="トリガーのサイズ・アイコンのみ・主要操作との組み合わせ">
      <div class="rx-stack">
        <DropdownMenu
          id="menu-compact"
          label="小さなトリガー"
          size="compact"
          items={basicItems()}
        />
        <DropdownMenu
          id="menu-large"
          label="大きなトリガー"
          size="large"
          variant="primary"
          items={basicItems()}
        />
        <DropdownMenu
          id="menu-icon"
          label="追加の操作"
          icon="layers"
          iconOnly
          items={basicItems()}
        />
        <ButtonGroup label="公開操作">
          <Button variant="primary">公開する</Button>
          <DropdownMenu
            id="menu-publish"
            variant="primary"
            label="公開方法を選ぶ"
            iconOnly
            items={[
              { label: "日時を指定して公開", value: "schedule" },
              { label: "下書きとして保存", value: "draft" },
            ]}
          />
        </ButtonGroup>
      </div>
    </Disclosure>
    <Disclosure summary="無効・処理中・空・全項目が無効">
      <div class="rx-stack">
        <DropdownMenu id="menu-disabled" label="操作不可" disabled items={basicItems()} />
        <DropdownMenu id="menu-busy" label="処理中の操作" busy items={basicItems()} />
        <DropdownMenu id="menu-empty" label="操作がない場合" items={[]} />
        <DropdownMenu
          id="menu-all-disabled"
          label="権限がない場合"
          items={[
            { label: "編集する", value: "edit", disabled: true },
            { label: "削除する", value: "delete", danger: true, disabled: true },
          ]}
        />
      </div>
    </Disclosure>
    <Disclosure summary="右寄せ・右から左・長文・スクロール">
      <div class="rx-stack">
        <DropdownMenu
          id="menu-end"
          label="右端の操作"
          align="end"
          items={[
            {
              kind: "submenu",
              label: "書き出す",
              items: [
                { label: "PDF", value: "pdf" },
                { label: "画像", value: "image" },
              ],
            },
          ]}
        />
        <DropdownMenu
          id="menu-rtl"
          label="右から左の操作"
          dir="rtl"
          items={[
            {
              kind: "submenu",
              label: "書き出す",
              items: [
                { label: "PDF", value: "pdf" },
                { label: "画像", value: "image" },
              ],
            },
          ]}
        />
        <DropdownMenu
          id="menu-long"
          label="長い項目名"
          items={[
            {
              label: "公開前に文章と添付ファイルと設定の変更内容をまとめて確認する",
              value: "review",
              description: "項目名も説明文もメニューの幅に合わせて折り返します",
            },
            {
              label: "VeryLongUnbrokenActionNameForCheckingMenuOverflowAndWrapping",
              value: "long",
            },
          ]}
        />
        <DropdownMenu
          id="menu-many"
          label="大量の項目"
          items={Array.from({ length: 30 }, (_, index) => ({
            label: `保存先 ${index + 1}`,
            value: `folder-${index + 1}`,
          }))}
        />
      </div>
    </Disclosure>
    <Disclosure summary="選択後も開く操作・選択後に閉じるチェック">
      <DropdownMenu
        id="menu-stay"
        label="選択後の動作"
        items={[
          { label: "リンクをコピー", value: "copy-link", closeOnSelect: false },
          { kind: "checkbox", label: "通知を受け取る", value: "notify", closeOnSelect: true },
        ]}
      />
    </Disclosure>
  </div>
);
