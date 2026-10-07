import { Disclosure, Button, Range } from "../../src/hono";

export default () => (
  <form class="rx-stack" aria-label="表示と予算の設定">
    <Range
      id="hono-range-zoom"
      label="表示倍率（%）"
      name="zoom"
      min={50}
      max={200}
      step={10}
      value={100}
      unit="%"
    />
    <Range
      id="hono-range-budget"
      label="予算（円）"
      name="budget"
      min={0}
      max={10000}
      step={500}
      value={[1000, 5000]}
      unit="円"
    />
    <Disclosure summary="最小・最大・小数・利用不可">
      <div class="rx-stack">
        <Range label="音量（最小）" min={0} max={100} value={0} unit="%" />
        <Range label="画質（最大）" min={1} max={5} value={5} />
        <Range label="拡大率（小数）" min={0.5} max={2} step={0.1} value={1.2} unit="倍" />
        <Range label="変更できない範囲" min={0} max={10} value={3} disabled />
        <Range
          label="予算（変更不可）"
          min={0}
          max={10000}
          step={500}
          value={[2000, 8000]}
          disabled
        />
      </div>
    </Disclosure>
    <Button type="reset">初期値に戻す</Button>
  </form>
);
