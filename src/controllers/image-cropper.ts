import { ImageCropperController as BaseImageCropperController } from "@tknf/stimulus-ui";

/** 上流の切り抜きに、接続している間だけハンドルと調整の入力欄を表示するための目印を加える。 */
export class ImageCropperController extends BaseImageCropperController {
  constructor(...args: ConstructorParameters<typeof BaseImageCropperController>) {
    super(...args);
    const connectBase = this.connect;
    const disconnectBase = this.disconnect;
    this.connect = () => {
      connectBase();
      this.element.setAttribute("data-connected", "true");
    };
    this.disconnect = () => {
      this.element.removeAttribute("data-connected");
      disconnectBase();
    };
  }
}
