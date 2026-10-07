import { Breadcrumb } from "../../src/hono";

export default () => (
  <Breadcrumb
    items={[
      { label: "道具箱", href: "/" },
      { label: "記事", href: "/apps/search" },
      { label: "編集" },
    ]}
  />
);
