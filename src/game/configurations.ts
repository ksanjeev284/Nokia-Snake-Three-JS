export interface SnakeVariant {
  name: string;
  color: number;
  speed: number;
  specialAbility?: string;
  description: string;
}

export interface SnakeSkin {
  name: string;
  bodyColor: number;
  eyeColor: number;
  pattern?: string;
  isRainbow?: boolean;
  description: string;
}

export interface GameBackground {
  name: string;
  backgroundColor: number;
  gridColor: number;
  wallColor: number;
  description: string;
  theme: string;
}

export const SNAKE_VARIANTS: SnakeVariant[] = [
  {
    name: "Classic",
    color: 0x2c3e50,
    speed: 150,
    description: "The classic Nokia snake experience"
  },
  {
    name: "Speedy",
    color: 0xe74c3c,
    speed: 100,
    description: "A faster snake for experienced players"
  },
  {
    name: "Ghost",
    color: 0x95a5a6,
    speed: 150,
    specialAbility: "Can pass through walls once",
    description: "Can phase through walls one time per game"
  }
];

export const SNAKE_SKINS: SnakeSkin[] = [
  {
    name: "Classic",
    bodyColor: 0x2c3e50,
    eyeColor: 0xffffff,
    description: "The original Nokia snake look"
  },
  {
    name: "Golden",
    bodyColor: 0xf1c40f,
    eyeColor: 0x2c3e50,
    pattern: "metallic",
    description: "A luxurious golden snake"
  },
  {
    name: "Rainbow",
    bodyColor: 0x00ff00,
    eyeColor: 0xffffff,
    isRainbow: true,
    pattern: "rainbow",
    description: "A colorful snake that changes colors as it moves"
  },
  {
    name: "Neon",
    bodyColor: 0x3498db,
    eyeColor: 0xe74c3c,
    pattern: "glow",
    description: "A glowing neon snake"
  },
  {
    name: "Dragon",
    bodyColor: 0xc0392b,
    eyeColor: 0xf1c40f,
    pattern: "scales",
    description: "A fierce dragon-like appearance"
  }
];

export const GAME_BACKGROUNDS: GameBackground[] = [
  {
    name: "Classic",
    backgroundColor: 0x8ba67d,
    gridColor: 0x9bbc7d,
    wallColor: 0x34495e,
    description: "The classic Nokia screen look",
    theme: "retro"
  },
  {
    name: "Desert",
    backgroundColor: 0xf4d03f,
    gridColor: 0xf5d76e,
    wallColor: 0xc0392b,
    description: "A warm desert theme",
    theme: "nature"
  },
  {
    name: "Ocean",
    backgroundColor: 0x3498db,
    gridColor: 0x2980b9,
    wallColor: 0x2c3e50,
    description: "A deep ocean theme",
    theme: "nature"
  },
  {
    name: "Space",
    backgroundColor: 0x2c3e50,
    gridColor: 0x34495e,
    wallColor: 0x8e44ad,
    description: "A cosmic space theme",
    theme: "fantasy"
  },
  {
    name: "Forest",
    backgroundColor: 0x27ae60,
    gridColor: 0x2ecc71,
    wallColor: 0x795548,
    description: "A lush forest theme",
    theme: "nature"
  }
];
