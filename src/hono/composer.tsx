import type { Child } from "hono/jsx";
import { Button } from "./button";
import { Field, Textarea } from "./field";
import { Icon } from "./icon";
import { classes, type ElementProps } from "./types";

export type ComposerProps = Omit<ElementProps<"form">, "children"> & {
  /** formのID。本文の欄のIDの接頭辞にも使う。 */
  id: string;
  /** 本文の欄の名前。題名の行の先頭に出す。 */
  label: string;
  /** 本文を送るフィールドの名前。editorを渡した時は使わない。 */
  name: string;
  /** 本文の初期値。editorを渡した時は使わない。 */
  value?: string;
  /** 本文の欄のプレースホルダー。editorを渡した時は使わない。 */
  placeholder?: string;
  /**
   * 本文の欄の行数。field-sizingに対応しないブラウザでの高さになる。
   * 対応するブラウザでは4行から書いた分だけ伸び（20行まで）、この値は使わない。
   */
  rows?: number;
  /** 本文が空の時に送信を止める。editorを渡した時は使わない。 */
  required?: boolean;
  /** 送信ボタンの文言（「送信する」「投稿する」など）。 */
  submitLabel: string;
  /** 送信中にする。送信ボタンを「送信中…」にして押せなくし、formにaria-busyを付ける。 */
  busy?: boolean;
  /**
   * 本文の欄の下に出すエラー文。本文の欄をaria-invalidにする。
   * editorを渡した時もエディターの下に出し、`<id>-body-error`のIDでエディターを包む要素の説明にする。
   * 入力エリアそのもののaria-invalidとaria-describedbyはエディターの側で付ける。
   */
  error?: string;
  /** 本文の下に置く添付（FileInputや選んだファイルの一覧など）。 */
  attachments?: Child;
  /** 下の行の先頭側に並べる操作（添付・書式・下書きの保存など）。送信ボタンは末尾側に置く。 */
  actions?: Child;
  /** 見出しで、名前の隣へ置く宛先（人やチャンネル）。 */
  to?: Child;
  /** 見出しの右端に置く状態（下書きの保存など）。 */
  status?: Child;
  /**
   * 本文の欄の代わりに置くエディター（リッチテキストエディターやcontenteditableなど）。
   * 渡すと本文の文字と入力エリア全体のフォーカスリングはこのエディターに適用し、送信する値の受け渡しもエディターの側で行う。
   */
  editor?: Child;
};

/** 見出しに並べる、宛先と状態。 */
const headingExtras = (to: Child, status: Child) => (
  <>
    {to != null && to !== false && <span class="to">{to}</span>}
    {status != null && status !== false && <span class="status">{status}</span>}
  </>
);

/** 本文と添付、送信操作の配置。送信先と保存処理は利用側が指定する。 */
export const Composer = ({
  id,
  label,
  name,
  value,
  placeholder,
  rows = 4,
  required,
  submitLabel,
  busy = false,
  error,
  attachments,
  actions,
  to,
  status,
  editor,
  class: className,
  ...attributes
}: ComposerProps) => (
  <form {...attributes} id={id} class={classes("rx-composer", className)} aria-busy={busy}>
    {editor != null && editor !== false ? (
      <div class="rx-field">
        <div class="heading">
          <span class="label" id={`${id}-body-label`}>
            {label}
          </span>
          {headingExtras(to, status)}
        </div>
        <div
          class="editor"
          role="group"
          aria-labelledby={`${id}-body-label`}
          aria-describedby={error ? `${id}-body-error` : undefined}
          data-invalid={error ? "true" : undefined}
        >
          {editor}
        </div>
        {error && (
          <div class="messages">
            <p class="error" id={`${id}-body-error`}>
              <Icon name="x-circle" />
              <span>{error}</span>
            </p>
          </div>
        )}
      </div>
    ) : (
      <Field id={`${id}-body`} label={label} error={error} status={headingExtras(to, status)}>
        {(field) => (
          <Textarea
            {...field}
            name={name}
            rows={rows}
            required={required}
            placeholder={placeholder}
          >
            {value}
          </Textarea>
        )}
      </Field>
    )}
    {attachments && <div class="attachments">{attachments}</div>}
    <div class="footer">
      {actions && <div class="actions">{actions}</div>}
      <Button type="submit" variant="primary" busy={busy} busyLabel="送信中…">
        {submitLabel}
      </Button>
    </div>
  </form>
);
