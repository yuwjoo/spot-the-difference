<template>
  <div class="timing-mode">
    <div class="timing-mode__fraction">分数：{{ fraction }}</div>
    <game-sticker-box
      :stickers="stickerList"
      :cols="cols"
      @click-animation-end="onStickerClickAnimationEnd"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import GameStickerBox from "./components/GameStickerBox.vue";
import type { Sticker, StickerInfo } from "./types/gameStickerBox";
import { useStickers } from "@/utils/sticker";

const stickers = useStickers();
const tempStickers = JSON.parse(JSON.stringify(stickers)); // 贴图数据副本

const cols = ref(3); // 贴图列数
const count = ref(15); // 贴图总数
const stickerList = ref<Sticker[]>([]); // 贴图列表
const fraction = ref(0); // 分数

/**
 * 加载图片
 * @param url 图片地址
 * @returns 图片元素
 */
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

/**
 * 设置贴图列表
 */
const setStickerList = async () => {
  const targetIndex = Math.floor(Math.random() * count.value); // 目标贴图下标
  const emptyList = Array(count.value).fill(undefined);

  if (tempStickers.length === 0) {
    // 贴图数据用完，重新复制一份
    const resetStickers = JSON.parse(JSON.stringify(stickers));
    tempStickers.push(...resetStickers);
  }

  const randomSticker = tempStickers.splice(
    Math.floor(Math.random() * tempStickers.length),
    1
  )[0]; // 随机贴图
  const originalImage = {
    url: randomSticker.originalImage,
    top: 0,
    left: 0,
  };
  const originalImages = [originalImage];
  const targetImages: StickerInfo[] = [];

  if (randomSticker.maskImages) {
    const tempMaskImages = JSON.parse(JSON.stringify(randomSticker.maskImages));
    const maskCount = Math.ceil(
      Math.random() * randomSticker.maskImages.length
    ); // 随机遮罩数量

    targetImages.push(originalImage);

    for (let i = 0; i < maskCount; i++) {
      const pos = Math.floor(Math.random() * tempMaskImages.length);
      const maskImage = tempMaskImages.splice(pos, 1)[0];
      targetImages.push(maskImage);
      if (i < maskCount - 1) originalImages.push(maskImage);
    }
  } else if (randomSticker.modifiedImages) {
    targetImages.push({
      url: randomSticker.modifiedImages[
        Math.floor(Math.random() * randomSticker.modifiedImages.length)
      ],
      top: 0,
      left: 0,
    });
  }

  await Promise.all(
    [...originalImages, ...targetImages].map((img) => loadImage(img.url))
  ); // 预加载贴图图片

  stickerList.value = emptyList.map((_, index) => {
    const isTarget = index === targetIndex;
    const stickerInfos = isTarget ? targetImages : originalImages;
    return { stickerInfos, isTarget };
  });
};
setStickerList();

/**
 * 监听点击贴图动画结束
 * @param sticker 贴图数据
 */
const onStickerClickAnimationEnd = (sticker: Sticker) => {
  if (sticker.isTarget) {
    fraction.value += 1;
    setStickerList();
  } else {
    fraction.value -= 1;
  }
};
</script>

<style lang="scss" scoped>
.timing-mode {
  &__fraction {
    font-size: 20px;
    padding: 10px;
  }
}
</style>
