import { useId } from "hono/jsx";
import { Button } from "./button";
import { Field } from "./field";
import { Icon } from "./icon";
import { Tag } from "./tag";
import { classes } from "./types";

export type ColorPickerValue = {
  /** 色を解釈する色空間。画面からは変えられず、`${name}[colorSpace]`でそのまま送る。 */
  colorSpace: "srgb" | "display-p3";
  /** 色相。0〜360度。範囲外の値は範囲内に収める。 */
  hue: number;
  /** HSVの彩度。0〜100パーセント。範囲外の値は範囲内に収める。 */
  saturation: number;
  /** HSVの明度。0〜100パーセント。範囲外の値は範囲内に収める。 */
  brightness: number;
  /** 不透明度。0〜1。範囲外の値は範囲内に収める。 */
  alpha: number;
};

export type ColorPickerProps = {
  /** ルートのfieldsetのID。中の欄のIDの接頭辞にも使う。渡さなければ自動で生成する。 */
  id?: string;
  /** ルートのfieldsetに追加するクラス。 */
  class?: string;
  /** 欄全体の名前。legendに出し、色の面の読み上げ名にも使う。 */
  label: string;
  /** 送信する名前の接頭辞。`${name}[hue]`・`[saturation]`・`[brightness]`・`[alpha]`・`[colorSpace]`で送信する。 */
  name: string;
  /** 初期の色。 */
  value?: ColorPickerValue;
  /** 欄の下に出す補足。fieldsetのaria-describedbyに関連付ける。 */
  help?: string;
  /** 欄の下に出すエラー文。fieldsetをaria-invalidにする。検証は利用側で行う。 */
  error?: string;
  /** 色の面とスライダーをすべて使えなくする。値は送信しない。 */
  disabled?: boolean;
  /** 別の場所にあるformのID。送信する全ての欄に付ける。 */
  form?: string;
  /** 色の面を矢印キーで動かす時の、彩度・明度の幅（0より大きく100以下）。Shiftを押すと10倍。 */
  step?: number;
  /**
   * 使わない。互換のために型だけを残し、渡しても何も変わらない。
   * 上流のcolor-pickerでは色相環を矢印キーで動かす幅だが、このコンポーネントは色相環を持たず、
   * 色相のスライダーは他のスライダーと同じくブラウザの標準の動きで値を変える。
   * @deprecated 効果が無い。渡さない。
   */
  hueStep?: number;
};

const defaultValue = {
  colorSpace: "srgb",
  hue: 215,
  saturation: 68,
  brightness: 84,
  alpha: 1,
} satisfies ColorPickerValue;

const bounded = (value: number, maximum: number, fallback: number) =>
  Number.isFinite(value) ? Math.max(0, Math.min(maximum, value)) : fallback;

const colorComponents = (value: ColorPickerValue) => {
  const hue = (value.hue % 360) / 60;
  const saturation = value.saturation / 100;
  const brightness = value.brightness / 100;
  return ([5, 3, 1] as const).map((offset) => {
    const position = (offset + hue) % 6;
    return brightness * (1 - saturation * Math.max(0, Math.min(position, 4 - position, 1)));
  });
};

