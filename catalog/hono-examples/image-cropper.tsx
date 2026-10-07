import { Disclosure, ImageCropper } from "../../src/hono";

export default () => (
  <div class="rx-stack">
    <ImageCropper
      id="hono-image-cropper"
      label="表紙の切り抜き"
      src="/assets/sample-cover.svg"
      alt="暮らしの記録の表紙"
      imageWidth={400}
      imageHeight={560}
      value={{ x: 12, y: 18, width: 76, height: 60, zoom: 1, offsetX: 0, offsetY: 0 }}
    />
    <Disclosure summary="画像なし・編集不可">
      <div class="rx-stack">
        <ImageCropper label="画像なし" alt="未登録の表紙" />
        <ImageCropper
          label="編集不可の表紙"
          src="/assets/sample-cover.svg"
          alt="暮らしの記録の表紙"
          imageWidth={400}
          imageHeight={560}
          disabled
        />
      </div>
    </Disclosure>
  </div>
);
