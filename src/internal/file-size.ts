/** ファイル選択とカタログの確認表示で同じ単位・丸め方を使う。 */
export const formatFileSize = (bytes: number) => {
  let size = bytes;
  let unit = "B";
  for (const next of ["KB", "MB", "GB", "TB"]) {
    if (size < 1024) break;
    size /= 1024;
    unit = next;
  }
  return `${new Intl.NumberFormat("ja-JP", { maximumFractionDigits: 1 }).format(size)} ${unit}`;
};
