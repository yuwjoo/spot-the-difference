<template>
  <div
    v-if="item"
    class="selected-item"
    :style="itemStyle"
    @click="handleClick"
  >
    <img :src="item.imageUrl" :alt="`selected item ${item.id}`" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { GameItem } from "../types/gameItem";

const props = defineProps<{
  item: GameItem | null;
  index: number;
}>();

const emit = defineEmits<{
  (e: "remove", index: number): void;
}>();

// 计算样式
const itemStyle = computed(() => {
  if (!props.item) return {};
  return {
    transform: `rotate(${props.item.rotation}deg)`,
  };
});

// 处理点击事件
function handleClick() {
  if (props.item) {
    emit("remove", props.index);
  }
}
</script>

<style scoped>
.selected-item {
  width: 70px;
  height: 70px;
  cursor: pointer;
  transition: transform 0.2s ease;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid transparent;
}

.selected-item:hover {
  transform: scale(1.1) rotate(var(--rotation)) !important;
  border-color: #ff9800;
  box-shadow: 0 0 10px rgba(255, 152, 0, 0.5);
}

.selected-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .selected-item {
    width: 50px;
    height: 50px;
  }
}
</style>
