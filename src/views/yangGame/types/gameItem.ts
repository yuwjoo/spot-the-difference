export interface GameItem {
  id: number;
  type: string;
  imageUrl: string;
  visible: boolean;
  selected: boolean;
  top: number;
  left: number;
  zIndex: number;
  rotation: number;
}

export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  itemWidth: number;
  itemHeight: number;
  maxSelected: number;
  minMatchCount: number;
  timeLimit: number;
}

export interface GameState {
  level: number;
  score: number;
  timeRemaining: number;
  selectedItems: number[];
  gameItems: GameItem[];
  isGameOver: boolean;
  isWin: boolean;
  totalTime: number;
}
