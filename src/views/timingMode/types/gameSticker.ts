import type { Sticker } from "./gameStickerBox";

export interface Emits {
  "click-animation-end": [sticker: Sticker]; // 贴图点击动画结束
}

export interface Props {
  sticker: Sticker; // 贴图数据
  disabledClick?: boolean; // 是否禁用点击
}
