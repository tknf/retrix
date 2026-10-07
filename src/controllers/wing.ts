import { Controller } from "@hotwired/stimulus";
import {
  parseWingState,
  serializeWingState,
  wingCookieName,
  type WingSide,
} from "../internal/wing-state";

const sideOf = (panel: HTMLDetailsElement): WingSide =>
  panel.classList.contains("start") ? "start" : "end";

/**
 * 左右の開閉状態をcookieへ保存する。サーバーがcookieを読んでWingのsavedStateへ渡すと、
 * 初回の描画から保存した状態になる。渡さない場合も接続時にcookieから復元する。
 */
export class WingController extends Controller<HTMLElement> {
  static targets = ["panel"];
  static values = { storageKey: String };
  declare readonly storageKeyValue: string;
  declare readonly panelTargets: HTMLDetailsElement[];
  panelTargetConnected = (panel: HTMLDetailsElement) => {
    const stored = this.read()[sideOf(panel)];
    if (stored !== undefined && panel.open !== stored) panel.open = stored;
    panel.addEventListener("toggle", this.save);
  };
  panelTargetDisconnected = (panel: HTMLDetailsElement) => {
    panel.removeEventListener("toggle", this.save);
  };
  private read = () => {
    const name = `${wingCookieName(this.storageKeyValue)}=`;
    const entry = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith(name))
      ?.slice(name.length);
    return parseWingState(entry === undefined ? undefined : decodeURIComponent(entry));
  };
  private save = () => {
    const state = { ...this.read() };
    for (const panel of this.panelTargets) state[sideOf(panel)] = panel.open;
    document.cookie = `${wingCookieName(this.storageKeyValue)}=${encodeURIComponent(
      serializeWingState(state),
    )}; path=/; max-age=31536000; samesite=lax`;
  };
}
