import { readFileSync } from "node:fs";
import path from "node:path";
import postcss from "postcss";
import ts from "typescript";

/** 表の一行。requiredは全ての形で必須なら"yes"、形によって必須なら"some"。 */
export type PropDoc = {
  name: string;
  type: string;
  required: "yes" | "no" | "some";
  defaultValue?: string;
  description: string;
};

/** propsから参照する型。オブジェクトは形ごとの表、文字の選択肢は値を持つ。 */
export type TypeDoc = {
  name: string;
  description: string;
  values?: string;
  /** propsの型に直接書いたオブジェクト型なら、nameはそのpropsの名前（`items`、`Calendar.details`など）。 */
  inline?: boolean;
  /** 型を宣言したファイル。 */
  file: string;
  /** 別の公開コンポーネントのprops型なら、そのコンポーネント名。 */
  component?: string;
  variants: { label?: string; props: PropDoc[] }[];
};

export type ComponentApi = {
  name: string;
  description: string;
  file: string;
  props: PropDoc[];
  /** 残りのpropsを渡す要素。HTML要素なら小文字、Retrixのコンポーネントならコンポーネント名。渡さない時はundefined。 */
  element?: string;
  types: TypeDoc[];
  controllers: string[];
  stylesheets: string[];
};

/** リポジトリのルート。スクリプト・テスト・カタログはいずれもルートで実行する。 */
const ROOT = process.cwd();
const ENTRY = path.join(ROOT, "src/hono/index.ts");
const CONTROLLERS = path.join(ROOT, "src/controllers/index.ts");

