export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameState = {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  gameOver: boolean;
};