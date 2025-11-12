<template>
  <div class="game-image-grid">
    <div
      class="game-image-grid__item"
      v-for="(_, index) in imageCount"
      :key="index"
    >
      <img
        class="game-image-grid__item-img"
        :src="
          index === targetIndex
            ? imageSource?.targetImagePath
            : imageSource?.interferenceImagePath
        "
      />
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
$image-space: 10px;

.game-image-grid {
  display: inline-grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $image-space;
  padding: $image-space;
  overflow-y: auto;
  width: 80%;
  box-sizing: border-box;

  &__item {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    cursor: pointer;

    &-img {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
