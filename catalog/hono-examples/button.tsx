import { Button, ActionLink, Icon } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <div class="rx-cluster">
      <Button variant="primary">保存する</Button>
      <Button>キャンセル</Button>
    </div>
    <div class="rx-cluster">
      <Button size="compact" variant="primary">
        保存する
      </Button>
      <Button size="compact">キャンセル</Button>
    </div>
    <div class="rx-cluster">
      <Button size="large" variant="primary">
        保存する
      </Button>
      <Button size="large">キャンセル</Button>
    </div>
    <div class="rx-cluster">
      {(["primary", "secondary", "danger", "link"] as const).map((variant) => (
        <Button variant={variant}>{variant}の操作</Button>
      ))}
      <Button size="compact">小さな補助操作</Button>
      <Button disabled>変更なし</Button>
      <Button busy busyLabel="保存中…">
        保存する
      </Button>
      <Button variant="primary" busy busyLabel="公開中…">
        公開する
      </Button>
      <ActionLink href="/apps/schedule" variant="link">
        予定を開く
      </ActionLink>
    </div>
    <section class="rx-stack" aria-label="アイコン付きの操作">
      <h3>アイコンと文字</h3>
      {(["default", "compact", "large"] as const).map((size) => (
        <div class="rx-stack">
          <p>{size === "default" ? "通常" : size === "compact" ? "compact" : "large"}</p>
          <div class="rx-cluster">
            <Button size={size} variant="primary">
              <Icon name="pencil" />
              編集する
            </Button>
            <Button size={size}>
              確定する
              <Icon name="check" />
            </Button>
            <ActionLink size={size} href="/apps/schedule">
              予約へ
              <Icon name="arrow" />
            </ActionLink>
            <Button size={size} data-icon-only="true" aria-label="プレビュー" title="プレビュー">
              <Icon name="eye" />
            </Button>
          </div>
        </div>
      ))}
      <h3>アイコンのみ：背景と枠線</h3>
      {(
        [
          { variant: "primary", label: "塗り背景", icon: "check", action: "確定する" },
          { variant: "secondary", label: "枠線付き", icon: "pencil", action: "編集する" },
          { variant: "link", label: "背景・枠線なし", icon: "eye", action: "プレビュー" },
          { variant: "danger", label: "危険操作", icon: "trash", action: "削除する" },
        ] as const
      ).map(({ variant, label, icon, action }) => (
        <div class="rx-stack">
          <p>{label}</p>
          <div class="rx-cluster">
            {(["default", "compact", "large"] as const).map((size) => (
              <Button
                size={size}
                variant={variant}
                data-icon-only="true"
                aria-label={action}
                title={action}
              >
                <Icon name={icon} />
              </Button>
            ))}
            <Button
              variant={variant}
              data-icon-only="true"
              disabled
              aria-label={action}
              title={`${action}（無効）`}
            >
              <Icon name={icon} />
            </Button>
          </div>
        </div>
      ))}
      <p>各行は通常・compact・large・無効の順です。</p>
      <h3>アイコン付きの無効・処理中</h3>
      <div class="rx-cluster">
        <Button disabled>
          <Icon name="pencil" />
          編集する
        </Button>
        <Button disabled data-icon-only="true" aria-label="プレビュー" title="プレビュー">
          <Icon name="eye" />
        </Button>
        <Button busy busyLabel="保存中…">
          <Icon name="check" />
          保存する
        </Button>
      </div>
    </section>
  </div>
);
