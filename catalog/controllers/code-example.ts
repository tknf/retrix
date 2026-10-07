import { Controller } from "@hotwired/stimulus";

/** 閉じたコードの大量の着色要素を、コンポーネントの操作面へ参加させない。 */
export class CodeExampleController extends Controller<HTMLDetailsElement> {
  connect = () => this.opened();
  opened = () => {
    if (!this.element.open) return;
    const template = this.element.querySelector("template");
    if (template instanceof HTMLTemplateElement)
      template.replaceWith(template.content.cloneNode(true));
  };
}
