import { Button, ColorPicker, Disclosure, Popover } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <ColorPicker
      id="color-picker-brand"
      label="ブランドの色"
      name="brandColor"
      value={{ colorSpace: "srgb", hue: 215, saturation: 68, brightness: 84, alpha: 1 }}
      help="色の面で大まかに選び、スライダーで正確に調整できます。"
    />
    <Disclosure summary="透明度・広色域・無効状態">
      <div class="rx-stack">
        <ColorPicker
          id="color-picker-overlay"
          label="重ねる色"
          name="overlayColor"
          value={{ colorSpace: "display-p3", hue: 18, saturation: 83, brightness: 96, alpha: 0.52 }}
        />
        <ColorPicker
          id="color-picker-disabled"
          label="変更できない色"
          name="lockedColor"
          disabled
        />
        <ColorPicker
          id="color-picker-error"
          label="確認が必要な色"
          name="reviewColor"
          error="背景とのコントラストを確認してください。"
        />
      </div>
    </Disclosure>
    <Disclosure summary="Popover 内で色を選ぶ">
      <Popover
        id="color-picker-popover"
        label="色を編集"
        title="マーカーの色"
        size="wide"
        actions={
          <Button type="submit" form="color-picker-popover-form" variant="primary">
            適用する
          </Button>
        }
      >
        <form id="color-picker-popover-form">
          <ColorPicker
            id="color-picker-marker"
            label="マーカー"
            name="markerColor"
            form="color-picker-popover-form"
            value={{ colorSpace: "srgb", hue: 42, saturation: 86, brightness: 98, alpha: 0.8 }}
          />
        </form>
      </Popover>
    </Disclosure>
  </div>
);
