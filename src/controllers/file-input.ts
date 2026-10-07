import { FileDropController } from "@tknf/stimulus-ui";
import { formatFileSize } from "../internal/file-size";

/**
 * ファイルが入力のacceptに当てはまるか。選択ダイアログと同じく、拡張子（.pdf）・種類（image/*）・
 * MIME（application/pdf）のどれかに大文字と小文字を区別せずに当たれば受け付ける。acceptが空なら全て受け付ける。
 */
const acceptsFile = (accept: string, file: File) => {
  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) =>
    token.startsWith(".")
      ? name.endsWith(token)
      : token.endsWith("/*")
        ? type.startsWith(token.slice(0, -1))
        : type === token,
  );
};

/** 上流のドロップ処理に、acceptでの絞り込み・選択内容の表示・解除・標準入力への通知を加える。 */
export class FileInputController extends FileDropController {
  static targets = [...FileDropController.targets, "files", "hint", "clear", "status", "template"];
  declare readonly filesTarget: HTMLElement;
  declare readonly hasFilesTarget: boolean;
  declare readonly hintTarget: HTMLElement;
  declare readonly hasHintTarget: boolean;
  declare readonly clearTarget: HTMLButtonElement;
  declare readonly hasClearTarget: boolean;
  declare readonly statusTarget: HTMLElement;
  declare readonly hasStatusTarget: boolean;
  declare readonly templateTarget: HTMLTemplateElement;
  declare readonly hasTemplateTarget: boolean;
  private fileForm: HTMLFormElement | null = null;
  private resetTask: number | undefined;
  /** 今のドロップにacceptに当てはまらないファイルが含まれ、beforedropで取り消す。 */
  private rejectedDrop = false;

  constructor(...args: ConstructorParameters<typeof FileDropController>) {
    super(...args);
    const connectDrop = this.connect;
    const disconnectDrop = this.disconnect;
    this.connect = () => {
      connectDrop();
      this.fileForm = this.fileInput()?.form ?? null;
      this.element.addEventListener("input", this.inputChanged);
      this.element.addEventListener("change", this.inputChanged);
      this.element.addEventListener("file-drop:drop", this.filesDropped);
      this.element.addEventListener("file-drop:beforedrop", this.beforeFilesDropped);
      for (const type of ["dragenter", "dragover", "drop"] as const)
        this.element.addEventListener(type, this.guardDrop, true);
      this.fileForm?.addEventListener("reset", this.formReset);
      this.reflectFiles(false);
      // 一覧がある場合だけ標準入力のファイル名表示を置き換える。
      if (this.hasFilesTarget) this.element.dataset.enhanced = "true";
      if (this.hasHintTarget) this.hintTarget.hidden = false;
    };
    this.disconnect = () => {
      this.element.removeEventListener("input", this.inputChanged);
      this.element.removeEventListener("change", this.inputChanged);
      this.element.removeEventListener("file-drop:drop", this.filesDropped);
      this.element.removeEventListener("file-drop:beforedrop", this.beforeFilesDropped);
      for (const type of ["dragenter", "dragover", "drop"] as const)
        this.element.removeEventListener(type, this.guardDrop, true);
      this.fileForm?.removeEventListener("reset", this.formReset);
      this.fileForm = null;
      window.clearTimeout(this.resetTask);
      delete this.element.dataset.enhanced;
      if (this.hasFilesTarget) this.filesTarget.hidden = true;
      if (this.hasClearTarget) this.clearTarget.hidden = true;
      if (this.hasHintTarget) this.hintTarget.hidden = true;
      this.report("");
      disconnectDrop();
    };
  }

  private fileInput = () => {
    const input = this.inputTargets[0];
    return input instanceof HTMLInputElement && input.type === "file" ? input : null;
  };
  private report = (message: string, invalid = false) => {
    if (!this.hasStatusTarget) return;
    this.statusTarget.textContent = message;
    this.statusTarget.dataset.invalid = String(invalid);
  };
  private reflectFiles = (announce: boolean) => {
    const input = this.fileInput();
    const files = Array.from(input?.files ?? []);
    if (this.hasFilesTarget) {
      const fragment = document.createDocumentFragment();
      for (const file of files) fragment.append(this.fileRow(file));
      this.filesTarget.replaceChildren(fragment);
      this.filesTarget.hidden = files.length === 0;
    }
    if (this.hasClearTarget) {
      this.clearTarget.hidden = files.length === 0;
      this.clearTarget.disabled = !input || input.matches(":disabled");
    }
    if (announce)
      this.report(
        files.length ? `${files.length}件のファイルを選択しました。` : "選択を解除しました。",
      );
  };
  /** 選んだファイルの行。型（FileItem）があれば複製し、なければ名前と大きさだけの行にする。 */
  private fileRow = (file: File) => {
    const row = this.hasTemplateTarget
      ? this.templateTarget.content.firstElementChild?.cloneNode(true)
      : null;
    const item = row instanceof HTMLLIElement ? row : document.createElement("li");
    const name = item.querySelector(".title > strong");
    const size = item.querySelector(".description");
    if (name && size) {
      name.textContent = file.name;
      size.textContent = formatFileSize(file.size);
    } else item.textContent = `${file.name} ${formatFileSize(file.size)}`;
    return item;
  };
  private inputChanged = (event: Event) => {
    if (event.target === this.fileInput()) this.reflectFiles(true);
  };
  private notifyInput = () => {
    const input = this.fileInput();
    if (!input) return;
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  };
  private filesDropped = (event: Event) => {
    if (event.target === this.element) this.notifyInput();
  };
  private beforeFilesDropped = (event: Event) => {
    if (
      event.target === this.element &&
      (this.rejectedDrop || this.fileInput()?.matches(":disabled"))
    )
      event.preventDefault();
  };
  private guardDrop = (event: DragEvent) => {
    if (!Array.from(event.dataTransfer?.types ?? []).includes("Files")) return;
    const input = this.fileInput();
    const disabled = !input || input.matches(":disabled");
    if (event.type === "drop") {
      this.rejectedDrop = false;
      const files = Array.from(event.dataTransfer?.files ?? []);
      if (!disabled && !input.multiple && files.length > 1)
        this.report("一度に選択できるのは1ファイルです。", true);
      else if (!disabled && files.some((file) => !acceptsFile(input.accept, file))) {
        this.rejectedDrop = true;
        this.report("選択できない形式のファイルが含まれています。", true);
      }
      // 上流にドロップ状態をリセットさせ、利用不可・形式違いはbeforedropで取り消す。
      return;
    }
    if (!disabled) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "none";
    this.element.dataset.state = "idle";
  };
  clear = () => {
    const input = this.fileInput();
    if (!input || input.matches(":disabled")) return;
    input.value = "";
    input.focus({ preventScroll: true });
    this.notifyInput();
  };
  private formReset = (event: Event) => {
    window.clearTimeout(this.resetTask);
    this.resetTask = window.setTimeout(() => {
      if (!event.defaultPrevented) this.reflectFiles(true);
    }, 0);
  };
}
