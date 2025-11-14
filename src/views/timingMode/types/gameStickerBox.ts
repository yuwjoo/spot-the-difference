export interface Props {
  stickers: Sticker[]; // 贴图集合
  cols?: number; // 列数
}

export interface Emits {
  "click-sticker": [sticker: Sticker, index: number]; // 点击贴图
}

export interface Sticker {
  url: string; // 贴图地址
  isTarget: boolean; // 是否目标贴图
}
