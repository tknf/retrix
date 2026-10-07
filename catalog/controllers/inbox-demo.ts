import { Controller } from "@hotwired/stimulus";
import { visit } from "@hotwired/turbo";

type Folder = "inbox" | "later" | "done";
type Entry = { folder: Folder; read: boolean; draft: string };
const storageKey = "rx-demo-inbox-v1";
const isEntry = (value: unknown): value is Entry =>
  typeof value === "object" &&
  value !== null &&
  "folder" in value &&
  (value.folder === "inbox" || value.folder === "later" || value.folder === "done") &&
  "read" in value &&
  typeof value.read === "boolean" &&
  "draft" in value &&
  typeof value.draft === "string";

export class InboxDemoController extends Controller<HTMLElement> {
  private entries = new Map<string, Entry>();
  connect = () => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
      if (typeof value === "object" && value !== null)
        for (const [id, entry] of Object.entries(value))
          if (isEntry(entry)) this.entries.set(id, entry);
    } catch {
      this.entries.clear();
    }
    this.element.addEventListener("click", this.move);
    this.element.addEventListener("submit", this.saveDraft);
    const id = this.element.dataset.inboxMessage;
    if (id) {
      const entry = this.entry(id);
      entry.read = true;
      this.persist();
      const textarea = this.element.querySelector('textarea[name="reply"]');
      if (textarea instanceof HTMLTextAreaElement) textarea.value = entry.draft;
      for (const button of this.element.querySelectorAll<HTMLButtonElement>(
        "button[data-inbox-folder]",
      )) {
        button.hidden = button.dataset.inboxFolder === entry.folder;
        button.disabled = button.hidden;
        // ActionDockの操作バーでは、操作を包むセルごと隠して間を詰める。
        const slot = button.closest("li");
        if (slot) slot.hidden = button.hidden;
      }
    } else this.refresh();
  };
  disconnect = () => {
    this.element.removeEventListener("click", this.move);
    this.element.removeEventListener("submit", this.saveDraft);
  };
  private entry = (id: string) => {
    const existing = this.entries.get(id);
    if (existing) return existing;
    const entry = { folder: "inbox", read: false, draft: "" } satisfies Entry;
    this.entries.set(id, entry);
    return entry;
  };
  private persist = () => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(this.entries)));
      return true;
    } catch {
      return false;
    }
  };
  private refresh = () => {
    for (const row of this.element.querySelectorAll<HTMLElement>("[data-message-id]")) {
      const entry = this.entry(row.dataset.messageId ?? "");
      this.element
        .querySelector(`[data-inbox-folder-panel="${entry.folder}"] .rx-message-list`)
        ?.append(row);
      row.dataset.unread = String(!entry.read);
      const marker = row.querySelector(".unread");
      if (marker instanceof HTMLElement) marker.hidden = entry.read;
    }
    for (const panel of this.element.querySelectorAll<HTMLElement>("[data-inbox-folder-panel]")) {
      // 0件の表示はMessageListが持ち、行が一つもない時だけ見える。
      const count = panel.querySelectorAll("[data-message-id]").length;
      const badge = this.element.querySelector(
        `[data-tabs-value="${panel.dataset.inboxFolderPanel}"] > .count`,
      );
      if (badge) badge.textContent = String(count);
    }
  };
  private move = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest("button[data-inbox-folder]");
    const id = this.element.dataset.inboxMessage;
    if (!(button instanceof HTMLButtonElement) || !id) return;
    const folder = button.dataset.inboxFolder;
    if (folder !== "inbox" && folder !== "later" && folder !== "done") return;
    const entry = this.entry(id);
    const previousFolder = entry.folder;
    entry.folder = folder;
    const textarea = this.element.querySelector('textarea[name="reply"]');
    if (textarea instanceof HTMLTextAreaElement) entry.draft = textarea.value;
    // 読み込み直すと、次の画面の操作に処理が付く前の押下を捨ててしまうので、Turboで移る。
    if (this.persist()) visit("/apps/inbox");
    else {
      entry.folder = previousFolder;
      const status = this.element.querySelector("[data-inbox-status]");
      if (status) status.textContent = "保存できませんでした。入力内容をコピーして残してください。";
    }
  };
  private saveDraft = (event: SubmitEvent) => {
    const form = event.target;
    const id = this.element.dataset.inboxMessage;
    if (!(form instanceof HTMLFormElement) || !form.hasAttribute("data-inbox-draft") || !id) return;
    event.preventDefault();
    const textarea = form.elements.namedItem("reply");
    if (!(textarea instanceof HTMLTextAreaElement)) return;
    this.entry(id).draft = textarea.value;
    const saved = this.persist();
    const status = form.querySelector("[data-inbox-status]");
    if (status)
      status.textContent = saved
        ? "下書きを保存しました"
        : "保存できませんでした。入力内容をコピーして残してください。";
  };
}
