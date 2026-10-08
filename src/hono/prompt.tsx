import type { Child } from "hono/jsx";
import { Icon } from "./icon";
import { LayerCard } from "./layer-card";
import { classes, type ElementProps } from "./types";

export type PromptChoice = {
  /** 送信のボタンの時にnameと一緒に送る値。hrefを渡した選択肢では使わない。 */
  value: string;
  /** 選択肢の要点。太字で書く。 */
  title: string;
  /** 要点の下に添える説明。 */
  description?: Child;
  /** 渡すと移動のリンク、無ければ送信のボタン（nameとvalueを送る）。 */
  href?: string;
};
export type PromptProps = ElementProps<"section"> & {
  /** 問い。上端の見出し（h3）に赤の太字で書き、読み上げ名（aria-label）にもする。 */
  question: string;
  /** 答えの行。並べた順に上から置く。 */
  choices: readonly PromptChoice[];
  /** ボタンの選択肢が送る名前。 */
  name?: string;
  /** 選ばずに閉じる操作（「今は答えない」など）。見出しの行の末尾に置く。 */
  dismiss?: Child;
  /** カードの下に尾を付けて、すぐ下の要素を指す。カードの枠は尾の縁へつながる。falseで尾を外す。 */
  pointer?: boolean;
};

/**
 * 判断を依頼する問いかけ。BC2の繰り返す予定の変更を確かめるパネルと同じく、1px #bbbの枠の白いパネルの上に問いを赤の太字で置き、
 * その下に選択肢を全幅の控えめなボタンで並べる。ボタンは要点と灰色の説明を中央に書き、押すとその答えを選ぶ。尾ですぐ下の対象を指せる。
 * 輪のマークと進む矢印の要素はHTMLに残るが、表示しない。
 * 選択肢の行は複数行の文を持つ専用の操作で、文字の指定はprompt.cssが持つ。
 */
export const Prompt = ({
  question,
  choices,
  name,
  dismiss,
  pointer = true,
  class: className,
  ...attributes
}: PromptProps) => (
  <LayerCard
    {...attributes}
    class={classes("rx-prompt", className)}
    title={question}
    actions={dismiss}
    aria-label={question}
    data-pointer={pointer ? "true" : undefined}
  >
    <div class="choices">
      {choices.map((choice) => {
        const content = (
          <>
            <span class="mark" aria-hidden="true" />
            <span class="text">
              <strong>{choice.title}</strong>
              {choice.description != null && choice.description !== false && (
                <span class="description">{choice.description}</span>
              )}
            </span>
            <span class="go" aria-hidden="true">
              <Icon name="arrow" />
            </span>
          </>
        );
        return choice.href ? (
          <a class="choice" href={choice.href}>
            {content}
          </a>
        ) : (
          <button type="submit" class="choice" name={name} value={choice.value}>
            {content}
          </button>
        );
      })}
    </div>
  </LayerCard>
);
