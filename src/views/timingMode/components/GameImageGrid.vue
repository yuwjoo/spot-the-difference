<template>
  <div class="game-image-grid">
    <div
      class="game-image-grid__item"
      v-for="(_, index) in imageCount"
      :key="index"
    >
      <!-- <img :src="image.url" :alt="'Image ' + image.id" /> -->
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

const targetPos = ref(-1); // 目标图位置
watch(
  () => props.imageSource,
  () => {
    targetPos.value = Math.random() * imageCount.value;
  }
);
</script>

<style lang="scss" scoped></style>
