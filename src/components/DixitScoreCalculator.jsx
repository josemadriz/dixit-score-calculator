import PlayerSetup from "./PlayerSetup";
import GameScreen from "./GameScreen";
import { useGameState } from "../hooks/useGameState";

export default function DixitScoreCalculator() {
  const {
    gameState,
    handleScoreChange,
    updatePlayer,
    addPlayer,
    removePlayer,
    startGame,
    submitScores,
    resetGame,
    handleLogoClick,
    handleMouseMove,
    closeWinnerDialog,
    closeResetDialog,
  } = useGameState();

  return (
    <div
      className="min-h-screen bg-cover bg-center p-4"
      style={{
        backgroundImage: "url('/images/bg.png')",
        backgroundPosition: `${gameState.bgPosition.x}% ${gameState.bgPosition.y}%`,
        backgroundAttachment: "fixed",
      }}
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-lg mx-auto">
        {!gameState.gameStarted ? (
          <PlayerSetup
            players={gameState.players}
            onUpdatePlayer={updatePlayer}
            onAddPlayer={addPlayer}
            onRemovePlayer={removePlayer}
            onStartGame={startGame}
          />
        ) : (
          <GameScreen
            gameState={gameState}
            onLogoClick={handleLogoClick}
            onScoreChange={handleScoreChange}
            onSubmitScores={submitScores}
            onCloseWinnerDialog={closeWinnerDialog}
            onCloseResetDialog={closeResetDialog}
            onResetGame={resetGame}
          />
        )}
      </div>
    </div>
  );
}
