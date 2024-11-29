import { useState, useEffect, useCallback } from 'react';
import { GRID_SIZE, INITIAL_SNAKE_LENGTH } from './constants';
import { GameState, Position, Direction, Food } from './types';
import { SnakeVariant, SnakeSkin, GameBackground } from './configurations';

interface GameLogicProps {
  variant: SnakeVariant;
  skin: SnakeSkin;
  background: GameBackground;
}

export const useGameLogic = ({ variant }: GameLogicProps) => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [],
    direction: 'RIGHT',
    food: { x: 0, y: 0, type: 'normal', points: 1 },
    score: 0,
    isPlaying: false,
    gameOver: false,
    canPhaseWalls: variant.name === 'Ghost'
  });

  // Initialize game
  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    // Initialize snake in the middle of the grid
    const initialSnake: Position[] = [];
    const midY = Math.floor(GRID_SIZE / 2);
    const startX = Math.floor(GRID_SIZE / 3);

    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      initialSnake.push({ x: startX - i, y: midY });
    }

    setGameState({
      snake: initialSnake,
      direction: 'RIGHT',
      food: generateFood(initialSnake),
      score: 0,
      isPlaying: false,
      gameOver: false,
      canPhaseWalls: variant.name === 'Ghost'
    });
  };

  const generateFood = (snake: Position[]): Food => {
    let newFood: Position;
    const isBonusFood = Math.random() < 0.2; // 20% chance for bonus food

    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

    return {
      ...newFood,
      type: isBonusFood ? 'bonus' : 'normal',
      points: isBonusFood ? 5 : 1
    };
  };

  const moveSnake = useCallback(() => {
    setGameState(prevState => {
      if (prevState.gameOver || !prevState.isPlaying) return prevState;

      const newSnake = [...prevState.snake];
      const head = { ...newSnake[0] };

      // Move head
      switch (prevState.direction) {
        case 'UP':
          head.y += 1;  // Inverted Y-axis
          break;
        case 'DOWN':
          head.y -= 1;  // Inverted Y-axis
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        if (prevState.canPhaseWalls) {
          // Ghost snake can phase through walls once
          head.x = (head.x + GRID_SIZE) % GRID_SIZE;
          head.y = (head.y + GRID_SIZE) % GRID_SIZE;
          return {
            ...prevState,
            snake: [head, ...newSnake.slice(0, -1)],
            canPhaseWalls: false // Use up the wall phase ability
          };
        }
        return { ...prevState, gameOver: true };
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prevState, gameOver: true };
      }

      // Check food collision
      if (head.x === prevState.food.x && head.y === prevState.food.y) {
        newSnake.unshift(head);
        return {
          ...prevState,
          snake: newSnake,
          food: generateFood(newSnake),
          score: prevState.score + prevState.food.points
        };
      }

      // Normal movement
      newSnake.unshift(head);
      newSnake.pop();

      return { ...prevState, snake: newSnake };
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, variant.speed);

    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.gameOver, moveSnake, variant.speed]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameState.isPlaying && !gameState.gameOver) {
        setGameState(prev => ({ ...prev, isPlaying: true }));
      }

      let newDirection: Direction;
      switch (event.key) {
        case 'ArrowUp':
          newDirection = 'UP';
          break;
        case 'ArrowDown':
          newDirection = 'DOWN';
          break;
        case 'ArrowLeft':
          newDirection = 'LEFT';
          break;
        case 'ArrowRight':
          newDirection = 'RIGHT';
          break;
        default:
          return;
      }

      setGameState(prevState => {
        // Prevent 180-degree turns
        const opposites: Record<Direction, Direction> = {
          UP: 'DOWN',
          DOWN: 'UP',
          LEFT: 'RIGHT',
          RIGHT: 'LEFT'
        };
        if (opposites[newDirection] === prevState.direction) {
          return prevState;
        }
        return { ...prevState, direction: newDirection };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, gameState.gameOver]);

  // Rainbow snake effect
  useEffect(() => {
    if (variant.name === 'Rainbow' && gameState.isPlaying && !gameState.gameOver) {
      const interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          rainbowHue: ((prev.rainbowHue || 0) + 5) % 360
        }));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [variant.name, gameState.isPlaying, gameState.gameOver]);

  return { gameState, resetGame };
};