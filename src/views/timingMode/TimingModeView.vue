<template>
  <div class="timing-mode">
    <game-sticker-box :image-source="imageSource" :rows="10" :cols="4" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import GameStickerBox from "./components/GameStickerBox.vue";

const imageSource = ref({
  interferenceImagePath: "./biel.jpg", // 干扰图路径
  targetImagePath: "./biel.jpg", // 目标图路径
});
</script>

<style lang="scss" scoped></style>
