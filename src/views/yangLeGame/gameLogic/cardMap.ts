export interface Options {
  mapTemplate: ("x" | "o")[][]; // 地图模板
  arrangeRule: "random" | "fill" | "toLeft" | "toRight" | "toBottom" | "toTop"; // 分布规则
  cardCount: number; // 卡片数量
}

export interface CardData {
  x: number;
  y: number;
  z: number;
  isTop: boolean;
}

export function useCardMap(options: Options) {
  const { availablePointMap, availablePointArr } = initAvailableZone(
    options.mapTemplate
  );

  let cardMap: number[][][] = [];
  let cardArr: [x: number, y: number, z: number][] = [];
  switch (options.arrangeRule) {
    case "random": {
      const data = randomRule(options, availablePointMap, availablePointArr);
      cardMap = data.cardMap;
      cardArr = data.cardArr;
      break;
    }
  }

  /**
   * 获取卡片数据列表
   * @returns 卡片数据列表
   */
  function getCardDataList(): CardData[] {
    const cardDataList: CardData[] = [];
    cardMap.forEach((layer, z) => {
      layer.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell > -1) {
            cardDataList.push({
              x,
              y,
              z,
              isTop: cell === 0,
            });
          }
        });
      });
    });
    return cardDataList;
  }

  /**
   * 移除卡片
   * @param param 卡片位置信息
   * @returns 卡片数据列表
   */
  function removeCard({
    x,
    y,
    z,
  }: Pick<CardData, "x" | "y" | "z">): CardData[] {
    if (cardMap[z][y][x] === 0) {
      cardMap[z][y][x] = -1;

      for (let i = z - 1; i >= 0; i--) {
        if (cardMap[i][y][x] > 0) cardMap[i][y][x] -= 1;
        if (cardMap[i][y]?.[x - 1] > 0) cardMap[i][y][x - 1] -= 1;
        if (cardMap[i][y]?.[x + 1] > 0) cardMap[i][y][x + 1] -= 1;
        if (cardMap[i][y - 1]?.[x] > 0) cardMap[i][y - 1][x] -= 1;
        if (cardMap[i][y - 1]?.[x - 1] > 0) cardMap[i][y - 1][x - 1] -= 1;
        if (cardMap[i][y - 1]?.[x + 1] > 0) cardMap[i][y - 1][x + 1] -= 1;
        if (cardMap[i][y + 1]?.[x] > 0) cardMap[i][y + 1][x] -= 1;
        if (cardMap[i][y + 1]?.[x - 1] > 0) cardMap[i][y + 1][x - 1] -= 1;
        if (cardMap[i][y + 1]?.[x + 1] > 0) cardMap[i][y + 1][x + 1] -= 1;
      }
    }

    return getCardDataList();
  }

  return { cardDataList: getCardDataList(), removeCard };
}

/**
 * 初始化可用区域
 * @param mapTemplate map模板
 * @returns {availablePointMap: ("x" | "o")[][];availablePointArr: [x: number, y: number][];} 可用区域数据
 */
function initAvailableZone(mapTemplate: ("x" | "o")[][]): {
  availablePointMap: ("x" | "o")[][];
  availablePointArr: [x: number, y: number][];
} {
  const availablePointMap: ("x" | "o")[][] = []; // 可用点位map
  const availablePointArr: [x: number, y: number][] = []; // 可用点位arr

  const setPoint = (x: number, y: number) => {
    availablePointMap[y][x] = "o";
    availablePointArr.push([x, y]);
  }; // 设置可用点位

  mapTemplate.forEach((row, y) => {
    // 初始化可用点位map数据
    for (let i = Math.min(1, y); i >= 0; i--) {
      availablePointMap.push(Array(row.length * 2 - 1).fill("x"));
    }

    row.forEach((cell, x) => {
      if (cell !== "o") return;
      const mY = y * 2;
      const mX = x * 2;
      const isTO = mapTemplate[y - 1]?.[x] === "o";
      const isLO = mapTemplate[y][x - 1] === "o";
      const isTLO = mapTemplate[y - 1]?.[x - 1] === "o";
      setPoint(mX, mY);
      if (isTO) setPoint(mX, mY - 1);
      if (isLO) setPoint(mX - 1, mY);
      if (isTO && isLO && isTLO) setPoint(mX - 1, mY - 1);
    });
  });

  return { availablePointMap, availablePointArr };
}

/**
 * 随机分布规则
 * @param options 配置
 */
function randomRule(
  options: Options,
  availablePointMap: ("x" | "o")[][],
  availablePointArr: [x: number, y: number][]
): { cardMap: number[][][]; cardArr: [x: number, y: number, z: number][] } {
  const cardMap: number[][][] = [];
  const cardArr: [x: number, y: number, z: number][] = [];
  const availablePointArrCount = availablePointArr.length;

  let count = options.cardCount;
  while (count-- > 0) {
    const index = Math.floor(Math.random() * availablePointArrCount);
    const [x, y] = availablePointArr[index];
    let z = -1;
    for (let i = cardMap.length - 1; i >= 0; i--) {
      if (
        cardMap[i][y][x] === -1 &&
        (cardMap[i][y]?.[x - 1] ?? -1) === -1 &&
        (cardMap[i][y]?.[x + 1] ?? -1) === -1 &&
        (cardMap[i][y - 1]?.[x] ?? -1) === -1 &&
        (cardMap[i][y - 1]?.[x - 1] ?? -1) === -1 &&
        (cardMap[i][y - 1]?.[x + 1] ?? -1) === -1 &&
        (cardMap[i][y + 1]?.[x] ?? -1) === -1 &&
        (cardMap[i][y + 1]?.[x - 1] ?? -1) === -1 &&
        (cardMap[i][y + 1]?.[x + 1] ?? -1) === -1
      ) {
        z = i;
      } else {
        break;
      }
    }

    if (z === -1) {
      z = cardMap.length;
      cardMap[z] = availablePointMap.map((row) => row.map(() => -1));
    }

    cardMap[z][y][x] = 0;
    cardArr.push([x, y, z]);

    for (let i = z - 1; i >= 0; i--) {
      if (cardMap[i][y][x] >= 0) cardMap[i][y][x] += 1;
      if (cardMap[i][y]?.[x - 1] >= 0) cardMap[i][y][x - 1] += 1;
      if (cardMap[i][y]?.[x + 1] >= 0) cardMap[i][y][x + 1] += 1;
      if (cardMap[i][y - 1]?.[x] >= 0) cardMap[i][y - 1][x] += 1;
      if (cardMap[i][y - 1]?.[x - 1] >= 0) cardMap[i][y - 1][x - 1] += 1;
      if (cardMap[i][y - 1]?.[x + 1] >= 0) cardMap[i][y - 1][x + 1] += 1;
      if (cardMap[i][y + 1]?.[x] >= 0) cardMap[i][y + 1][x] += 1;
      if (cardMap[i][y + 1]?.[x - 1] >= 0) cardMap[i][y + 1][x - 1] += 1;
      if (cardMap[i][y + 1]?.[x + 1] >= 0) cardMap[i][y + 1][x + 1] += 1;
    }
  }

  return { cardMap, cardArr };
}
