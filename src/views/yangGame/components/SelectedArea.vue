<template>
  <div class="selected-area">
    <div class="selected-area-header">
      <h3>选中区域</h3>
      <div class="selected-count">
        {{ selectedItems.length }}/{{ maxSelected }}
      </div>
    </div>

    <div class="selected-slots">
      <div
        v-for="index in maxSelected"
        :key="index"
        class="selected-slot"
        :class="{ 'has-item': selectedItems[index - 1] !== undefined }"
      >
        <SelectedItem
          v-if="selectedItems[index - 1] !== undefined"
          :item="getSelectedItem(selectedItems[index - 1])"
          :index="index - 1"
          @remove="handleRemoveItem"
        />
        <div v-else class="empty-slot">
          <div class="empty-icon">+</div>
        </div>
      </div>
    </div>

    <!-- 提示信息 -->
    <div v-if="selectedItems.length >= minMatchCount" class="match-hint">
      可消除 {{ getMatchableCount() }} 组
    </div>
  </div>
</template>

<script setup lang="ts">
import SelectedItem from "./SelectedItem.vue";
import type { GameItem } from "../types/gameItem";

const props = defineProps<{
  gameItems: GameItem[];
  selectedItems: number[];
  maxSelected: number;
  minMatchCount: number;
}>();

const emit = defineEmits<{
  (e: "remove-item", index: number): void;
}>();

// 获取选中的项目对象
function getSelectedItem(itemId: number): GameItem | null {
  return props.gameItems.find((item) => item.id === itemId) || null;
}

// 处理移除项目
function handleRemoveItem(index: number) {
  emit("remove-item", index);
}

// 获取可匹配的组数
function getMatchableCount(): number {
  const typeGroups: Record<string, number> = {};

  props.selectedItems.forEach((itemId) => {
    const item = getSelectedItem(itemId);
    if (item) {
      typeGroups[item.type] = (typeGroups[item.type] || 0) + 1;
    }
  });

  let matchableCount = 0;
  Object.values(typeGroups).forEach((count) => {
    matchableCount += Math.floor(count / props.minMatchCount);
  });

  return matchableCount;
}
</script>

<style scoped>
.selected-area {
  width: 100%;
  max-width: 600px;
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  box-sizing: border-box;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.selected-area-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.selected-area-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.selected-count {
  font-size: 14px;
  font-weight: bold;
  color: #666;
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 12px;
}

.selected-slots {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.selected-slot {
  width: 80px;
  height: 80px;
  background: #f8f9fa;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.2s ease;
}

.selected-slot.has-item {
  background: #e8f5e9;
  border-color: #4caf50;
  border-style: solid;
}

.selected-slot:hover {
  background: #f0f8ff;
  border-color: #2196f3;
}

.empty-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.empty-icon {
  font-size: 32px;
  color: #ccc;
  font-weight: bold;
  opacity: 0.5;
}

.match-hint {
  margin-top: 15px;
  padding: 10px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
  color: #856404;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .selected-slots {
    gap: 8px;
  }

  .selected-slot {
    width: 70px;
    height: 70px;
  }
}

@media (max-width: 480px) {
  .selected-slots {
    gap: 6px;
  }

  .selected-slot {
    width: 55px;
    height: 55px;
  }

  .empty-icon {
    font-size: 24px;
  }
}
</style>
