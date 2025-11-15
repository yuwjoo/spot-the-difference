import stickers from "./stickers";
import type { StickerConfig } from "./types";

/**
 * 获取贴图数据集合
 * @returns 贴图数据集合
 */
export function useStickers(): StickerConfig[] {
  return stickers;
}
