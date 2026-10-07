import { FileItem, ActionLink, Button } from "../../src/hono";
export default () => (
  <div>
    <FileItem
      name="読書会の写真.jpg"
      description="JPEG · 552 KB · 9月26日"
      href="/apps/files"
      preview={
        <svg viewBox="0 0 40 40" role="img" aria-label="窓辺の机の写真">
          <rect width="40" height="40" fill="#c9d8e2" />
          <rect y="26" width="40" height="14" fill="#8a6f55" />
          <rect x="6" y="8" width="14" height="14" fill="#eef4f8" />
          <circle cx="29" cy="20" r="6" fill="#5f7f6a" />
        </svg>
      }
    />
    <FileItem
      name="利用料金の請求書-2026-09.pdf"
      description="PDF · 47.7 KB · 9月13日"
      href="/apps/files"
      preview={
        <svg viewBox="0 0 40 40" role="img" aria-label="請求書の1ページ目">
          <rect width="40" height="40" fill="#ffffff" />
          <rect x="6" y="7" width="14" height="2" fill="#243946" />
          <rect x="6" y="13" width="28" height="1" fill="#b7c4cc" />
          <rect x="6" y="17" width="28" height="1" fill="#b7c4cc" />
          <rect x="6" y="21" width="20" height="1" fill="#b7c4cc" />
          <rect x="24" y="29" width="10" height="2" fill="#243946" />
        </svg>
      }
    />
    <FileItem
      name="仕事場の案内.pdf"
      description="PDF · 2.4 MB · 9月15日更新"
      href="/apps/files"
      actions={<ActionLink href="/apps/files">ファイルを確認する</ActionLink>}
    />
    <FileItem
      name="秋の読書会のお知らせと参加される皆さまへの詳しいご案内_2026年9月版.pdf"
      description="PDF · 1.8 MB"
      state="pending"
    />
    <FileItem
      name="project-2026-abcdefghijklmnopqrstuvwxyz0123456789.zip"
      description="接続を確認し、もう一度選択してください。"
      state="error"
      actions={<Button disabled>再送信する</Button>}
    />
  </div>
);
