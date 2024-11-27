import { useGameLogic } from './game/useGameLogic';
import { Scene } from './game/Scene';
import { Gamepad2 } from 'lucide-react';

function App() {
  const { gameState, resetGame } = useGameLogic();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-[#8ba67d] p-8 rounded-xl shadow-2xl w-[600px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-gray-800" />
            <h1 className="text-2xl font-bold text-gray-800">Nokia Snake</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-gray-800 font-mono">Score: {gameState.score}</div>
            {gameState.food.type === 'bonus' && (
              <div className="animate-pulse text-yellow-600 font-mono">
                Bonus Food! (+{gameState.food.points} pts)
              </div>
            )}
          </div>
        </div>
        
        <div className="aspect-square w-full border-8 border-[#9bbc7d] rounded-lg overflow-hidden shadow-lg">
          <Scene gameState={gameState} />
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
            'Press any arrow key to start'
          ) : (
            'Use arrow keys to control the snake'
          )}
        </div>
      </div>
    </div>
  );
}

export default App;