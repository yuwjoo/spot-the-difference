<template>
  <div class="timing-mode">
    <game-image-grid :image-source="imageSource" :rows="10" :cols="6" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import GameImageGrid from "./components/GameImageGrid.vue";

const imageSource = ref({
  interferenceImagePath: "./sticker/lianhuanvB.png", // 干扰图路径
  targetImagePath: "./sticker/lianhuanvC.png", // 目标图路径
});
</script>

<style lang="scss" scoped></style>
