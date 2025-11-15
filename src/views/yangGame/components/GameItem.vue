<template>
  <div
    class="game-item"
    :class="{
      active: item.visible,
      selected: item.selected,
      matched: isMatched,
    }"
    :style="itemStyle"
    @click="handleClick"
  >
    <img :src="item.imageUrl" :alt="`game item ${item.id}`" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { GameItem as GameItemType } from "../types/gameItem";

const props = defineProps<{
  item: GameItemType;
  isMatched?: boolean;
  isTopVisible?: boolean; // 新增：表示是否在最上层可见
}>();

const emit = defineEmits<{
  (e: "select", itemId: number): void;
}>();

// 计算样式
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const itemStyle = computed<Record<string, any>>(() => {
  return {
    top: `${props.item.top}px`,
    left: `${props.item.left}px`,
    zIndex: props.item.zIndex,
    transform: `rotate(${props.item.rotation}deg)`,
    opacity: props.item.visible ? 1 : 0,
    pointerEvents:
      props.item.visible && props.isTopVisible && !props.item.selected
        ? "auto"
        : "none",
  };
});

// 处理点击事件
function handleClick() {
  if (
    props.item.visible &&
    !props.isMatched &&
    props.isTopVisible &&
    !props.item.selected
  ) {
    emit("select", props.item.id);
  }
}
</script>

<style scoped>
.game-item {
  position: absolute;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: all 0.2s ease;
  transform-origin: center;
}

/* 非顶层图片的样式 */
.game-item:not(.selected) {
  /* 顶层图片保持原样 */
}

.game-item:hover:not(.matched) {
  transform: scale(1.05) rotate(var(--rotation)) !important;
  z-index: 100 !important;
}

.game-item.selected {
  border: 2px solid #4caf50;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.game-item.matched {
  animation: matchAnimation 0.5s ease-out forwards;
  pointer-events: none;
}

.game-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 4px;
}

@keyframes matchAnimation {
  0% {
    transform: scale(1) rotate(var(--rotation));
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(var(--rotation));
    opacity: 0.8;
  }
  100% {
    transform: scale(0) rotate(var(--rotation));
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .game-item {
    width: 60px;
    height: 60px;
  }
}
</style>
