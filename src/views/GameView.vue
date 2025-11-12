<template>
  <div class="game-view">
    <div class="header">
      <router-link to="/" class="back-button">返回</router-link>
      <h1>找不同</h1>
    </div>
    <game-status :score="score" :level="level" />
    <game-grid :images="images" @image-click="handleImageClick" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import GameStatus from "@/components/GameStatus.vue";
import GameGrid from "@/components/GameGrid.vue";
import { generateLevel, type Image } from "@/game/gameLogic";

const score = ref(0);
const level = ref(1);
const images = ref<Image[]>([]);

let { newImages, correctImage } = generateLevel(level.value);
images.value = newImages;

const handleImageClick = (image: Image) => {
  if (image.id === correctImage.id) {
    score.value += 10;
    level.value += 1;
    const result = generateLevel(level.value);
    images.value = result.newImages;
    correctImage = result.correctImage;
  } else {
    score.value -= 5;
  }
};
</script>

<style lang="scss" scoped>
.game-view {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    margin-bottom: 20px;

    .back-button {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 26px;
      color: #42b983;
      text-decoration: none;
    }

    h1 {
      margin: 0;
    }
  }
}
</style>
