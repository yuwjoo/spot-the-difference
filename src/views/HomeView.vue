<template>
  <div class="home-view">
    <img src="@/assets/cover.png" alt="cover" class="cover-image" />
    <div class="home-view__buttons">
      <router-link to="/timingMode" class="start-button">
        <img src="@/assets/startGameBtn.png" alt="start game" />
      </router-link>
      <router-link to="/yangGame" class="start-button">
        <img src="@/assets/startGameBtn.png" alt="start game" />
      </router-link>
    </div>
    <!-- <router-link to="/challenge" class="challenge-button">
      <img src="@/assets/downloaded-image (2).png" alt="challenge mode" />
    </router-link> -->
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

  &__buttons {
    position: fixed;
    top: 60%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .start-button {
    width: 150px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .challenge-button {
    position: fixed;
    top: 85%;
    left: 50%;
    transform: translateX(-50%);
    width: 250px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
