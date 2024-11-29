import { useGameLogic } from './game/useGameLogic';
import { Scene } from './game/Scene';
import { Gamepad2 } from 'lucide-react';

function App() {
  const { gameState, resetGame } = useGameLogic();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-[#8ba67d] p-4 sm:p-8 rounded-xl shadow-2xl w-full max-w-[600px]">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-gray-800" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Nokia Snake</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-gray-800 font-mono">Score: {gameState.score}</div>
            {gameState.food.type === 'bonus' && (
              <div className="animate-pulse text-yellow-600 font-mono text-sm sm:text-base">
                Bonus! (+{gameState.food.points})
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
            <>
              <span className="hidden sm:inline">Press any arrow key to start</span>
              <span className="sm:hidden">Tap the screen to start and swipe to move</span>
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Use arrow keys to control the snake</span>
              <span className="sm:hidden">Swipe to change direction</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;