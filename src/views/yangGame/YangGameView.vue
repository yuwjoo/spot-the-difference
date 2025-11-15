<template>
  <div class="yang-game-container">
    <!-- 游戏头部 -->
    <header class="game-header">
      <div class="header-left">
        <h1>🐑 乖了个乖</h1>
      </div>
      <div class="header-center">
        <div class="game-stats">
          <div class="stat-item">
            <span class="stat-label">关卡</span>
            <span class="stat-value">{{ level }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">分数</span>
            <span class="stat-value">{{ score }}</span>
          </div>
          <div class="stat-item time">
            <span class="stat-label">时间</span>
            <span
              class="stat-value"
              :class="{
                warning: timeRemaining < 30,
                danger: timeRemaining < 10,
              }"
            >
              {{ formatTime(timeRemaining) }}
            </span>
          </div>
        </div>
      </div>
      <div class="header-right">
        <button @click="showHelp" class="help-btn">?</button>
      </div>
    </header>

    <!-- 游戏提示 -->
    <div v-if="helpVisible" class="help-overlay" @click="closeHelp">
      <div class="help-content" @click.stop>
        <h3>游戏规则</h3>
        <ul>
          <li>只能点击并拿取最上层的图片</li>
          <li>当选中区域中有3个相同图案时，这些图案会自动消除</li>
          <li>在规定时间内消除所有图案即可通关</li>
          <li>选中区域最多可容纳7个图案</li>
          <li>时间用完或选中区域满且无法消除时游戏结束</li>
        </ul>
        <button @click="closeHelp" class="close-btn">明白了</button>
      </div>
    </div>

    <!-- 游戏主区域 -->
    <main class="game-main">
      <!-- 游戏棋盘 -->
      <GameBoard
        ref="gameBoardRef"
        :game-items="gameItems"
        :game-config="gameConfig"
        :is-top-visible-item="isTopVisibleItem"
        @select-item="handleItemSelect"
      />

      <!-- 选中区域 -->
      <SelectedArea
        :game-items="gameItems"
        :selected-items="selectedItems"
        :max-selected="gameConfig.maxSelected"
        :min-match-count="gameConfig.minMatchCount"
        @remove-item="handleRemoveItem"
      />
    </main>

    <!-- 游戏控制按钮 -->
    <div class="game-controls">
      <button
        @click="shuffleItems"
        class="control-btn shuffle-btn"
        :disabled="isGameOver"
      >
        🎲 洗牌
      </button>
      <button
        @click="useHint"
        class="control-btn hint-btn"
        :disabled="isGameOver || hintUsed"
      >
        🔍 提示 ({{ hintCount }})
      </button>
      <button @click="restartGame" class="control-btn restart-btn">
        🔄 重新开始
      </button>
    </div>

    <!-- 游戏结束弹窗 -->
    <GameOverModal
      :visible="isGameOver"
      :is-win="isWin"
      :level="level"
      :score="score"
      :total-time="totalTime"
      @restart="restartGame"
      @next-level="nextLevel"
      @close="goToHome"
    />

    <!-- 背景装饰 -->
    <div class="background-decorations">
      <div
        class="sheep"
        v-for="i in 6"
        :key="i"
        :style="getSheepStyle(i)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useYangGame } from "./gameLogic";
import GameBoard from "./components/GameBoard.vue";
import SelectedArea from "./components/SelectedArea.vue";
import GameOverModal from "./components/GameOverModal.vue";

// 路由
const router = useRouter();

// 游戏逻辑
const {
  level,
  score,
  timeRemaining,
  selectedItems,
  gameItems,
  isGameOver,
  isWin,
  totalTime,
  gameConfig,
  selectItem,
  isTopVisibleItem,
  shuffleItems,
  startGame,
  restartGame,
  decreaseTime,
} = useYangGame();

// 组件引用
const gameBoardRef = ref<InstanceType<typeof GameBoard> | null>(null);

// 游戏辅助状态
const helpVisible = ref(false);
const hintUsed = ref(false);
const hintCount = ref(3);
let timer: number | null = null;

// 格式化时间
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// 处理项目选择
function handleItemSelect(itemId: number) {
  // 找到itemId对应的索引
  const itemIndex = gameItems.value.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    // 获取选中前的selectedItems长度
    const prevSelectedLength = selectedItems.value.length;

    // 调用选择方法
    selectItem(itemIndex);

    // 检查是否有匹配项需要动画
    nextTick(() => {
      if (prevSelectedLength > selectedItems.value.length) {
        // 有项目被消除，添加动画效果
        const matchedIds = gameItems.value
          .filter(
            (item, idx) =>
              !item.visible && prevSelectedLength > idx && item.selected
          )
          .map((item) => item.id);

        matchedIds.forEach((id) => {
          gameBoardRef.value?.addMatchedItem(id);
        });
      }
    });
  }
}

// 处理移除选中项目
function handleRemoveItem(selectedIndex: number) {
  const itemId = selectedItems.value[selectedIndex];
  if (itemId !== undefined) {
    const itemIndex = gameItems.value.findIndex((item) => item.id === itemId);
    if (itemIndex !== -1) {
      // 调用selectItem方法来取消选择（利用其内部逻辑）
      selectItem(itemIndex);
    }
  }
}

