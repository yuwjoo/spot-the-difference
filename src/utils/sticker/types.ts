export interface StickerConfig {
  originalImage: string; // 原始贴图地址
  modifiedImages?: string[]; // 修改后贴图地址集合
  maskImages?: MaskImage[]; // 贴图遮罩地址集合
}

export interface MaskImage {
  url: string; // 遮罩地址
  top: number; // 遮罩上边距
  left: number; // 遮罩左边距
}
