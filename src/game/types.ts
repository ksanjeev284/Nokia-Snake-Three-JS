export type Position = {
  x: number;
  y: number;
};

export type FoodType = 'normal' | 'bonus';

export type Food = Position & {
  type: FoodType;
  points: number;
};

export type Direction = 'RIGHT' | 'LEFT' | 'UP' | 'DOWN';

export type GameState = {
  snake: Position[];
  food: Food;
  direction: Direction;
  score: number;
  gameOver: boolean;
  isPlaying: boolean;
  canPhaseWalls?: boolean;
  rainbowHue?: number;
};