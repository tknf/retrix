import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "test/browser",
  fullyParallel: false,
  // 3ブラウザを同時に多く動かすとメモリを使い切るので、並列は2までにする。増やす時は`-j`で指定する。
  workers: 2,
  // WebKitは長時間実行するとページの移動が始まらず止まることがある（microsoft/playwright#42385）。
  // 新しいブラウザで一度だけ再試行し、再試行で通ったテストはflakyとして報告に残す。
  retries: 1,
  reporter: [["list"], ["json", { outputFile: "test-results/browser.json" }]],
  use: {
    baseURL: "http://127.0.0.1:5178",
    screenshot: "only-on-failure",
    // 全テストの操作を記録し続けると重いので、再試行した時だけ記録する。
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],
  webServer: {
    command: "vp run dev --port 5178",
    url: "http://127.0.0.1:5178",
    reuseExistingServer: false,
    timeout: 30000,
  },
});
