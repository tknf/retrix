import { ActionLink, Button, Tooltip } from "../../src/hono";

export default () => (
  <div class="rx-cluster">
    <Tooltip
      id="tooltip-button"
      text="この設定は公開後も変更できます。"
      trigger={(attributes) => <Button {...attributes}>共有範囲</Button>}
    />
    <Tooltip
      id="tooltip-link"
      text="設定画面を開きます。"
      trigger={(attributes) => (
        <ActionLink {...attributes} href="/apps/settings">
          設定へ
        </ActionLink>
      )}
    />
  </div>
);
