@AGENTS.md

## Claude Codeでの読み替え

`AGENTS.md`と`.agents/skills/`のワークフローのスキル（`.claude/skills/`から参照する）は、Codexの役割と呼び出しで書いています。Claude Codeでは次のように読み替え、それ以外の決まりはそのまま守ります。

- Claude Codeのメインのセッションが、主セッションで作業の持ち主です。
- `$issue`・`$plan`・`$impl`・`$release`は、`/issue`・`/plan`・`/impl`・`/release`のスキルです。
- `researcher`は、組み込みの`Explore`サブエージェントです。
- `reviewer`は、今の差分への`/code-review`です（`/release`ではステージした公開の差分）。セキュリティのリスクがある変更には`/security-review`も使います。指摘はメインのセッションが確かめ、再レビューは一度までにします。
- `worker`は`general-purpose`サブエージェントです。依頼には、他と重ならないパス、変換、受け入れ条件、検証のコマンドを書きます。動いている間、メインのセッションはリポジトリや外部の状態を変えません。
- `.codex/agents/*.toml`の設定（`model`、`model_reasoning_effort`、`sandbox_mode`）に当たるものはClaude Codeにありません。読み取りだけの役割には、読み取りだけのサブエージェントを使います。
