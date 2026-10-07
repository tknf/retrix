import { rm } from "node:fs/promises";

// このリポジトリの生成物だけを消し、使わなくなったエントリが配布物へ残らないようにする。
await rm(new URL("../dist/", import.meta.url), { recursive: true, force: true });
