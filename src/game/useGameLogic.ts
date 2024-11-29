import { useState, useEffect, useCallback } from 'react';
import { Position, Direction, GameState, Food, FoodType } from './types';
import { GRID_SIZE, INITIAL_SNAKE_LENGTH, MOVE_INTERVAL } from './constants';

const createInitialSnake = (): Position[] => {
  const snake: Position[] = [];
  const middle = Math.floor(GRID_SIZE / 2);
  
  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ x: middle, y: middle + i });
  }
  return snake;
};

const createRandomFood = (snake: Position[]): Food => {
  let position: Position;
  do {
    position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (snake.some(segment => segment.x === position.x && segment.y === position.y));

  // 20% chance of spawning bonus food
  const type: FoodType = Math.random() < 0.2 ? 'bonus' : 'normal';
  
  return {
    ...position,
    type,
    points: type === 'bonus' ? 5 : 1
  };
};

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(() => ({
    snake: createInitialSnake(),
    food: createRandomFood(createInitialSnake()),
    direction: 'UP',
    score: 0,
    gameOver: false,
    isPlaying: false
  }));

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  const moveSnake = useCallback(() => {
    if (gameState.gameOver || !gameState.isPlaying) return;

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
        newScore += prev.food.points;
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
  }, [gameState.gameOver, gameState.isPlaying]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameState.isPlaying && !gameState.gameOver) {
      setGameState(prev => ({
        ...prev,
        isPlaying: true
      }));
    }

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
  }, [gameState.isPlaying, gameState.gameOver]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    
    if (!gameState.isPlaying && !gameState.gameOver) {
      setGameState(prev => ({
        ...prev,
        isPlaying: true
      }));
    }
  }, [gameState.isPlaying, gameState.gameOver]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!touchStart) return;
    
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Determine if the swipe was primarily horizontal or vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      setGameState(prev => ({
        ...prev,
        direction: deltaX > 0 && prev.direction !== 'LEFT' ? 'RIGHT' : 
                  deltaX < 0 && prev.direction !== 'RIGHT' ? 'LEFT' : 
                  prev.direction
      }));
    } else {
      // Vertical swipe
      setGameState(prev => ({
        ...prev,
        direction: deltaY > 0 && prev.direction !== 'UP' ? 'DOWN' : 
                  deltaY < 0 && prev.direction !== 'DOWN' ? 'UP' : 
                  prev.direction
      }));
    }
    
    setTouchStart(null);
  }, [touchStart]);

  useEffect(() => {
    const interval = setInterval(moveSnake, MOVE_INTERVAL);
    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [moveSnake, handleKeyPress, handleTouchStart, handleTouchEnd]);

  const resetGame = () => {
    setGameState({
      snake: createInitialSnake(),
      food: createRandomFood(createInitialSnake()),
      direction: 'UP',
      score: 0,
      gameOver: false,
      isPlaying: false
    });
  };

  return { gameState, resetGame };
};