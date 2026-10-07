import type { Child } from "hono/jsx";
import { Button } from "./button";
import { Card } from "./card";
import { EmptyState } from "./empty-state";
import { Icon } from "./icon";
import { classes, type ElementProps } from "./types";

/** 一枚のスライド。Cardとして描く。 */
export type CarouselSlide = {
  /** スライドの見出し。読み上げのスライド名「n / 全件: title」にも使う。 */
  title: string;
  /** スライドの本文。 */
  content: Child;
  /** 本文の横に置く画像など。狭い幅では本文の上に積む。 */
  preview?: Child;
  /** 見出しの上の小さな行。「n / 全件」の位置の後ろに並べる。 */
  eyebrow?: Child;
  /** 本文の下に淡い文字で添える日付などの補足。 */
  footer?: Child;
  /** 渡すと見出しをリンクにする。 */
  href?: string;
};

export type CarouselProps = ElementProps<"section"> & {
  /** まとまりの名前。ルートのaria-labelにする。 */
  label: string;
  /** 並べるスライド。2件以上で前後の操作を置き、1件では操作を置かず、0件では空状態を示す。 */
  slides: readonly CarouselSlide[];
  /** 最初に見せるスライドの位置（0から数える）。範囲外や整数でない値は0として扱う。 */
  initialIndex?: number;
  /** 0は自動送り操作なし。正の値では利用者が再生を選ぶまで停止する。 */
  interval?: number;
};

/** 見た目はCardへ、切り替えと再生は上流CarouselControllerへ委ねる。 */
export const Carousel = ({
  label,
  slides,
  initialIndex = 0,
  interval = 0,
  class: className,
  ...attributes
}: CarouselProps) => {
  const interactive = slides.length > 1;
  const active =
    Number.isInteger(initialIndex) && initialIndex >= 0 && initialIndex < slides.length
      ? initialIndex
      : 0;
  const rotationInterval = Number.isFinite(interval) && interval > 0 ? interval : 0;
  return (
    <section
      {...attributes}
      class={classes("rx-carousel", className)}
      role="group"
      aria-roledescription={interactive ? "carousel" : undefined}
      aria-label={label}
      data-controller={interactive ? "carousel" : undefined}
      data-carousel-index-value={interactive ? active : undefined}
      data-carousel-interval-value={interactive ? rotationInterval : undefined}
      data-state={interactive ? "paused" : undefined}
    >
      {slides.length === 0 ? (
        <EmptyState title="表示する項目はありません" />
      ) : (
        <>
          <div class="viewport">
            {slides.map((slide, index) => (
              <div
                class="slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${slides.length}: ${slide.title}`}
                data-carousel-target={interactive ? "slide" : undefined}
                data-state={index === active ? "active" : "inactive"}
                hidden={index !== active}
              >
                <Card
                  title={slide.title}
                  href={slide.href}
                  preview={slide.preview}
                  footer={slide.footer}
                  eyebrow={
                    <>
                      <span class="position">
                        {index + 1} / {slides.length}
                      </span>
                      {slide.eyebrow}
                    </>
                  }
                >
                  {slide.content}
                </Card>
              </div>
            ))}
          </div>
          {interactive && (
            <div class="controls" role="group" aria-label="スライド操作">
              {/* 前後のアイコンだけのボタンはカードの左右の縁をまたいで載せる。位置はButtonではなく包む要素が持つ。 */}
              <span class="step previous">
                <Button
                  class="previous"
                  aria-label="前のスライド"
                  data-icon-only="true"
                  data-carousel-target="previous"
                >
                  <Icon name="arrow" />
                </Button>
              </span>
              <span class="step next">
                <Button
                  class="next"
                  aria-label="次のスライド"
                  data-icon-only="true"
                  data-carousel-target="next"
                >
                  <Icon name="arrow" />
                </Button>
              </span>
              {rotationInterval > 0 && (
                <Button class="rotation" data-carousel-target="play" data-state="paused">
                  <span class="play-label">自動再生</span>
                  <span class="pause-label">一時停止</span>
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};