const isOwn = (node: ts.Node) => node.getSourceFile().fileName.startsWith(path.join(ROOT, "src"));
const withoutComments = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
const oneLine = (text: string) => text.replace(/\s+/g, " ").replace(/\(\s/g, "(").trim();
/** JSDocの本文。日本語の行の折り返しは空白を挟まずにつなぐ。 */
const docOf = (symbol: ts.Symbol, checker: ts.TypeChecker) =>
  ts
    .displayPartsToString(symbol.getDocumentationComment(checker))
    .trim()
    .replace(/([^ -~])\s*\n\s*(?=[^ -~])/g, "$1")
    .replace(/\s*\n\s*/g, " ");

/** src/controllers/index.tsが公開するcontroller名。登録名はkebab-caseにしたもの。 */
const readControllers = () => {
  const text = readFileSync(CONTROLLERS, "utf8");
  const names = [...text.matchAll(/\b([A-Z][A-Za-z]*)Controller\b/g)].map((match) => match[1]);
  return new Map(
    [...new Set(names)].map((name) => [
      name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
      `${name}Controller`,
    ]),
  );
};

/**
 * CSSとそのCSSが受け持つルートクラス。入れ子でない規則のセレクタの先頭に書いたクラスを受け持つ。
 * 入れ子の規則や、先頭以外に書いたクラス（`.rx-card .rx-input`など）は、置かれた場所での調整として数えない。
 */
const readStylesheets = () => {
  const text = readFileSync(path.join(ROOT, "src/hono/stylesheets.ts"), "utf8");
  const files = [...text.matchAll(/"([^"]+\.css)"/g)].map((match) => match[1]);
  return files.map((file) => {
    const classes = new Set<string>();
    postcss.parse(readFileSync(path.join(ROOT, "src/css", file), "utf8")).walkRules((rule) => {
      if (rule.parent?.type === "rule") return;
      for (const selector of rule.selectors) {
        const head = selector.trim().match(/^(?::(?:where|is)\()?\.(rx-[a-z0-9-]+)/);
        if (head) classes.add(head[1]);
        for (const listed of selector.matchAll(/^:(?:where|is)\(([^)]*)\)/g))
          for (const part of listed[1].split(","))
            classes.add(part.trim().match(/^\.(rx-[a-z0-9-]+)/)?.[1] ?? "");
      }
    });
    classes.delete("");
    return { file, classes };
  });
};

const BASE_STYLESHEETS = ["layers.css", "reset.css", "tokens.css", "base.css", "layout.css"];

/** 公開コンポーネントの関数本体。const X = (props) => …またはfunction X(props)。 */
const functionOf = (symbol: ts.Symbol) => {
  for (const declaration of symbol.declarations ?? []) {
    if (ts.isFunctionDeclaration(declaration)) return declaration;
    if (
      ts.isVariableDeclaration(declaration) &&
      declaration.initializer &&
      (ts.isArrowFunction(declaration.initializer) ||
        ts.isFunctionExpression(declaration.initializer))
    )
      return declaration.initializer;
  }
  return undefined;
};

/** 引数の分割代入。引数が識別子なら、本体でその識別子を分割代入した箇所を使う。 */
const bindingOf = (fn: ts.SignatureDeclaration & { body?: ts.Node }) => {
  const parameter = fn.parameters[0];
  if (!parameter) return undefined;
  if (ts.isObjectBindingPattern(parameter.name)) return parameter.name;
  const name = parameter.name.getText();
  let found: ts.ObjectBindingPattern | undefined;
  const visit = (node: ts.Node) => {
    if (
      !found &&
      ts.isVariableDeclaration(node) &&
      ts.isObjectBindingPattern(node.name) &&
      node.initializer?.getText() === name
    )
      found = node.name;
    ts.forEachChild(node, visit);
  };
  if (fn.body) visit(fn.body);
  return found;
};

const bindingDetails = (binding: ts.ObjectBindingPattern | undefined) => {
  const defaults = new Map<string, string>();
  const names = new Set<string>();
  let rest: string | undefined;
  for (const element of binding?.elements ?? []) {
    if (element.dotDotDotToken) {
      rest = element.name.getText();
      continue;
    }
    const name = (element.propertyName ?? element.name).getText();
    names.add(name);
    if (element.initializer) defaults.set(name, oneLine(element.initializer.getText()));
  }
  return { defaults, names, rest };
};

/**
 * 残りのpropsを`{...rest}`で受け取るJSXの要素名。HTML要素なら小文字、公開するコンポーネントならコンポーネント名。
 * 公開しない内部のコンポーネントへ渡す場合は、そのコンポーネントが受け取った先をたどる。
 */
const spreadTarget = (
  fn: ts.SignatureDeclaration & { body?: ts.Node },
  rest: string,
  checker: ts.TypeChecker,
  isPublic: (name: string) => boolean,
  depth = 0,
): string | undefined => {
  let found: ts.JsxOpeningElement | ts.JsxSelfClosingElement | undefined;
  const visit = (node: ts.Node) => {
    if (found) return;
    if (ts.isJsxSpreadAttribute(node) && node.expression.getText() === rest) {
      const owner = node.parent.parent;
      if (ts.isJsxOpeningElement(owner) || ts.isJsxSelfClosingElement(owner)) found = owner;
    }
    ts.forEachChild(node, visit);
  };
  visit(fn);
  if (!found) return undefined;
  const tag = found.tagName.getText();
  if (!/^[A-Z]/.test(tag) || isPublic(tag) || depth > 3) return tag;
  let symbol = checker.getSymbolAtLocation(found.tagName);
  if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
  // `const Control = number ? NumberField : Input`のようにコンポーネントを選ぶ場合は、選べるコンポーネントを並べる。
  const declaration = symbol?.declarations?.[0];
  if (
    declaration &&
    ts.isVariableDeclaration(declaration) &&
    declaration.initializer &&
    ts.isConditionalExpression(declaration.initializer)
  ) {
    const branches = [declaration.initializer.whenTrue, declaration.initializer.whenFalse].map(
      (branch) => branch.getText(),
    );
    if (branches.every(isPublic)) return branches.join("・");
  }
  const inner = symbol && functionOf(symbol);
  const innerRest = inner && bindingDetails(bindingOf(inner)).rest;
  return inner && innerRest
    ? spreadTarget(inner, innerRest, checker, isPublic, depth + 1)
    : undefined;
};

/** 宣言に書かれた型の文字列。書かれていなければcheckerが推論した型。省略できることは必須の列で示す。 */
const typeText = (symbol: ts.Symbol, checker: ts.TypeChecker, at: ts.Node) => {
  const declaration = symbol.declarations?.[0];
  const text =
    declaration &&
    (ts.isPropertySignature(declaration) || ts.isPropertyDeclaration(declaration)) &&
    declaration.type
      ? oneLine(withoutComments(declaration.type.getText()))
      : checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, at));
  return text.replace(/ \| undefined$/, "").replaceAll("'", '"');
};

