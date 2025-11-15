<template>
  <div class="game-board" :style="boardStyle">
    <GameItem
      v-for="(item, index) in gameItems"
      :key="item.id"
      :item="item"
      :is-matched="matchedItems.includes(item.id)"
      :is-top-visible="!item.selected && props.isTopVisibleItem(index)"
      @select="handleItemSelect"
    />

    <!-- 背景装饰 -->
    <div class="board-background">
      <div
        class="grid-line"
        v-for="i in 8"
        :key="`h-${i}`"
        :style="{ top: `${i * 12.5}%` }"
      ></div>
      <div
        class="grid-line vertical"
        v-for="i in 8"
        :key="`v-${i}`"
        :style="{ left: `${i * 12.5}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import GameItem from "./GameItem.vue";
import type { GameItem as GameItemType } from "../types/gameItem";
import type { GameConfig } from "../types/gameItem";

const props = defineProps<{
  gameItems: GameItemType[];
  gameConfig: GameConfig;
  isTopVisibleItem: (index: number) => boolean; // 新增：判断项目是否在最上层的方法
}>();

const emit = defineEmits<{
  (e: "select-item", itemId: number): void;
}>();

const matchedItems = ref<number[]>([]);

// 计算棋盘样式
const boardStyle = computed(() => {
  return {
    width: `${props.gameConfig.boardWidth}px`,
    height: `${props.gameConfig.boardHeight}px`,
  };
});

// 处理项目选择
function handleItemSelect(itemId: number) {
  emit("select-item", itemId);
}

// 添加匹配项目动画
function addMatchedItem(itemId: number) {
  matchedItems.value.push(itemId);
  setTimeout(() => {
    const index = matchedItems.value.indexOf(itemId);
    if (index > -1) {
      matchedItems.value.splice(index, 1);
    }
  }, 500);
}

// 暴露方法给父组件
defineExpose({
  addMatchedItem,
});
</script>

<style scoped>
.game-board {
  position: relative;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 2px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}

.board-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.3;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
}

.grid-line.vertical {
  top: 0;
  bottom: 0;
  width: 1px;
  height: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-board {
    width: 100% !important;
    max-width: 500px;
    height: 500px !important;
  }
}

@media (max-width: 480px) {
  .game-board {
    height: 400px !important;
  }
}
</style>
