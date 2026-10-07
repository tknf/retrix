import { Textarea } from "./field";
import { Icon } from "./icon";
import type { ElementProps } from "./types";

export type CountedTextareaProps = ElementProps<"textarea"> & {
  /** 入力のid。文字数（`<id>-count`）と超過のエラー（`<id>-over-error`）のidの元になる。 */
  id: string;
  /** 文字数の上限。超えても入力は止めず、エラーを出して送信を止める。maxlengthを渡すとそちらを上限にする。 */
  limit: number;
  /** 「12 / 40」の後に添える単位。 */
  unit?: string;
  /** 上限を超えた時に出すエラー文。送信を止める時の検証メッセージにも使う。 */
  overflowMessage?: string;
};

/** 文字数と上限を添えた複数行の入力。残りの属性はtextareaへ渡す。 */
export const CountedTextarea = ({
  id,
  limit,
  unit = "文字",
  overflowMessage = "文字数の上限を超えています。",
  children,
  ...attributes
}: CountedTextareaProps) => (
  <div
    class="rx-character-count"
    data-controller="character-count"
    data-character-count-max-value={limit}
  >
    <Textarea {...attributes} id={id} data-character-count-target="field">
      {children}
    </Textarea>
    <div class="messages">
      {/* 数えるのはcontrollerなので、接続するまで文字数の欄は隠す。 */}
      <p class="count" id={`${id}-count`} data-character-count-target="counter" hidden>
        {" "}
        {unit}
      </p>
      <p class="error over-error" id={`${id}-over-error`}>
        <Icon name="x-circle" />
        <span>{overflowMessage}</span>
      </p>
    </div>
  </div>
);
