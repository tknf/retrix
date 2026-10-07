import type { Root } from "postcss";
export const controlTextErrors: (root: Root, path: string) => string[];
export const controlMarkupErrors: (source: string, path: string) => string[];
