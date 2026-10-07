import { componentGroups } from "../../catalog/component-groups";

/** カタログの全コンポーネントのid。コンポーネントのページは`/components/<id>`。 */
export const componentIds: readonly string[] = componentGroups.flatMap((group) => group.ids);
