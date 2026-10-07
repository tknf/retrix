import type { Child, PropsWithChildren } from "hono/jsx";
import { classes, type ElementProps } from "./types";
import { Icon } from "./icon";

/** Fieldが入力へ渡す属性。入力の要素へそのまま展開する。 */
export type ControlAttributes = {
  /** Fieldのid。ラベルのforが指す。 */
  id: string;
  /** describedBy・補足・エラーのidを空白で並べたもの。どれも無ければ付かない。 */
  "aria-describedby"?: string;
  /** errorがある時だけ"true"。 */
  "aria-invalid"?: "true";
  /** errorがある時だけ"true"。赤い枠線の表示に使う。 */
  "data-invalid"?: "true";
};
export type FieldProps = {
  /** 入力のid。ラベルのforと補足・エラーのidの元になる。画面内で一意にする。 */
  id: string;
  /** 入力の上に出すラベル。読み上げの名前になる。 */
  label: string;
  /** 入力の下に出す灰色の小さな補足。入力の説明として読み上げる。現在値は置かない。 */
  help?: string;
  /** 直す所を書くエラー文。渡すと入力をaria-invalidにし、説明として読み上げる。 */
  error?: string;
  /** 補足・エラーより前に説明として関連付ける、ほかの要素のid。 */
  describedBy?: string;
  /** ラベルの行の末尾に並べる状態（保存の状態やBadgeなど）。 */
  status?: Child;
  /** 入力を描画する関数。受け取った属性（ControlAttributes）を入力の要素へ展開する。 */
  children: (attributes: ControlAttributes) => Child;
};
/** ラベル・入力・補足・エラーを並べ、読み上げの関連付けを作る。入力そのものはchildrenで描画する。 */
export const Field = ({ id, label, help, error, describedBy, status, children }: FieldProps) => {
  const ids =
    [describedBy, help ? `${id}-help` : undefined, error ? `${id}-error` : undefined]
      .filter(Boolean)
      .join(" ") || undefined;
  const attributes = {
    id,
    "aria-describedby": ids,
    "aria-invalid": error ? "true" : undefined,
    "data-invalid": error ? "true" : undefined,
  } satisfies ControlAttributes;
  return (
    <div class="rx-field">
      <div class="heading">
        <label for={id}>{label}</label>
        {status}
      </div>
      {children(attributes)}
      {(help || error) && (
        <div class="messages">
          {help && (
            <p class="help" id={`${id}-help`}>
              <span>{help}</span>
            </p>
          )}
          {error && (
            <p class="error" id={`${id}-error`}>
              <Icon name="x-circle" />
              <span>{error}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export type FieldGroupProps = PropsWithChildren<
  ElementProps<"fieldset"> & {
    /** まとまりの見出し。fieldsetのlegendになり、中の入力のまとまりの名前として読み上げる。 */
    legend: string;
    /** まとまりの説明。広い配置では左の列に、狭い配置では入力の上に出す。省略すると入力に全幅を使う。 */
    description?: string;
  }
>;
/** 見出しと説明を持つ入力のまとまり。disabledを渡すと中の入力をまとめて使えなくする。 */
export const FieldGroup = ({
  children,
  legend,
  description,
  class: className,
  ...attributes
}: FieldGroupProps) => (
  <fieldset {...attributes} class={classes("rx-field-group", className)}>
    <legend>{legend}</legend>
    <div class="layout">
      {description && <p class="description">{description}</p>}
      <div class="fields">{children}</div>
    </div>
  </fieldset>
);

/** 一行の入力。標準のinputの属性をそのまま渡す。 */
export const Input = ({ class: className, ...attributes }: ElementProps<"input">) => (
  <input {...attributes} class={classes("rx-input", className)} />
);
/** 複数行の入力。標準のtextareaの属性をそのまま渡し、初期値はchildrenに書く。 */
export const Textarea = ({ class: className, ...attributes }: ElementProps<"textarea">) => (
  <textarea {...attributes} class={classes("rx-input", className)} />
);
/** 決まった選択肢から選ぶ入力。標準のselectの属性とoptionをそのまま渡す。 */
export const Select = ({ class: className, ...attributes }: ElementProps<"select">) => (
  <select {...attributes} class={classes("rx-input", className)} />
);

export type ChoiceProps = ElementProps<"input"> & {
  /** 選択肢の名前。マークの横に出し、labelで包んで押せる範囲にする。 */
  label: string;
  /** 名前の下に添える灰色の小さな説明。渡すと名前を太字にする。 */
  description?: Child;
  /** plainはマークと名前だけ、optionは説明を伴う選択肢を枠で囲んだ白い面に載せ、選ぶと淡い青緑の面と青緑の枠にする。 */
  kind?: "plain" | "option";
  /** checkboxは個別のオン・オフ、radioは同じnameの中から一つを選ぶ。 */
  type?: "checkbox" | "radio";
};
/** チェックボックスかラジオボタンと、その名前。残りの属性はinputへ渡す。 */
export const Choice = ({
  label,
  description,
  kind = "plain",
  type = "checkbox",
  class: className,
  ...attributes
}: ChoiceProps) => (
  <label class="rx-choice" data-kind={kind}>
    <input {...attributes} type={type} class={className} />
    <span>
      <strong>{label}</strong>
      {description != null && description !== false && <small>{description}</small>}
    </span>
  </label>
);
