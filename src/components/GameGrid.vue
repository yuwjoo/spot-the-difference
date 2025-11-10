<template>
  <div class="game-grid">
    <div
      v-for="image in images"
      :key="image.id"
      class="grid-item"
      @click="onImageClick(image)"
    >
      <img :src="image.url" :alt="'Image ' + image.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Image } from "@/game/gameLogic";

defineProps<{
  images: Image[];
}>();

const emit = defineEmits<{
  (e: "image-click", image: Image): void;
}>();

const onImageClick = (image: Image) => {
  emit("image-click", image);
};
</script>

<style lang="scss" scoped>
.game-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 10px;
  max-height: calc(100vh - 200px); // 减去其他元素的高度
  overflow-y: auto;

  .grid-item {
    img {
      width: 100%;
      height: auto;
      cursor: pointer;
    }
  }
}
</style>
