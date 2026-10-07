import { Disclosure, Field, InputGroup, Icon } from "../../src/hono";

export default () => (
  <div class="rx-split">
    <Field id="hono-group-price" label="料金（円）" help="100円単位で設定できます。">
      {(attributes) => (
        <InputGroup
          {...attributes}
          prefix="¥"
          type="number"
          name="price"
          min={0}
          max={100000}
          step={100}
          value={1200}
        />
      )}
    </Field>
    <Field id="hono-group-capacity" label="定員（人）">
      {(attributes) => (
        <InputGroup
          {...attributes}
          suffix="人"
          type="number"
          name="capacity"
          min={1}
          max={20}
          value={5}
        />
      )}
    </Field>
    <Field id="hono-group-site" label="サイトのURL">
      {(attributes) => (
        <InputGroup
          {...attributes}
          prefix="https://"
          suffix=".example.jp"
          name="subdomain"
          value="studio"
        />
      )}
    </Field>
    <form action="/apps/search" method="get">
      <Field id="hono-group-search" label="記事を検索">
        {(attributes) => (
          <InputGroup
            {...attributes}
            type="search"
            name="q"
            prefix={<Icon name="search" />}
            placeholder="記事名や本文から探す"
            action={{ label: "検索", type: "submit" }}
          />
        )}
      </Field>
    </form>
    <Disclosure summary="エラー・閲覧専用・利用不可・大きい入力">
      <div class="rx-stack">
        <Field
          id="hono-group-price-error"
          label="料金（入力エラー）"
          error="料金を入力してください。"
        >
          {(attributes) => <InputGroup {...attributes} prefix="¥" type="number" min={0} required />}
        </Field>
        <Field id="hono-group-site-readonly" label="公開済みのURL">
          {(attributes) => (
            <InputGroup
              {...attributes}
              prefix="https://"
              suffix=".example.jp"
              value="archive"
              readonly
            />
          )}
        </Field>
        <Field id="hono-group-search-disabled" label="停止中の検索">
          {(attributes) => (
            <InputGroup
              {...attributes}
              type="search"
              disabled
              value="受付停止中"
              action={{ label: "検索する" }}
            />
          )}
        </Field>
        <form action="/apps/search" method="get">
          <Field id="hono-group-search-large" label="記事を検索（大きい入力）">
            {(attributes) => (
              <InputGroup
                {...attributes}
                prefix={<Icon name="search" />}
                type="search"
                name="q"
                placeholder="記事名や本文から探す"
                size="large"
                action={{ label: "検索", type: "submit" }}
              />
            )}
          </Field>
        </form>
      </div>
    </Disclosure>
  </div>
);
