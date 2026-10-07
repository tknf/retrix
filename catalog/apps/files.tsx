import {
  Avatar,
  Button,
  Dialog,
  DropdownMenu,
  EmptyState,
  FileInput,
  FilterBar,
  Icon,
  PageHeader,
  Table,
} from "../../src/hono";
import { files, members } from "./data";
import { AppFrame, appPath } from "./frame";

const kinds = ["PDF", "画像", "表"] as const;

/** 資料。種類で絞り込み、表で名前・種類・大きさ・更新日・担当を読む。アップロードはDialogで受け付ける。 */
export const FilesScreen = ({ kind }: { kind?: string }) => {
  const current = kinds.find((entry) => entry === kind);
  const shown = files.filter((file) => !current || file.kind === current);
  return (
    <AppFrame current="files">
      <PageHeader
        title="資料"
        icon={<Icon name="file" />}
        description="構成案や画像など、ヘルプセンターの制作に使う資料です。"
        actions={
          <Dialog
            id="files-upload"
            title="資料をアップロード"
            trigger="＋ アップロード"
            triggerVariant="primary"
            closeLabel="やめる"
            actions={
              <Button type="submit" form="files-upload-form" variant="primary">
                アップロード
              </Button>
            }
          >
            <form id="files-upload-form" class="rx-stack" method="dialog">
              <FileInput
                id="files-upload-input"
                label="資料"
                name="files"
                multiple
                accept="application/pdf,image/*,text/csv"
                help="PDF・画像・CSVを、1つ20 MBまで選べます。この画面では送信しません。"
              />
            </form>
          </Dialog>
        }
      />
      <FilterBar
        label="資料の種類"
        items={[
          {
            label: "すべて",
            href: appPath("files"),
            count: files.length,
            current: !current,
          },
          ...kinds.map((entry) => ({
            label: entry,
            href: `${appPath("files")}?kind=${encodeURIComponent(entry)}`,
            count: files.filter((file) => file.kind === entry).length,
            current: current === entry,
          })),
        ]}
      />
      {shown.length > 0 ? (
        <Table caption={current ? `${current}の資料` : "すべての資料"}>
          <thead>
            <tr>
              <th scope="col">名前</th>
              <th scope="col">種類</th>
              <th scope="col" data-cell="numeric">
                大きさ
              </th>
              <th scope="col">更新日</th>
              <th scope="col">担当</th>
              <th scope="col">
                <span class="rx-visually-hidden">操作</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {shown.map((file, index) => {
              const owner = members[file.owner];
              return (
                <tr>
                  <th scope="row">{file.name}</th>
                  <td>{file.kind}</td>
                  <td data-cell="numeric">{file.size}</td>
                  <td>{file.updated}</td>
                  <td>
                    <span class="rx-cluster" data-space="small">
                      <Avatar
                        name={owner.name}
                        initials={owner.initials}
                        tone={owner.tone}
                        size="small"
                      />
                      {owner.name}
                    </span>
                  </td>
                  <td>
                    <DropdownMenu
                      id={`files-actions-${index}`}
                      label={`${file.name}の操作`}
                      icon="grip"
                      iconOnly
                      variant="link"
                      align="end"
                      items={[
                        { label: "ダウンロード", value: "download" },
                        { label: "名前を変える", value: "rename", icon: "pencil" },
                        { kind: "separator" },
                        { label: "削除する", value: "delete", icon: "trash", danger: true },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <EmptyState title={`${current}の資料はまだありません`} kind="start">
          <p>「アップロード」から、最初の資料を追加できます。</p>
        </EmptyState>
      )}
    </AppFrame>
  );
};
