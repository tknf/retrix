import type { Child } from "hono/jsx";
import { Button } from "./button";
import { Icon, type IconName } from "./icon";
import { classes, type ElementProps } from "./types";

export type TextEditorTool =
  | "bold"
  | "italic"
  | "strike"
  | "link"
  | "heading"
  | "quote"
  | "code"
  | "bullets"
  | "numbers"
  | "attach"
  | "undo"
  | "redo";

/** ツールの名前とアイコン。どのエディターとも、ボタンのdata-text-editor-toolの名前でつなぐ。 */
const tools: Record<TextEditorTool, { label: string; icon: IconName }> = {
  bold: { label: "太字", icon: "bold" },
  italic: { label: "斜体", icon: "italic" },
  strike: { label: "取り消し線", icon: "strike" },
  link: { label: "リンク", icon: "link" },
  heading: { label: "見出し", icon: "heading" },
  quote: { label: "引用", icon: "quote" },
  code: { label: "コード", icon: "code" },
  bullets: { label: "箇条書き", icon: "bullets" },
  numbers: { label: "番号付きの箇条書き", icon: "numbers" },
  attach: { label: "ファイルを添える", icon: "attach" },
  undo: { label: "元に戻す", icon: "undo" },
  redo: { label: "やり直す", icon: "redo" },
};

export type TextEditorProps = Omit<ElementProps<"textarea">, "children"> & {
  /**
   * 入力エリアのID。textareaに付け、ツールバーのaria-controlsが指す。
   * editorを渡す時は、その入力エリアの要素に同じIDを付ける。
   */
  id: string;
  /** 入力エリアの読み上げ名。ツールバーの名前（「〜の書式」）にも使う。editorを渡した時は入力エリアに付かない。 */
  label: string;
  /** ツールバーに並べるツール。"|"で区切りを入れる。 */
  tools?: readonly (TextEditorTool | "|")[];
  /** ツールを入力エリアの上（コメントなど、既定）と下（返信・日記など）のどちらに置くか。 */
  placement?: "top" | "bottom";
  /**
   * 入力エリアの代わりに置くエディター（リッチテキストエディターが描くcontenteditableの要素）。渡さなければtextareaを置く。
   * ツールバーのidは`${id}-toolbar`。エディターとのつなぎ方は、下のTextEditorの説明を参照。
   */
  editor?: Child;
  /** ツールバーの末尾に置く操作（送信・下書きの保存など）。 */
  actions?: Child;
};

/**
 * 返信や日記、コメントに使う、書式ツールを並べた入力エリア。
 * 見た目とツールバーだけを持ち、特定のエディターには依存しない。書式を付ける動きは利用側のエディターに任せ、
 * ツールのボタンのdata-text-editor-tool（"bold"など）を読んでエディターの操作を呼び、今の書式のツールには
 * data-active="true"を付ける。textareaのままの時も、ツールを動かすのは利用側（記号を差し込むなど）。
 * ツールを使わない時はtoolsを空にする。ツールも操作も無い時は、ツールバーを描かない。
 * ツールバーはToolbarControllerで一つのTab停止点にし、矢印キーでツールの間を移る。
 * ツールはJavaScriptで動くものなので、controllerが付くまではTabで止めない。
 */
export const TextEditor = ({
  id,
  label,
  tools: items = [
    "bold",
    "italic",
    "strike",
    "link",
    "|",
    "heading",
    "quote",
    "code",
    "bullets",
    "numbers",
    "|",
    "attach",
    "|",
    "undo",
    "redo",
  ],
  placement = "top",
  editor,
  actions,
  value,
  class: className,
  ...attributes
}: TextEditorProps) => {
  const groups: TextEditorTool[][] = [[]];
  for (const item of items) {
    if (item === "|") groups.push([]);
    else groups.at(-1)?.push(item);
  }
  const hasActions = actions != null && actions !== false;
  const hasTools = groups.some((group) => group.length > 0);
  return (
    <div class={classes("rx-text-editor", className)} data-placement={placement}>
      {(hasTools || hasActions) && (
        <div
          class="toolbar"
          id={`${id}-toolbar`}
          role="toolbar"
          aria-label={`${label}の書式`}
          aria-controls={id}
          data-controller="toolbar"
        >
          {groups
            .filter((group) => group.length > 0)
            .map((group) => (
              <span class="group">
                {group.map((tool) => {
                  const { label: name, icon } = tools[tool];
                  return (
                    <Button
                      variant="link"
                      data-icon-only="true"
                      size="compact"
                      aria-label={name}
                      title={name}
                      tabindex={-1}
                      disabled={attributes.disabled}
                      data-toolbar-target="control"
                      data-text-editor-tool={tool}
                    >
                      <Icon name={icon} />
                    </Button>
                  );
                })}
              </span>
            ))}
          {hasActions && <span class="actions">{actions}</span>}
        </div>
      )}
      <div class="area">
        {editor != null && editor !== false ? (
          editor
        ) : (
          // textareaのvalue属性はブラウザが初期値として読まないので、中身として書く。
          <textarea {...attributes} id={id} class="input" aria-label={label}>
            {value}
          </textarea>
        )}
      </div>
    </div>
  );
};
