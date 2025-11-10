<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>游戏结束</h2>
      <p>你的分数: {{ score }}</p>
      <div class="buttons">
        <button @click="$emit('restart')">重新开始</button>
        <router-link to="/">返回主页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ score: number }>();
defineEmits(["restart"]);
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.buttons {
  margin-top: 20px;

  button,
  a {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
