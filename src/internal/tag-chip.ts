/** HonoのTagを描画したtemplateから、同じ構造の選択タグを複製する。 */
export const cloneRemovableTag = (template: HTMLTemplateElement, label: string) => {
  const item = template.content.firstElementChild?.cloneNode(true);
  if (!(item instanceof HTMLLIElement)) throw new Error("Tagのtemplateにliがありません。");
  const text = item.querySelector<HTMLElement>(".rx-tag.removable > .label");
  const remove = item.querySelector<HTMLButtonElement>(".rx-tag.removable > .remove");
  if (!text || !remove) throw new Error("Tagのtemplateにラベルまたは解除操作がありません。");
  text.textContent = label;
  remove.setAttribute("aria-label", `${label}を解除`);
  return { item, remove };
};
