import { Section, TaskList } from "../../src/hono";
export default () => (
  <Section title="進めている" count={2} tone="info">
    <TaskList
      label="進めている仕事"
      items={[
        { name: "section-first", label: "最初の案をまとめる" },
        { name: "section-review", label: "チームで確認する" },
      ]}
    />
  </Section>
);
