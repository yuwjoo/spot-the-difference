<template>
  <div class="challenge-view">
    <ChallengeStatus :score="score" :time="time" />
    <ChallengeGrid
      :images="images"
      :incorrectSelection="incorrectSelection"
      @select-image="selectImage"
    />
    <GameOverModal v-if="isGameOver" :score="score" @restart="restartGame" />
  </div>
</template>

<script setup lang="ts">
import ChallengeStatus from "@/components/ChallengeStatus.vue";
import ChallengeGrid from "@/components/ChallengeGrid.vue";
import GameOverModal from "@/components/GameOverModal.vue";
import { useChallengeGame } from "@/game/challengeLogic";

const {
  score,
  time,
  images,
  incorrectSelection,
  isGameOver,
  startGame,
  selectImage,
  restartGame,
} = useChallengeGame();

startGame();
</script>

<style lang="scss" scoped>
.challenge-view {
  padding: 20px;
}
</style>
