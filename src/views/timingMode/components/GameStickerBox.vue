<template>
  <div class="game-sticker-box">
    <div class="game-sticker-box__grid">
      <div
        class="game-sticker-box__grid-item"
        v-for="(_, index) in imageCount"
        :key="index"
      >
        <img
          class="game-sticker-box__grid-item-img"
          :src="
            index === targetIndex
              ? imageSource?.targetImagePath
              : imageSource?.interferenceImagePath
          "
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import type { Props } from "../types/gameImageGrid";

const props = withDefaults(defineProps<Props>(), {
  rows: 10,
  cols: 4,
});

const imageCount = computed(() => props.cols * props.rows); // 图片总数

const targetIndex = ref(-1); // 目标图位置
watch(
  () => props.imageSource,
  () => {
    targetIndex.value = Math.floor(Math.random() * imageCount.value);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
$image-space: 10px; // 图片间隔

.game-sticker-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;

  &__grid {
    display: inline-grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $image-space;
    padding: $image-space;
    overflow-y: auto;
    box-sizing: border-box;
    max-width: 100%;
    max-height: 100%;
    width: 70%;

    &-item {
      height: 0;
      padding-bottom: 100%;
      position: relative;
      //   aspect-ratio: 1/1;

      &-img {
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
      }
    }
  }
}
</style>
