import { ref, computed } from "vue";
import { useStickers } from "@/utils/sticker";
import type { StickerConfig } from "@/utils/sticker/types";
import type { GameItem, GameConfig, GameState } from "./types/gameItem";

export function useYangGame() {
  // 游戏状态
  const level = ref(1);
  const score = ref(0);
  const timeRemaining = ref(120);
  const selectedItems = ref<number[]>([]);
  const gameItems = ref<GameItem[]>([]);
  const isGameOver = ref(false);
  const isWin = ref(false);
  const totalTime = ref(0);
  let startTime: number | null = null;

  // 获取贴纸资源
  const stickers = useStickers();

  // 游戏配置
  const gameConfig: GameConfig = {
    boardWidth: 600,
    boardHeight: 600,
    itemWidth: 80,
    itemHeight: 80,
    maxSelected: 7, // 选中区域最多放7个图片
    minMatchCount: 3, // 3个相同的可以消除
    timeLimit: 120,
  };

  // 计算属性：可见的游戏项数量
  const visibleItemsCount = computed(() => {
    return gameItems.value.filter((item) => item.visible).length;
  });

  // 计算属性：检查选中区域是否有可消除的组合
  const hasMatchableItems = computed(() => {
    if (selectedItems.value.length < gameConfig.minMatchCount) return false;

    // 按类型分组选中的项目
    const typeGroups: Record<string, number[]> = {};
    selectedItems.value.forEach((index) => {
      const type = gameItems.value[index].type;
      if (!typeGroups[type]) {
        typeGroups[type] = [];
      }
      typeGroups[type].push(index);
    });

    // 检查是否有至少3个相同类型的组合
    return Object.values(typeGroups).some(
      (group) => group.length >= gameConfig.minMatchCount
    );
  });

  // 初始化游戏项
  function initGameItems(): GameItem[] {
    const items: GameItem[] = [];
    let id = 0;

    // 从stickers中提取图片资源
    const gameAssets: string[] = [];
    stickers.forEach((sticker: StickerConfig) => {
      // 添加原始图片
      gameAssets.push(sticker.originalImage);

      // 添加modified图片
      if (sticker.modifiedImages) {
        sticker.modifiedImages.forEach((img) => {
          gameAssets.push(img);
        });
      }
    });

    // 去重并确保有足够的不同类型
    const uniqueAssets = [...new Set(gameAssets)].slice(0, 10); // 限制最多10种不同类型

    // 计算网格位置，确保图片在游戏区域内且不会完全超出
    const gridCols = Math.floor(gameConfig.boardWidth / gameConfig.itemWidth);
    const gridRows = Math.floor(gameConfig.boardHeight / gameConfig.itemHeight);
    const positions: { top: number; left: number }[] = [];

    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        positions.push({
          top: row * (gameConfig.itemHeight * 0.8), // 80%的高度间距
          left: col * (gameConfig.itemWidth * 0.8), // 80%的宽度间距
        });
      }
    }

    // 每种类型创建多个实例
    uniqueAssets.forEach((asset, typeIndex) => {
      // 每种类型创建6个实例（确保能组成多组3个）
      for (let i = 0; i < 6; i++) {
        // 随机选择一个位置，但确保不会超出游戏区域
        const posIndex = Math.floor(Math.random() * positions.length);
        const position = positions[posIndex];

        // 微调位置，增加一些随机性
        const top = Math.max(
          0,
          Math.min(
            position.top + (Math.random() - 0.5) * gameConfig.itemHeight * 0.3, // ±15%的随机偏移
            gameConfig.boardHeight - gameConfig.itemHeight
          )
        );

        const left = Math.max(
          0,
          Math.min(
            position.left + (Math.random() - 0.5) * gameConfig.itemWidth * 0.3, // ±15%的随机偏移
            gameConfig.boardWidth - gameConfig.itemWidth
          )
        );

        items.push({
          id: id++,
          type: `type_${typeIndex}`,
          imageUrl: asset,
          visible: true,
          selected: false,
          top,
          left,
          zIndex: Math.floor(Math.random() * 30), // 增加zIndex范围，使堆叠更明显
          rotation: (Math.random() - 0.5) * 20, // -10到10度的随机旋转
        });
      }
    });

    return items;
  }

  // 判断一个图片是否在最上层（没有被其他非透明图片完全覆盖）
  function isTopVisibleItem(index: number): boolean {
    const item = gameItems.value[index];
    if (!item.visible || item.selected) return false;

    // 检查是否有其他图片在它上面且与它有重叠
    const itemCenterX = item.left + gameConfig.itemWidth / 2;
    const itemCenterY = item.top + gameConfig.itemHeight / 2;

    for (let i = 0; i < gameItems.value.length; i++) {
      const otherItem = gameItems.value[i];
      if (
        i !== index &&
        otherItem.visible &&
        !otherItem.selected &&
        otherItem.zIndex > item.zIndex
      ) {
        // 检查中心点是否在其他图片范围内
        if (
          itemCenterX >= otherItem.left &&
          itemCenterX <= otherItem.left + gameConfig.itemWidth &&
          itemCenterY >= otherItem.top &&
          itemCenterY <= otherItem.top + gameConfig.itemHeight
        ) {
          return false; // 有其他图片在上面且覆盖了中心点
        }
      }
    }

    return true; // 是最上层的图片
  }

  // 选择游戏项
  function selectItem(index: number): void {
    if (isGameOver.value || !gameItems.value[index].visible) return;

    const item = gameItems.value[index];

    // 如果已经选中，取消选中
    const selectedIndex = selectedItems.value.indexOf(index);
    if (selectedIndex > -1) {
      selectedItems.value.splice(selectedIndex, 1);
      item.selected = false;
      return;
    }

    // 检查是否是最上层的图片
    if (!isTopVisibleItem(index)) {
      return; // 不是最上层的图片，不能选择
    }

    // 如果选中区域已满，无法再选
    if (selectedItems.value.length >= gameConfig.maxSelected) {
      // 检查是否还有可消除的项，如果没有则游戏结束
      if (!hasMatchableItems.value) {
        endGame(false);
      }
      return;
    }

    // 选中项目（从游戏区域移动到选中区域）
    selectedItems.value.push(index);
    item.selected = true;

    // 检查是否可以消除
    checkForMatches();

    // 检查选中区域是否已满且没有可消除的项
    if (
      selectedItems.value.length >= gameConfig.maxSelected &&
      !hasMatchableItems.value
    ) {
      endGame(false);
    }
  }

  // 检查匹配项
  function checkForMatches(): void {
    if (selectedItems.value.length < gameConfig.minMatchCount) return;

    // 按类型分组选中的项目
    const typeGroups: Record<string, number[]> = {};
    selectedItems.value.forEach((index) => {
      const type = gameItems.value[index].type;
      if (!typeGroups[type]) {
        typeGroups[type] = [];
      }
      typeGroups[type].push(index);
    });

    // 消除匹配的组（必须恰好3个相同类型）
    let matchedCount = 0;
    Object.values(typeGroups).forEach((group) => {
      if (group.length >= gameConfig.minMatchCount) {
        // 只消除3个
        const groupToRemove = group.slice(0, gameConfig.minMatchCount);

        // 消除匹配的项目
        groupToRemove.forEach((index) => {
          gameItems.value[index].visible = false;
          gameItems.value[index].selected = false;
          const selectedIndex = selectedItems.value.indexOf(index);
          if (selectedIndex > -1) {
            selectedItems.value.splice(selectedIndex, 1);
          }
        });
        matchedCount += groupToRemove.length;

        // 增加分数
        score.value += groupToRemove.length * 10;
      }
    });

    // 检查游戏是否胜利
    if (matchedCount > 0) {
      checkWinCondition();
    }
  }

  // 检查胜利条件
  function checkWinCondition(): void {
    if (visibleItemsCount.value === 0) {
      endGame(true);
    }
  }

  // 洗牌
  function shuffleItems(): void {
    if (isGameOver.value) return;

    // 打乱可见且未选中项目的位置和堆叠顺序
    const visibleItems = gameItems.value.filter(
      (item) => item.visible && !item.selected
    );

    // 给每个项目新的zIndex，确保堆叠顺序变化
    visibleItems.forEach((item, index) => {
      item.zIndex = index; // 重新分配zIndex
    });

    // 打乱位置，但确保在游戏区域内
    visibleItems.forEach((item) => {
      item.top = Math.max(
        0,
        Math.min(
          Math.random() * (gameConfig.boardHeight - gameConfig.itemHeight),
          gameConfig.boardHeight - gameConfig.itemHeight
        )
      );
      item.left = Math.max(
        0,
        Math.min(
          Math.random() * (gameConfig.boardWidth - gameConfig.itemWidth),
          gameConfig.boardWidth - gameConfig.itemWidth
        )
      );
    });
  }

  // 开始游戏
  function startGame(): void {
    level.value = 1;
    score.value = 0;
    timeRemaining.value = gameConfig.timeLimit;
    selectedItems.value = [];
    gameItems.value = initGameItems();
    isGameOver.value = false;
    isWin.value = false;
    startTime = Date.now();
  }

  // 结束游戏
  function endGame(win: boolean): void {
    isGameOver.value = true;
    isWin.value = win;

    if (startTime) {
      totalTime.value = Math.floor((Date.now() - startTime) / 1000);
    }
  }

  // 重新开始游戏
  function restartGame(): void {
    startGame();
  }

  // 减少时间
  function decreaseTime(): void {
    if (!isGameOver.value) {
      timeRemaining.value--;
      if (timeRemaining.value <= 0) {
        endGame(false);
      }
    }
  }

  // 获取游戏状态
  function getGameState(): GameState {
    return {
      level: level.value,
      score: score.value,
      timeRemaining: timeRemaining.value,
      selectedItems: selectedItems.value,
      gameItems: gameItems.value,
      isGameOver: isGameOver.value,
      isWin: isWin.value,
      totalTime: totalTime.value,
    };
  }

  return {
    // 状态
    level,
    score,
    timeRemaining,
    selectedItems,
    gameItems,
    isGameOver,
    isWin,
    totalTime,
    visibleItemsCount,
    hasMatchableItems,
    gameConfig,

    // 方法
    selectItem,
    isTopVisibleItem,
    shuffleItems,
    startGame,
    restartGame,
    endGame,
    decreaseTime,
    getGameState,
  };
}
