import { useState, useEffect, useCallback } from 'react';
import { Position, Direction, GameState } from './types';
import { GRID_SIZE, INITIAL_SNAKE_LENGTH, MOVE_INTERVAL } from './constants';

const createInitialSnake = (): Position[] => {
  const snake: Position[] = [];
  const middle = Math.floor(GRID_SIZE / 2);
  
  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ x: middle, y: middle + i });
  }
  return snake;
};

const createRandomFood = (snake: Position[]): Position => {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));
  return food;
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: createInitialSnake(),
    food: createRandomFood(createInitialSnake()),
    direction: 'UP',
    score: 0,
    gameOver: false
  });

  const moveSnake = useCallback(() => {
    if (gameState.gameOver) return;

    setGameState(prev => {
      const head = { ...prev.snake[0] };
      
      switch (prev.direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        return { ...prev, gameOver: true };
      }

      // Check self collision
      if (prev.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, gameOver: true };
      }

      const newSnake = [head, ...prev.snake];
      let newFood = prev.food;
      let newScore = prev.score;

      // Check food collision
      if (head.x === prev.food.x && head.y === prev.food.y) {
        newFood = createRandomFood(newSnake);
        newScore += 1;
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore
      };
    });
  }, [gameState.gameOver]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    setGameState(prev => {
      const newDirection: Direction = (() => {
        switch (event.key) {
          case 'ArrowUp': return prev.direction !== 'DOWN' ? 'UP' : prev.direction;
          case 'ArrowDown': return prev.direction !== 'UP' ? 'DOWN' : prev.direction;
          case 'ArrowLeft': return prev.direction !== 'RIGHT' ? 'LEFT' : prev.direction;
          case 'ArrowRight': return prev.direction !== 'LEFT' ? 'RIGHT' : prev.direction;
          default: return prev.direction;
        }
      })();
      return { ...prev, direction: newDirection };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(moveSnake, MOVE_INTERVAL);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [moveSnake, handleKeyPress]);

  const resetGame = () => {
    setGameState({
      snake: createInitialSnake(),
      food: createRandomFood(createInitialSnake()),
      direction: 'UP',
      score: 0,
      gameOver: false
    });
  };

  return { gameState, resetGame };
};