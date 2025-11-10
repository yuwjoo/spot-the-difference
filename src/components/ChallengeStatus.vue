<template>
  <div class="challenge-status">
    <div class="score">分数: {{ score }}</div>
    <div class="timer">倒计时: {{ time }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ score: number; time: number }>();
</script>

<style lang="scss" scoped>
.challenge-status {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}
</style>
