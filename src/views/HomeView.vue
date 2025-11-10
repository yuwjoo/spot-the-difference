<template>
  <div class="home-view">
    <img src="@/assets/cover.png" alt="cover" class="cover-image" />
    <router-link to="/game" class="start-button">
      <img src="@/assets/startGameBtn.png" alt="start game" />
    </router-link>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .start-button {
    position: fixed;
    top: 70%;
    left: 50%;
    transform: translateX(-50%);
    width: 400px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
