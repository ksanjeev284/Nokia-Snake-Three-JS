import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CELL_SIZE, GRID_SIZE } from './constants';
import { GameState } from './types';
import { SnakeSkin, GameBackground } from './configurations';

interface SceneProps {
  gameState: GameState;
  background: GameBackground;
  skin: SnakeSkin;
}

export const Scene = ({ gameState, background, skin }: SceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const snakeRef = useRef<THREE.Group>();
  const [rainbowHue, setRainbowHue] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(background.backgroundColor);
    sceneRef.current = scene;

    // Camera setup
    const aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
    const viewSize = GRID_SIZE + 4;
    const camera = new THREE.OrthographicCamera(
      -viewSize * aspect / 2,
      viewSize * aspect / 2,
      viewSize / 2,
      -viewSize / 2,
      1,
      1000
    );
    camera.position.z = 10;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Grid and boundary setup
    const gridGeometry = new THREE.PlaneGeometry(GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    const gridMaterial = new THREE.MeshBasicMaterial({ 
      color: background.gridColor,
      side: THREE.DoubleSide 
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.position.z = -0.1;
    scene.add(grid);

    // Create walls
    const wallMaterial = new THREE.MeshBasicMaterial({ color: background.wallColor });
    const wallGeometry = new THREE.BoxGeometry(CELL_SIZE, CELL_SIZE, CELL_SIZE);

    for (let x = -1; x <= GRID_SIZE; x++) {
      for (let y = -1; y <= GRID_SIZE; y++) {
        if (x === -1 || x === GRID_SIZE || y === -1 || y === GRID_SIZE) {
          const wall = new THREE.Mesh(wallGeometry, wallMaterial);
          wall.position.set(
            (x - GRID_SIZE / 2 + 0.5) * CELL_SIZE,
            (y - GRID_SIZE / 2 + 0.5) * CELL_SIZE,
            0
          );
          scene.add(wall);
        }
      }
    }

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [background]);

  // Rainbow effect
  useEffect(() => {
    if (skin.isRainbow) {
      const interval = setInterval(() => {
        setRainbowHue(prev => (prev + 2) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [skin.isRainbow]);

  // Update snake appearance when skin changes
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove old snake if it exists
    if (snakeRef.current) {
      sceneRef.current.remove(snakeRef.current);
    }

    // Create new snake group
    const snakeGroup = new THREE.Group();
    snakeRef.current = snakeGroup;

    // Create snake segments
    const snakeGeometry = new THREE.BoxGeometry(CELL_SIZE * 0.8, CELL_SIZE * 0.8, CELL_SIZE * 0.8);
    const bodyColor = skin.isRainbow 
      ? new THREE.Color().setHSL(rainbowHue / 360, 1, 0.5)
      : new THREE.Color(skin.bodyColor);
    const snakeMaterial = new THREE.MeshBasicMaterial({ color: bodyColor });

    gameState.snake.forEach((segment, index) => {
      const snakeSegment = new THREE.Mesh(snakeGeometry, snakeMaterial);
      snakeSegment.position.set(
        (segment.x - GRID_SIZE / 2 + 0.5) * CELL_SIZE,
        (segment.y - GRID_SIZE / 2 + 0.5) * CELL_SIZE,
        0
      );

      // Add eyes to head
      if (index === 0) {
        const eyeGeometry = new THREE.SphereGeometry(CELL_SIZE * 0.15);
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: skin.eyeColor });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        
        // Position eyes based on direction
        const eyeOffsetSide = CELL_SIZE * 0.25;  // Offset from center for left/right positioning
        const eyeOffsetFront = CELL_SIZE * 0.25; // Offset from center for front positioning
        const eyeOffsetZ = CELL_SIZE * 0.3;      // How far the eyes stick out

        switch (gameState.direction) {
          case 'UP':
            leftEye.position.set(-eyeOffsetSide, eyeOffsetFront, eyeOffsetZ);
            rightEye.position.set(eyeOffsetSide, eyeOffsetFront, eyeOffsetZ);
            break;
          case 'DOWN':
            leftEye.position.set(-eyeOffsetSide, -eyeOffsetFront, eyeOffsetZ);
            rightEye.position.set(eyeOffsetSide, -eyeOffsetFront, eyeOffsetZ);
            break;
          case 'LEFT':
            leftEye.position.set(-eyeOffsetFront, eyeOffsetSide, eyeOffsetZ);
            rightEye.position.set(-eyeOffsetFront, -eyeOffsetSide, eyeOffsetZ);
            break;
          case 'RIGHT':
            leftEye.position.set(eyeOffsetFront, eyeOffsetSide, eyeOffsetZ);
            rightEye.position.set(eyeOffsetFront, -eyeOffsetSide, eyeOffsetZ);
            break;
        }
        
        snakeSegment.add(leftEye);
        snakeSegment.add(rightEye);
      }

      snakeGroup.add(snakeSegment);
    });

    sceneRef.current.add(snakeGroup);
  }, [gameState.snake, gameState.direction, skin, rainbowHue]);

  // Update food
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove old food
    const foodItems = sceneRef.current.children.filter(
      child => child.userData.isFood
    );
    foodItems.forEach(food => sceneRef.current?.remove(food));

    // Create new food
    const foodGeometry = new THREE.SphereGeometry(CELL_SIZE * 0.4);
    const foodMaterial = new THREE.MeshBasicMaterial({ 
      color: gameState.food.type === 'bonus' ? 0xf1c40f : 0xe74c3c,
      transparent: true,
      opacity: 0.8
    });
    const food = new THREE.Mesh(foodGeometry, foodMaterial);
    food.userData.isFood = true;
    food.position.z = 0.2; // Ensure food is above the grid
    
    food.position.set(
      (gameState.food.x - GRID_SIZE / 2 + 0.5) * CELL_SIZE,
      (gameState.food.y - GRID_SIZE / 2 + 0.5) * CELL_SIZE,
      0.2 // Keep food slightly above the grid
    );

    sceneRef.current.add(food);
  }, [gameState.food]);

  return <div ref={containerRef} className="w-full h-full" />;
};