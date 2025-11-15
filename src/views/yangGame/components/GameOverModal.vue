<template>
  <div v-if="visible" class="game-over-modal" @click.self="handleClose">
    <div class="modal-content" :class="{ win: isWin }">
      <div class="modal-header">
        <h2>{{ isWin ? "🎉 恭喜过关！" : "😢 游戏结束！" }}</h2>
      </div>

      <div class="modal-body">
        <div class="stats-container">
          <div class="stat-item">
            <span class="stat-label">关卡</span>
            <span class="stat-value">{{ level }}</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">得分</span>
            <span class="stat-value">{{ score }}</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">用时</span>
            <span class="stat-value">{{ formatTime(totalTime) }}</span>
          </div>

          <div v-if="isWin" class="stat-item bonus">
            <span class="stat-label">奖励</span>
            <span class="stat-value">+{{ bonusScore }}</span>
          </div>
        </div>

        <!-- 胜利动画 -->
        <div v-if="isWin" class="confetti-container">
          <div
            v-for="i in 50"
            :key="i"
            class="confetti"
            :style="getConfettiStyle(i)"
          ></div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="handleRestart" class="modal-btn primary">
          再来一局
        </button>
        <button
          @click="handleNextLevel"
          class="modal-btn secondary"
          v-if="isWin"
        >
          下一关
        </button>
        <button @click="handleClose" class="modal-btn outline">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  visible: boolean;
  isWin: boolean;
  level: number;
  score: number;
  totalTime: number;
}>();

const emit = defineEmits<{
  (e: "restart"): void;
  (e: "next-level"): void;
  (e: "close"): void;
}>();

// 计算奖励分数
const bonusScore = computed(() => {
  if (!props.isWin) return 0;
  // 根据剩余时间计算奖励
  const timeBonus = Math.max(0, 120 - props.totalTime) * 10;
  return timeBonus;
});

// 格式化时间
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// 获取彩带样式
function getConfettiStyle(index: number) {
  const colors = [
    "#FF5252",
    "#FF4081",
    "#E040FB",
    "#7C4DFF",
    "#536DFE",
    "#448AFF",
    "#40C4FF",
    "#18FFFF",
    "#69F0AE",
    "#B2FF59",
  ];
  const color = colors[index % colors.length];
  const size = Math.random() * 10 + 5;
  const left = Math.random() * 100;
  const delay = Math.random() * 2;
  const duration = Math.random() * 3 + 2;

  return {
    backgroundColor: color,
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  };
}

// 处理重新开始
function handleRestart() {
  emit("restart");
}

// 处理下一关
function handleNextLevel() {
  emit("next-level");
}

// 处理关闭
function handleClose() {
  emit("close");
}
</script>

<style scoped>
.game-over-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
  position: relative;
  overflow: hidden;
}

.modal-content.win {
  background: linear-gradient(135deg, #fff 0%, #f5f5f5 100%);
}

.modal-content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #4caf50, #2196f3, #9c27b0);
}

.modal-header h2 {
  margin: 20px 0;
  font-size: 28px;
  color: #333;
}

.modal-body {
  margin-bottom: 30px;
  position: relative;
}

.stats-container {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-item.bonus {
  background: #fff3cd;
  margin: 10px -20px -10px;
  padding: 15px 20px;
  border-radius: 0 0 15px 15px;
  border-bottom: none;
}

.stat-label {
  font-size: 16px;
  color: #666;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  top: -20px;
  transform: rotate(45deg);
  animation: fall linear forwards;
}

.modal-footer {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.modal-btn {
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  min-width: 120px;
}

.modal-btn.primary {
  background: #4caf50;
  color: white;
}

.modal-btn.primary:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.modal-btn.secondary {
  background: #2196f3;
  color: white;
}

.modal-btn.secondary:hover {
  background: #1976d2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.modal-btn.outline {
  background: transparent;
  color: #666;
  border: 2px solid #ddd;
}

.modal-btn.outline:hover {
  background: #f5f5f5;
  border-color: #ccc;
  transform: translateY(-2px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fall {
  to {
    transform: translateY(400px) rotate(45deg);
  }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .modal-content {
    padding: 20px;
    margin: 20px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-btn {
    width: 100%;
  }
}
</style>
