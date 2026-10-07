import { Controller } from "@hotwired/stimulus";

/**
 * 時間割を開いた時に現在時刻（または稼働時間の開始時刻）を表示する。
 * CSSのscroll-initial-targetに対応するブラウザでは描画時に決まるため、何もしない。
 */
export class CalendarScrollController extends Controller<HTMLElement> {
  connect = () => {
    if (CSS.supports("scroll-initial-target", "nearest")) return;
    // 目印は固定した見出しの高さ分だけ上に置いてあるので、スクロール領域の上端へ揃える。
    const target = this.element.querySelector<HTMLElement>(".scroll-target");
    if (!target) return;
    this.element.scrollTop +=
      target.getBoundingClientRect().top - this.element.getBoundingClientRect().top;
  };
}
