import DixitLogo from "/images/dixit.png";
import ScoreGrid from "./ScoreGrid";
import ScoreTable from "./ScoreTable";
import GameDialogs from "./GameDialogs";
import { usePlayerPositions } from "../utils/gameUtils";
import { Icon } from "@iconify/react";

export default function GameScreen({ 
  gameState, 
  onLogoClick, 
  onScoreChange, 
  onSubmitScores,
  onCloseWinnerDialog,
  onCloseResetDialog,
  onResetGame
}) {
  const { getPlayerStartPositions, getGridPositions } = usePlayerPositions();
  const startPositions = getPlayerStartPositions(gameState.players);
  const gridPositions = getGridPositions(gameState.players);

  return (
    <div>
      <div
        className="flex justify-center cursor-pointer group"
        onClick={onLogoClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onLogoClick()}
        aria-label="Click to reset game"
      >
        <img src={DixitLogo} alt="Dixit Logo" className="w-42 drop-shadow-lg transition-transform duration-300 group-hover:scale-105" />
      </div>

      {/* Scoreboard */}
      <div className="border border-gray-200/50 p-4 mb-4 rounded-xl shadow-xl bg-white/95 backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🏆 Dixit Scoreboard
        </h1>
        
        {/* Start Line */}
        <div className="bg-gradient-to-r from-emerald-400 to-emerald-600 text-white border border-emerald-300 font-semibold text-xl mb-4 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-center text-xl w-full font-bold pt-2 pb-1">
            🚀 Start Line
          </div>
          <div className="relative w-full h-10 flex items-center justify-between">
            <div className="absolute w-full h-full flex items-center justify-between px-4">
              <div className="flex w-full justify-between">
                {startPositions.map(({ player }) => (
                  <Icon
                    key={player.id}
                    icon="mdi:rabbit"
                    width={24}
                    height={24}
                    style={{ color: player.color, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))" }}
                    title={player.name}
                    aria-label={`${player.name} at start position`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Score Grid */}
        <ScoreGrid players={gameState.players} gridPositions={gridPositions} />
      </div>

      {/* Score Table */}
      <ScoreTable 
        players={gameState.players}
        roundScores={gameState.roundScores}
        onScoreChange={onScoreChange}
        onSubmitScores={onSubmitScores}
      />

      {/* Game Dialogs */}
      <GameDialogs
        showWinnerDialog={gameState.showWinnerDialog}
        showResetDialog={gameState.showResetDialog}
        winner={gameState.winner}
        onCloseWinnerDialog={onCloseWinnerDialog}
        onCloseResetDialog={onCloseResetDialog}
        onResetGame={onResetGame}
      />
    </div>
  );
} 