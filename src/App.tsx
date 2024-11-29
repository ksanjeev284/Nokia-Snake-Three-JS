import { useGameLogic } from './game/useGameLogic';
import { Scene } from './game/Scene';
import { Gamepad2, Settings } from 'lucide-react';
import { useState } from 'react';
import { SNAKE_VARIANTS, SNAKE_SKINS, GAME_BACKGROUNDS } from './game/configurations';

function App() {
  const [selectedVariant, setSelectedVariant] = useState(SNAKE_VARIANTS[0]);
  const [selectedSkin, setSelectedSkin] = useState(SNAKE_SKINS[0]);
  const [selectedBackground, setSelectedBackground] = useState(GAME_BACKGROUNDS[0]);
  const [showCustomization, setShowCustomization] = useState(false);
  
  const { gameState, resetGame } = useGameLogic({
    variant: selectedVariant,
    skin: selectedSkin,
    background: selectedBackground,
  });

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-[#8ba67d] p-4 sm:p-8 rounded-xl shadow-2xl w-full max-w-[600px]">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-gray-800" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Nokia Snake</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCustomization(!showCustomization)}
              className="flex items-center gap-1 bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Customize</span>
            </button>
            <div className="text-gray-800 font-mono">Score: {gameState.score}</div>
            {gameState.food.type === 'bonus' && (
              <div className="animate-pulse text-yellow-600 font-mono text-sm sm:text-base">
                Bonus! (+{gameState.food.points})
              </div>
            )}
          </div>
        </div>

        {showCustomization && (
          <div className="mb-4 p-4 bg-gray-800 rounded-lg text-white">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <h3 className="font-bold mb-2">Snake Variant</h3>
                <select
                  value={selectedVariant.name}
                  onChange={(e) => setSelectedVariant(SNAKE_VARIANTS.find(v => v.name === e.target.value)!)}
                  className="w-full bg-gray-700 text-white rounded p-2"
                >
                  {SNAKE_VARIANTS.map(variant => (
                    <option key={variant.name} value={variant.name}>
                      {variant.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-400 mt-1">{selectedVariant.description}</p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Snake Skin</h3>
                <select
                  value={selectedSkin.name}
                  onChange={(e) => setSelectedSkin(SNAKE_SKINS.find(s => s.name === e.target.value)!)}
                  className="w-full bg-gray-700 text-white rounded p-2"
                >
                  {SNAKE_SKINS.map(skin => (
                    <option key={skin.name} value={skin.name}>
                      {skin.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-400 mt-1">{selectedSkin.description}</p>
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Background</h3>
                <select
                  value={selectedBackground.name}
                  onChange={(e) => setSelectedBackground(GAME_BACKGROUNDS.find(b => b.name === e.target.value)!)}
                  className="w-full bg-gray-700 text-white rounded p-2"
                >
                  {GAME_BACKGROUNDS.map(bg => (
                    <option key={bg.name} value={bg.name}>
                      {bg.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-400 mt-1">{selectedBackground.description}</p>
              </div>
            </div>
          </div>
        )}
        
        <div 
          className="aspect-square w-full border-8 border-[#9bbc7d] rounded-lg overflow-hidden shadow-lg"
          onTouchMove={(e) => e.preventDefault()}
          onTouchStart={(e) => e.preventDefault()}
        >
          <Scene gameState={gameState} background={selectedBackground} skin={selectedSkin} />
        </div>

        {gameState.gameOver && (
          <div className="mt-4 text-center">
            <p className="text-gray-800 font-bold mb-2">Game Over!</p>
            <button
              onClick={resetGame}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-700 text-center">
          {!gameState.isPlaying && !gameState.gameOver ? (
            <>
              <span className="hidden sm:inline">Press any arrow key to start</span>
              <span className="sm:hidden">Tap the screen to start and swipe to move</span>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;