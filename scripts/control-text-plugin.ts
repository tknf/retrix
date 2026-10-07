import { relative, sep } from "node:path";
import postcss from "postcss";
import type { Plugin } from "vite-plus";
import { controlTextErrors, controlMarkupErrors } from "./control-text.mjs";

/** 起動済みの開発サーバーでも、既知の退行を更新時のエラーとして止める。 */
export const controlTextPlugin = (): Plugin => {
  let root = process.cwd();
  return {
    name: "rx-control-text",
    enforce: "pre",
    configResolved: (config) => {
      root = config.root;
    },
    transform: (source, id) => {
      const path = relative(root, id.split("?")[0] ?? id)
        .split(sep)
        .join("/");
      const errors =
        (path.startsWith("src/css/") || path === "catalog/catalog.css") && path.endsWith(".css")
          ? controlTextErrors(postcss.parse(source), path)
          : path.startsWith("src/hono/") && path.endsWith(".tsx")
            ? controlMarkupErrors(source, path)
            : [];
      if (errors.length) throw new Error(errors.join("\n"));
      return null;
    },
  };
};
