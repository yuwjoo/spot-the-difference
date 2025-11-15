export interface Props {
  stickers: Sticker[]; // 贴图集合
  cols?: number; // 列数
}

export interface Emits {
  "click-sticker": [sticker: Sticker, index: number]; // 点击贴图
  "click-animation-end": [sticker: Sticker]; // 贴图点击动画结束
}

export interface Sticker {
  stickerInfos: StickerInfo[]; // 贴图信息集合
  isTarget: boolean; // 是否目标贴图
}

export interface StickerInfo {
  url: string; // 贴图地址
  top: number; // 贴图上边距
  left: number; // 贴图左边距
}
