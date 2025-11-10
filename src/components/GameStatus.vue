<template>
  <div class="game-status">
    <span>分数: {{ score }}</span>
    <span>关卡: {{ level }}</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  score: number;
  level: number;
}>();
</script>

<style lang="scss" scoped>
.game-status {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  font-size: 1.2em;
}
</style>
