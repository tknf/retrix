// 全コンポーネントで、独立したルートと局所の役割名を区別する。
const rootsByFile = {
  field: [
    "field",
    "field-group",
    "input",
    "choice",
    "choice-group",
    "password",
    "character-count",
    "combobox",
    "date-picker",
  ],
  "dropdown-menu": ["dropdown-menu", "menu"],
};

export const partNameErrors = (root, path) => {
  const component = path.match(/^src\/css\/components\/([\w-]+)\.css$/)?.[1];
  if (!component) return [];
  const roots = rootsByFile[component] ?? [component];
  const errors = [];
  root.walkRules((rule) => {
    const parents = [];
    for (let parent = rule; parent; parent = parent.parent)
      if (parent.type === "rule") parents.unshift(parent.selector);
    const context = parents.join(" ");
    const fail = (message) =>
      errors.push(`${path}:${rule.source?.start?.line ?? 1}: コンポーネント名: ${message}`);
    if (
      [...rule.selector.matchAll(/\.rx-([\w-]+)/g)].some(
        (match) =>
          roots.some((owner) => match[1].startsWith(`${owner}-`)) && !roots.includes(match[1]),
      )
    )
      fail("内部のクラス名に親のコンポーネント名を繰り返さず、役割名を使う");
    if (
      /\.(?!rx-)[a-z][\w-]*/.test(rule.selector) &&
      !roots.some((name) => context.includes(`.rx-${name}`))
    )
      fail("局所クラスはコンポーネントのルートから限定する");
    if (/(?:&|\.[\w-]+|\])\s+\.[\w-]+/.test(rule.selector))
      fail("入れ子のコンポーネントへ漏れないよう、局所クラスは直下の関係で指定する");
  });
  return errors;
};
