import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, readlinkSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// エージェント・スキルの一覧と、秘密情報のパスがgitから外れていることを確かめる。
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const read = (path) => readFileSync(resolve(root, path), "utf8");

const expectedAgents = ["researcher.toml", "reviewer.toml", "worker.toml"];
const actualAgents = readdirSync(resolve(root, ".codex/agents"))
  .filter((path) => path.endsWith(".toml"))
  .sort();
if (JSON.stringify(actualAgents) !== JSON.stringify(expectedAgents))
  errors.push(`エージェントの一覧が想定と違う: ${actualAgents.join(", ")}`);
for (const file of expectedAgents) {
  const source = read(`.codex/agents/${file}`);
  const name = file.slice(0, -".toml".length);
  if (!source.includes(`name = "${name}"`)) errors.push(`${file}の名前が違う`);
  const sandbox = file === "worker.toml" ? "workspace-write" : "read-only";
  if (!source.includes(`sandbox_mode = "${sandbox}"`)) errors.push(`${file}は${sandbox}にする`);
}

const expectedSkills = ["impl", "issue", "plan", "release"];
const actualSkills = readdirSync(resolve(root, ".agents/skills"))
  .filter((name) => existsSync(resolve(root, ".agents/skills", name, "SKILL.md")))
  .sort();
if (JSON.stringify(actualSkills) !== JSON.stringify(expectedSkills))
  errors.push(`スキルの一覧が想定と違う: ${actualSkills.join(", ")}`);
for (const name of actualSkills)
  if (!read(`.agents/skills/${name}/SKILL.md`).startsWith(`---\nname: ${name}\n`))
    errors.push(`${name}/SKILL.mdのfrontmatterが不正`);
for (const command of ["`$plan`を使う", "`$impl`を使う"])
  if (actualSkills.includes("issue") && read(".agents/skills/issue/SKILL.md").includes(command))
    errors.push(`$issueが段階を呼んでいる: ${command}`);

// Claude Codeは.claude/skillsから同じスキルを読む。
try {
  if (readlinkSync(resolve(root, ".claude/skills")) !== "../.agents/skills")
    errors.push(".claude/skillsは../.agents/skillsへのリンクにする");
} catch {
  errors.push(".claude/skillsのリンクがない");
}

// 利用者が入れるAgent Skill。
if (!read("skills/retrix/SKILL.md").startsWith("---\nname: retrix\n"))
  errors.push("skills/retrix/SKILL.mdのfrontmatterが不正");
if (!existsSync(resolve(root, "skills/retrix/references/components.md")))
  errors.push("skills/retrix/references/components.mdがない（vp run docs:componentsで生成する）");

const isIgnored = (path) => {
  try {
    execFileSync("git", ["check-ignore", "--no-index", "--quiet", path], {
      cwd: root,
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
};
for (const path of [".env", ".env.local", "secrets/example"])
  if (!isIgnored(path)) errors.push(`秘密情報のパスがgitから外れていない: ${path}`);
if (isIgnored(".env.example")) errors.push(".env.exampleがgitから外れている");

if (errors.length > 0) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}
console.log("エージェント・スキル・秘密情報のパスの構成を確認しました。");