/** 標準rangeがフォーム値を保持し、上流のcolor-pickerが操作面と値を同期する。 */
export const ColorPicker = ({
  id,
  class: className,
  label,
  name,
  value = defaultValue,
  help,
  error,
  disabled,
  form,
  step = 1,
}: ColorPickerProps) => {
  const generatedId = useId();
  const pickerId = id ?? `rx-color-picker-${generatedId}`;
  const current: ColorPickerValue = {
    colorSpace: value.colorSpace === "display-p3" ? "display-p3" : "srgb",
    hue: bounded(value.hue, 360, defaultValue.hue),
    saturation: bounded(value.saturation, 100, defaultValue.saturation),
    brightness: bounded(value.brightness, 100, defaultValue.brightness),
    alpha: bounded(value.alpha, 1, defaultValue.alpha),
  };
  const rgb = colorComponents(current).join(" ");
  const hueColor = colorComponents({
    ...current,
    saturation: 100,
    brightness: 100,
    alpha: 1,
  }).join(" ");
  const channels = [
    { key: "hue", label: "色相", max: 360, end: "360°", value: current.hue },
    { key: "saturation", label: "彩度", max: 100, end: "100%", value: current.saturation },
    { key: "brightness", label: "明度", max: 100, end: "100%", value: current.brightness },
    { key: "alpha", label: "不透明度", max: 1, end: "100%", value: current.alpha },
  ] as const;
  const description = [help && `${pickerId}-help`, error && `${pickerId}-error`]
    .filter(Boolean)
    .join(" ");

  return (
    <fieldset
      id={pickerId}
      class={classes("rx-field rx-color-picker", className)}
      role="group"
      aria-labelledby={`${pickerId}-label`}
      aria-describedby={description || undefined}
      aria-invalid={error ? "true" : undefined}
      disabled={disabled}
      data-controller="color-picker"
      data-color-picker-value-value={JSON.stringify(current)}
      data-color-picker-step-value={Number.isFinite(step) && step > 0 && step <= 100 ? step : 1}
      style={`--color-picker-hue: ${current.hue}; --color-picker-saturation: ${current.saturation / 100}; --color-picker-brightness: ${current.brightness / 100}; --color-picker-alpha: ${current.alpha}; --color-picker-color: color(${current.colorSpace} ${rgb} / ${current.alpha}); --color-picker-hue-color: color(${current.colorSpace} ${hueColor} / 1); --color-picker-fallback: color(srgb ${rgb} / ${current.alpha})`}
    >
      <legend id={`${pickerId}-label`}>{label}</legend>
      <div class="editor">
        <div class="visual">
          <Button
            class="area"
            aria-label={`${label}の彩度と明度`}
            aria-controls={`${pickerId}-saturation ${pickerId}-brightness`}
            aria-describedby={`${pickerId}-instructions`}
            data-color-picker-target="area"
            data-icon-only="true"
            disabled={disabled}
          >
            <span class="cursor" aria-hidden="true" />
          </Button>
          <div class="preview">
            <span class="swatch" aria-hidden="true" />
            <span class="preview-label">選択中の色</span>
            <Tag label={current.colorSpace === "srgb" ? "sRGB" : "Display P3"} />
          </div>
        </div>
        <div class="channels">
          {channels.map((channel) => (
            <Field id={`${pickerId}-${channel.key}`} label={channel.label}>
              {(attributes) => (
                <div class="rx-range" data-channel={channel.key}>
                  <div class="controls">
                    <div class="native">
                      <input
                        {...attributes}
                        class="input"
                        type="range"
                        name={`${name}[${channel.key}]`}
                        form={form}
                        min="0"
                        max={channel.max}
                        step="any"
                        value={channel.value}
                        data-color-picker-target={`${channel.key}Control`}
                      />
                    </div>
                  </div>
                  <div class="limits" aria-hidden="true">
                    <span>0</span>
                    <span>{channel.end}</span>
                  </div>
                </div>
              )}
            </Field>
          ))}
        </div>
      </div>
      <input type="hidden" name={`${name}[colorSpace]`} form={form} value={current.colorSpace} />
      <p
        id={`${pickerId}-instructions`}
        class="rx-visually-hidden"
        data-color-picker-target="instructions"
      >
        色の面は左右で彩度、上下で明度を調整します。矢印キーでも操作できます。各スライダーからも調整できます。
      </p>
      {(help || error) && (
        <div class="messages">
          {help && (
            <p class="help" id={`${pickerId}-help`}>
              {help}
            </p>
          )}
          {error && (
            <p class="error" id={`${pickerId}-error`}>
              <Icon name="x-circle" />
              <span>{error}</span>
            </p>
          )}
        </div>
      )}
    </fieldset>
  );
};