const isNever = (symbol: ts.Symbol, checker: ts.TypeChecker, at: ts.Node) =>
  (checker.getTypeOfSymbolAtLocation(symbol, at).flags & ts.TypeFlags.Never) !== 0 ||
  typeText(symbol, checker, at) === "never";

const isOptional = (symbol: ts.Symbol) => (symbol.flags & ts.SymbolFlags.Optional) !== 0;

/** unionの各形のプロパティを名前でまとめる。neverにした名前はその形に無いものとして扱う。 */
const mergeProps = (
  constituents: readonly ts.Type[],
  checker: ts.TypeChecker,
  at: ts.Node,
  include: (symbol: ts.Symbol) => boolean,
) => {
  const merged = new Map<
    string,
    { symbol: ts.Symbol; symbols: ts.Symbol[]; types: string[]; required: boolean[] }
  >();
  for (const constituent of constituents)
    for (const symbol of checker.getPropertiesOfType(constituent)) {
      if (
        !include(symbol) ||
        isNever(symbol, checker, at) ||
        typeText(symbol, checker, at) === "never"
      )
        continue;
      const entry = merged.get(symbol.name) ?? { symbol, symbols: [], types: [], required: [] };
      entry.symbols.push(symbol);
      const text = typeText(symbol, checker, at);
      if (!entry.types.includes(text)) entry.types.push(text);
      entry.required.push(!isOptional(symbol));
      merged.set(symbol.name, entry);
    }
  return [...merged.values()].map(({ symbol, symbols, types, required }) => ({
    symbol,
    /** unionのどれか一つの形に書いたJSDoc。 */
    description: symbols.map((candidate) => docOf(candidate, checker)).find(Boolean) ?? "",
    type: types.join(" | "),
    required:
      required.length === constituents.length && required.every(Boolean)
        ? ("yes" as const)
        : required.some(Boolean)
          ? ("some" as const)
          : ("no" as const),
  }));
};

const constituentsOf = (type: ts.Type) => (type.isUnion() ? type.types : [type]);

/** 型の文字列に現れる、src内で宣言した型の名前を集める。 */
const referencedTypes = (
  node: ts.Node | undefined,
  checker: ts.TypeChecker,
  found: Set<ts.Symbol>,
) => {
  if (!node) return;
  const visit = (child: ts.Node) => {
    if (ts.isTypeReferenceNode(child)) {
      let symbol = checker.getSymbolAtLocation(child.typeName);
      if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
      const declaration = symbol?.declarations?.[0];
      if (
        symbol &&
        declaration &&
        isOwn(declaration) &&
        (ts.isTypeAliasDeclaration(declaration) || ts.isInterfaceDeclaration(declaration))
      )
        found.add(symbol);
    }
    ts.forEachChild(child, visit);
  };
  visit(node);
};

const declaredTypeNode = (symbol: ts.Symbol) => {
  const declaration = symbol.declarations?.[0];
  return declaration && ts.isPropertySignature(declaration) ? declaration.type : undefined;
};

/**
 * 各形を見分ける名前。どの形でも文字の値だけを取るプロパティ（kind・modeなど）があればその値、
 * 無ければ他の形に無いプロパティの名前。
 */
