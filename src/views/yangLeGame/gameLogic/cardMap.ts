export interface Options {
  mapTemplate: ("x" | "o")[][]; // 地图模板
  arrangeRule: "random" | "fill" | "toLeft" | "toRight" | "toBottom" | "toTop"; // 分布规则
  cardCount: number; // 卡片数量
}

export function useCardMap(options: Options) {
  let cardMap: number[][][];

  switch (options.arrangeRule) {
    case "random":
      cardMap = randomRule(options);
      break;
  }
}

/**
 * 随机分布规则
 * @param options 配置
 */
function randomRule(options: Options): number[][][] {
  const cardMap: number[][][] = [];

  const availableZone: [x: number, y: number][] = [];
  options.mapTemplate.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "o") availableZone.push([x, y]);
    });
  });
  const availableZoneCount = availableZone.length;

  let count = options.cardCount;
  while (count-- > 0) {
    const index = Math.floor(Math.random() * availableZoneCount);
    const [x, y] = availableZone[index];
    let isDrop = false;
    for (let i = cardMap.length - 1; i >= 0; i--) {
      const nextI = i - 1;
      if (cardMap[i][y][x] <= 0) {
        cardMap[i][y][x] = 1;

        if (nextI >= 0) {
          const o = nextI % 2 === 0 ? -1 : 1;
          if (cardMap[nextI][y][x] === undefined) {
            console.log("333");
          }
        }

        isDrop = true;
        break;
      }
    }
  }

  return cardMap;
}
