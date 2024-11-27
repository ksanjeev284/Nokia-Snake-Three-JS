export type Position = {
  x: number;
  y: number;
};

export type FoodType = 'normal' | 'bonus';

export type Food = Position & {
  type: FoodType;
  points: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameState = {
  snake: Position[];
  food: Food;
  direction: Direction;
  score: number;
  gameOver: boolean;
  isPlaying: boolean;
};