const variantLabel = (
  constituent: ts.Type,
  all: readonly ts.Type[],
  checker: ts.TypeChecker,
  at: ts.Node,
) => {
  if (all.length < 2) return undefined;
  const present = (type: ts.Type) =>
    checker.getPropertiesOfType(type).filter((symbol) => !isNever(symbol, checker, at));
  const literals = (type: ts.Type, name: string) => {
    const symbol = present(type).find((candidate) => candidate.name === name);
    if (!symbol) return undefined;
    const parts = constituentsOf(
      checker.getNonNullableType(checker.getTypeOfSymbolAtLocation(symbol, at)),
    );
    return parts.length <= 3 && parts.every((part) => part.isStringLiteral())
      ? parts.map((part) => checker.typeToString(part)).join(" | ")
      : undefined;
  };
  const discriminant = present(constituent).find((symbol) =>
    all.every((other) => literals(other, symbol.name) !== undefined),
  );
  if (discriminant) return `${discriminant.name}: ${literals(constituent, discriminant.name)}`;
  const unique = present(constituent).filter(
    (symbol) =>
      !all.some(
        (other) =>
          other !== constituent &&
          present(other).some((candidate) => candidate.name === symbol.name),
      ),
  );
  return unique.length > 0
    ? `${unique.map((symbol) => symbol.name).join("・")}を持つ形`
    : undefined;
};

