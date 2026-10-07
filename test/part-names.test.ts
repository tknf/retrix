import { expect, test } from "vite-plus/test";
import postcss from "postcss";
import { partNameErrors } from "../scripts/part-names.mjs";

const inspect = (source: string) =>
  partNameErrors(postcss.parse(source), "src/css/components/card.css");

test("コンポーネントの役割名と内側の独立したコンポーネントを区別して許可する", () => {
  expect(inspect(".rx-card { & > .body { & > .rx-icon { color: inherit; } } }")).toEqual([]);
  expect(inspect(".rx-card > .body { color: inherit; }")).toEqual([]);
});

test("内部の役割名へコンポーネント名を繰り返す退行を拒否する", () => {
  expect(inspect(".rx-card > .rx-card-body { color: inherit; }")).not.toEqual([]);
});

test("短いクラスをグローバルに公開する退行を拒否する", () => {
  expect(inspect(".body { color: inherit; }")).not.toEqual([]);
});

test("入れ子へ届く広い子孫指定を拒否する", () => {
  expect(inspect(".rx-card .title { color: inherit; }")).not.toEqual([]);
  expect(inspect(".rx-card { & .title { color: inherit; } }")).not.toEqual([]);
});

test("Fieldやメニューの共有ルートも全件の命名検査に含める", () => {
  const field = (css: string) => partNameErrors(postcss.parse(css), "src/css/components/field.css");
  expect(field(".rx-field-group > .layout > .fields { display: grid; }")).toEqual([]);
  expect(field(".rx-combobox > .rx-combobox-options { display: block; }")).not.toEqual([]);
  expect(field(".messages > .error { color: red; }")).not.toEqual([]);
  expect(
    partNameErrors(
      postcss.parse(".rx-menu > li > .rx-menu-item { display: block; }"),
      "src/css/components/dropdown-menu.css",
    ),
  ).not.toEqual([]);
  expect(
    partNameErrors(
      postcss.parse(".rx-tabs > .list > button { color: inherit; }"),
      "src/css/components/tabs.css",
    ),
  ).toEqual([]);
});
