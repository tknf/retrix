import { expect, test } from "vite-plus/test";
import { formatFileSize } from "../src/internal/file-size";

test.each([
  [0, "0 B"],
  [1023, "1,023 B"],
  [1024, "1 KB"],
  [1536, "1.5 KB"],
  [1024 ** 2, "1 MB"],
  [1024 ** 3, "1 GB"],
  [2 * 1024 ** 4, "2 TB"],
] as const)("%iバイトを%sとして表示する", (bytes, label) => {
  expect(formatFileSize(bytes)).toBe(label);
});