/** src/hono/index.tsが公開する全コンポーネントのprops・参照する型・controller・CSS。 */
export const readComponentApi = () => {
  const config = ts.readConfigFile(path.join(ROOT, "tsconfig.json"), (file) =>
    ts.sys.readFile(file),
  );
  const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, ROOT);
  const program = ts.createProgram([ENTRY], { ...options, noEmit: true });
  const checker = program.getTypeChecker();
  const entry = program.getSourceFile(ENTRY);
  const moduleSymbol = entry && checker.getSymbolAtLocation(entry);
  if (!moduleSymbol) throw new Error("src/hono/index.tsを読めません");
  const controllerNames = readControllers();
  const stylesheets = readStylesheets();

  const components = new Map<string, ts.Symbol>();
  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    const symbol =
      exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    if (/^[A-Z]/.test(exported.name) && symbol.flags & ts.SymbolFlags.Value && functionOf(symbol))
      components.set(exported.name, symbol);
  }

  /** 関数本体（JSXで使うsrc内の関数も含む）のdata-controllerの値と、rx-のクラス名。 */
  type Usage = { controllers: Set<string>; classes: Set<string> };
  const usage = new Map<ts.Node, Usage>();
  const usageOf = (fn: ts.Node): Usage => {
    const cached = usage.get(fn);
    if (cached) return cached;
    const result: Usage = { controllers: new Set(), classes: new Set() };
    usage.set(fn, result);
    const file = fn.getSourceFile();
    const scanned = new Set<ts.Node>();
    const scanStrings = (node: ts.Node, collect: (text: string) => void) => {
      if (scanned.has(node)) return;
      scanned.add(node);
      const visit = (child: ts.Node) => {
        if (ts.isStringLiteralLike(child)) collect(child.text);
        if (ts.isIdentifier(child)) {
          const declaration = checker.getSymbolAtLocation(child)?.declarations?.[0];
          if (
            declaration &&
            declaration.getSourceFile() === file &&
            (ts.isVariableDeclaration(declaration) || ts.isFunctionDeclaration(declaration))
          )
            scanStrings(declaration, collect);
        }
        ts.forEachChild(child, visit);
      };
      visit(node);
    };
    const addController = (text: string) => {
      for (const word of text.split(/\s+/))
        if (controllerNames.has(word)) result.controllers.add(word);
    };
    const visit = (node: ts.Node) => {
      if (ts.isJsxAttribute(node) && node.name.getText() === "data-controller" && node.initializer)
        scanStrings(node.initializer, addController);
      if (ts.isStringLiteralLike(node))
        for (const match of node.text.matchAll(/(?<![-\w])rx-[a-z0-9-]+/g))
          result.classes.add(match[0]);
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        let symbol = checker.getSymbolAtLocation(node.tagName);
        if (symbol && symbol.flags & ts.SymbolFlags.Alias)
          symbol = checker.getAliasedSymbol(symbol);
        const inner = symbol && functionOf(symbol);
        if (inner && inner !== fn && isOwn(inner)) {
          const nested = usageOf(inner);
          for (const controller of nested.controllers) result.controllers.add(controller);
          for (const className of nested.classes) result.classes.add(className);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(fn);
    return result;
  };

  /** 型の中に直接書いたオブジェクト型。見出しは`items`や`Calendar.details`のようにpropsの名前にする。 */
  const inlineDocs = (node: ts.Node | undefined, label: string, queue: ts.Symbol[]): TypeDoc[] => {
    if (!node) return [];
    const literals: ts.TypeLiteralNode[] = [];
    const visit = (child: ts.Node) => {
      if (ts.isTypeLiteralNode(child)) literals.push(child);
      else ts.forEachChild(child, visit);
    };
    visit(node);
    return literals.flatMap((literal, index) => {
      const props: PropDoc[] = [];
      const nested: TypeDoc[] = [];
      const inSource = (candidate: ts.Symbol) => (candidate.declarations ?? []).some(isOwn);
      for (const merged of mergeProps(
        [checker.getTypeAtLocation(literal)],
        checker,
        literal,
        inSource,
      )) {
        props.push({
          name: merged.symbol.name,
          type: merged.type,
          required: merged.required,
          description: merged.description,
        });
        const found = new Set<ts.Symbol>();
        referencedTypes(declaredTypeNode(merged.symbol), checker, found);
        queue.push(...found);
        nested.push(
          ...inlineDocs(declaredTypeNode(merged.symbol), `${label}.${merged.symbol.name}`, queue),
        );
      }
      return [
        {
          name: literals.length > 1 ? `${label}（${index + 1}）` : label,
          inline: true,
          description: "",
          file: path.relative(ROOT, literal.getSourceFile().fileName),
          variants: [{ props }],
        },
        ...nested,
      ];
    });
  };

  const apis = new Map<string, ComponentApi>();
  for (const [name, symbol] of components) {
    const fn = functionOf(symbol);
    if (!fn) continue;
    const parameter = fn.parameters[0];
    const binding = bindingDetails(bindingOf(fn));
    const props: PropDoc[] = [];
    const types = new Set<ts.Symbol>();
    const inlineTypes: ts.Symbol[] = [];
    const typeDocs: TypeDoc[] = [];
    let element: string | undefined;
    if (parameter) {
      const type = checker.getTypeAtLocation(parameter);
      const own = (candidate: ts.Symbol) =>
        (candidate.declarations ?? []).some(isOwn) ||
        (binding.names.has(candidate.name) && candidate.name !== "class");
      for (const merged of mergeProps(constituentsOf(type), checker, parameter, own)) {
        props.push({
          name: merged.symbol.name,
          type: merged.type,
          required: merged.required,
          defaultValue: binding.defaults.get(merged.symbol.name),
          description: merged.description,
        });
        const inlineSeen = new Set<ts.Node>();
        for (const constituent of constituentsOf(type)) {
          const property = checker.getPropertyOfType(constituent, merged.symbol.name);
          const node = property && declaredTypeNode(property);
          if (!node || inlineSeen.has(node)) continue;
          inlineSeen.add(node);
          referencedTypes(node, checker, types);
          typeDocs.push(...inlineDocs(node, merged.symbol.name, inlineTypes));
        }
      }
      // Omitを通した標準属性は名前付きのpropsが消えて索引シグネチャだけになるので、それも標準属性として数える。
      const external =
        checker
          .getPropertiesOfType(constituentsOf(type)[0])
          .some((candidate) => !own(candidate) && candidate.name !== "children") ||
        checker.getIndexInfosOfType(constituentsOf(type)[0]).length > 0;
      if (external && binding.rest)
        element = spreadTarget(fn, binding.rest, checker, (tag) => components.has(tag));
    }

    const queue = [...types, ...inlineTypes];
    const nestedDocs: TypeDoc[] = [];
    const seen = new Set<ts.Symbol>();
    while (queue.length > 0) {
      const typeSymbol = queue.shift();
      if (!typeSymbol || seen.has(typeSymbol)) continue;
      seen.add(typeSymbol);
      const declaration = typeSymbol.declarations?.[0];
      if (!declaration) continue;
      const declared = checker.getDeclaredTypeOfSymbol(typeSymbol);
      const parts = constituentsOf(declared);
      const doc: TypeDoc = {
        name: typeSymbol.name,
        description: docOf(typeSymbol, checker),
        file: path.relative(ROOT, declaration.getSourceFile().fileName),
        variants: [],
      };
      const base = typeSymbol.name.replace(/Props$/, "");
      if (typeSymbol.name !== base && components.has(base)) {
        doc.component = base;
        typeDocs.push(doc);
        continue;
      }
      if (
        parts.every(
          (part) =>
            part.flags &
            (ts.TypeFlags.StringLiteral |
              ts.TypeFlags.NumberLiteral |
              ts.TypeFlags.BooleanLiteral |
              ts.TypeFlags.Undefined),
        )
      ) {
        doc.values =
          typeSymbol.name === "IconName"
            ? "docs/icons.mdの「使えるアイコン」の名前"
            : ts.isTypeAliasDeclaration(declaration)
              ? oneLine(declaration.type.getText())
              : parts.map((part) => checker.typeToString(part)).join(" | ");
      } else if (parts.every((part) => part.flags & ts.TypeFlags.Object || part.isIntersection())) {
        for (const part of parts) {
          const variantProps: PropDoc[] = [];
          const inSource = (candidate: ts.Symbol) => (candidate.declarations ?? []).some(isOwn);
          for (const merged of mergeProps([part], checker, declaration, inSource)) {
            variantProps.push({
              name: merged.symbol.name,
              type: merged.type,
              required: merged.required,
              description: merged.description,
            });
            const found = new Set<ts.Symbol>();
            referencedTypes(declaredTypeNode(merged.symbol), checker, found);
            queue.push(...found);
            nestedDocs.push(
              ...inlineDocs(
                declaredTypeNode(merged.symbol),
                `${typeSymbol.name}.${merged.symbol.name}`,
                queue,
              ),
            );
          }
          doc.variants.push({
            label: variantLabel(part, parts, checker, declaration),
            props: variantProps,
          });
        }
      } else {
        doc.values = ts.isTypeAliasDeclaration(declaration)
          ? oneLine(declaration.type.getText())
          : checker.typeToString(declared);
        const found = new Set<ts.Symbol>();
        if (ts.isTypeAliasDeclaration(declaration))
          referencedTypes(declaration.type, checker, found);
        queue.push(...found);
      }
      // unionの形のどれかに書いた説明を、同じ名前の他の形の項目にも使う。
      for (const variant of doc.variants)
        for (const prop of variant.props)
          prop.description ||=
            doc.variants
              .flatMap((other) => other.props)
              .find((other) => other.name === prop.name && other.description)?.description ?? "";
      typeDocs.push(doc, ...nestedDocs.splice(0));
    }

    const { controllers, classes } = usageOf(fn);
    const needed = new Set(BASE_STYLESHEETS);
    for (const stylesheet of stylesheets)
      if ([...classes].some((className) => stylesheet.classes.has(className)))
        needed.add(stylesheet.file);
    apis.set(name, {
      name,
      description: docOf(symbol, checker),
      file: path.relative(ROOT, fn.getSourceFile().fileName),
      props,
      element,
      types: typeDocs,
      controllers: [...controllers].map((id) => `${id}:${controllerNames.get(id)}`),
      stylesheets: stylesheets.map(({ file }) => file).filter((file) => needed.has(file)),
    });
  }
  return apis;
};
