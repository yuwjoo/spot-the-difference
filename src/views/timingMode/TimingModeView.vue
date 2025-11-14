<template>
  <div class="timing-mode">
    <game-sticker-box
      :stickers="stickerList"
      :cols="cols"
      @click-sticker="onClickSticker"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import GameStickerBox from "./components/GameStickerBox.vue";
import type { Sticker } from "./types/gameStickerBox";

const cols = ref(4); // 贴图列数
const stickerList = ref<Sticker[]>([]); // 贴图列表
const count = ref(20); // 贴图总数

/**
 * 设置贴图列表
 */
const setStickerList = () => {
  const targetIndex = Math.floor(Math.random() * count.value); // 目标贴图下标
  const emptyList = Array(count.value).fill(undefined);
  stickerList.value = emptyList.map((_, index) => {
    const isTarget = index === targetIndex;
    const url = isTarget ? "./konglongA.jpg" : "./biel.jpg";
    return { url, isTarget };
  });
};
setStickerList();

/**
 * 监听点击贴图
 * @param sticker 贴图数据
 */
const onClickSticker = (sticker: Sticker) => {
  if (sticker.isTarget) {
    count.value++;
    setStickerList();
  }
};
</script>

<style lang="scss" scoped></style>