// 使用提示
function useHint() {
  if (hintUsed.value || hintCount.value <= 0 || isGameOver.value) return;

  // 找到一个可以匹配的项目
  const visibleItems = gameItems.value.filter(
    (item) => item.visible && !item.selected
  );
  if (visibleItems.length > 0) {
    // 随机选择一个可见项目
    const randomItem =
      visibleItems[Math.floor(Math.random() * visibleItems.length)];

    // 高亮显示这个项目
    randomItem.selected = true;
    setTimeout(() => {
      randomItem.selected = false;
    }, 2000);

    // 减少提示次数
    hintCount.value--;
    hintUsed.value = true;

    // 30秒后重置提示
    setTimeout(() => {
      hintUsed.value = false;
    }, 30000);
  }
}

// 显示帮助
function showHelp() {
  helpVisible.value = true;
}

// 关闭帮助
function closeHelp() {
  helpVisible.value = false;
}

// 下一关
function nextLevel() {
  level.value++;
  // 增加游戏难度
  gameConfig.timeLimit = Math.max(60, 120 - (level.value - 1) * 10);
  startGame();
  hintCount.value = Math.max(1, 3 - (level.value - 1));
  hintUsed.value = false;
}

// 返回首页
function goToHome() {
  router.push("/");
}

// 获取背景羊的样式
function getSheepStyle(index: number) {
  const positions = [
    { top: "10%", left: "5%", size: "80px", rotation: "-15deg" },
    { top: "80%", left: "8%", size: "60px", rotation: "10deg" },
    { top: "20%", right: "10%", size: "70px", rotation: "5deg" },
    { top: "70%", right: "5%", size: "90px", rotation: "-10deg" },
    { top: "40%", left: "2%", size: "50px", rotation: "20deg" },
    { top: "50%", right: "3%", size: "65px", rotation: "-25deg" },
  ];

  const pos = positions[index - 1];
  return {
    top: pos.top,
    left: pos.left || "auto",
    right: pos.right || "auto",
    width: pos.size,
    height: pos.size,
    transform: `rotate(${pos.rotation})`,
    animationDelay: `${index * 0.5}s`,
  };
}

// 启动定时器
function startTimer() {
  if (timer) {
    clearInterval(timer);
  }

  timer = setInterval(() => {
    decreaseTime();
  }, 1000);
}

// 组件挂载
onMounted(() => {
  startGame();
  startTimer();
});

// 组件卸载
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.yang-game-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #80deea 100%);
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* 游戏头部 */
.game-header {
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.header-left h1 {
  margin: 0;
  color: #333;
  font-size: 32px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.game-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.stat-value.warning {
  color: #ff9800;
  animation: pulse 1s infinite;
}

.stat-value.danger {
  color: #f44336;
  animation: pulse 0.5s infinite;
}

.help-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2196f3;
  color: white;
  border: none;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.help-btn:hover {
  background: #1976d2;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

/* 帮助弹窗 */
.help-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
  backdrop-filter: blur(5px);
}

.help-content {
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease-out;
}

.help-content h3 {
  margin-top: 0;
  color: #333;
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.help-content ul {
  padding-left: 20px;
  margin-bottom: 30px;
}

.help-content li {
  margin-bottom: 10px;
  font-size: 16px;
  color: #666;
  line-height: 1.5;
}

.close-btn {
  width: 100%;
  padding: 12px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #45a049;
}

/* 游戏主区域 */
.game-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
}

/* 游戏控制按钮 */
.game-controls {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.control-btn {
  padding: 12px 24px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  min-width: 120px;
  position: relative;
  overflow: hidden;
}

.control-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.control-btn:hover::before {
  left: 100%;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.shuffle-btn {
  background: #ff9800;
  color: white;
}

.shuffle-btn:hover:not(:disabled) {
  background: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.hint-btn {
  background: #9c27b0;
  color: white;
}

.hint-btn:hover:not(:disabled) {
  background: #7b1fa2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
}

.restart-btn {
  background: #f44336;
  color: white;
}

.restart-btn:hover {
  background: #d32f2f;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

/* 背景装饰 */
.background-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.sheep {
  position: absolute;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="60" r="30" fill="white" stroke="black" stroke-width="2"/><circle cx="35" cy="50" r="5" fill="black"/><circle cx="65" cy="50" r="5" fill="black"/><path d="M40 65 Q50 75 60 65" stroke="black" stroke-width="2" fill="none"/><circle cx="40" cy="40" r="10" fill="white" stroke="black" stroke-width="2"/></svg>');
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.1;
  animation: float 8s ease-in-out infinite;
}

/* 动画 */
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

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(var(--rotation));
  }
  50% {
    transform: translateY(-20px) rotate(var(--rotation));
  }
  100% {
    transform: translateY(0) rotate(var(--rotation));
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .game-stats {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .stat-item {
    padding: 8px 15px;
  }

  .header-left h1 {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .yang-game-container {
    padding: 10px;
  }

  .header-left h1 {
    font-size: 24px;
  }

  .stat-item {
    padding: 6px 10px;
  }

  .stat-value {
    font-size: 20px;
  }

  .game-controls {
    gap: 10px;
  }

  .control-btn {
    padding: 10px 16px;
    font-size: 14px;
    min-width: 100px;
  }
}
</style>
