import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { COLORS, CELL_SIZE, GRID_SIZE } from './constants';
import { GameState } from './types';

interface SceneProps {
  gameState: GameState;
}

export const Scene = ({ gameState }: SceneProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.OrthographicCamera>();
  const rendererRef = useRef<THREE.WebGLRenderer>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.BACKGROUND);
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

    // Grid
    const gridGeometry = new THREE.PlaneGeometry(GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
    const gridMaterial = new THREE.MeshBasicMaterial({ 
      color: COLORS.GRID,
      side: THREE.DoubleSide 
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    scene.add(grid);

    // Cleanup
    return () => {
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    // Clear previous objects
    scene.children = scene.children.filter(child => child.userData.type !== 'game');

    // Create snake segments
    const snakeGeometry = new THREE.BoxGeometry(CELL_SIZE * 0.9, CELL_SIZE * 0.9, CELL_SIZE * 0.2);
    const snakeMaterial = new THREE.MeshBasicMaterial({ color: COLORS.SNAKE });

    gameState.snake.forEach((segment, index) => {
      const mesh = new THREE.Mesh(snakeGeometry, snakeMaterial);
      mesh.position.set(
        segment.x - GRID_SIZE / 2 + CELL_SIZE / 2,
        -segment.y + GRID_SIZE / 2 - CELL_SIZE / 2,
        0.1
      );
      mesh.userData.type = 'game';
      scene.add(mesh);
    });

    // Create food
    const foodGeometry = new THREE.CircleGeometry(CELL_SIZE * 0.3, 16);
    const foodMaterial = new THREE.MeshBasicMaterial({ color: COLORS.FOOD });
    const food = new THREE.Mesh(foodGeometry, foodMaterial);
    food.position.set(
      gameState.food.x - GRID_SIZE / 2 + CELL_SIZE / 2,
      -gameState.food.y + GRID_SIZE / 2 - CELL_SIZE / 2,
      0.1
    );
    food.userData.type = 'game';
    scene.add(food);

    // Render
    renderer.render(scene, camera);
  }, [gameState]);

  return <div ref={containerRef} className="w-full h-full" />;
};