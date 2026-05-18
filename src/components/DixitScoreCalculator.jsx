import PlayerSetup from "./PlayerSetup";
import GameScreen from "./GameScreen";
import GameDialogs from "./GameDialogs";
import { useGameState } from "../hooks/useGameState";

export default function DixitScoreCalculator() {
  const {
    gameState,
    storageReady,
    handleScoreChange,
    updatePlayer,
    addPlayer,
    removePlayer,
    startGame,
    submitScores,
    resetGame,
    resetPlayerSetupToDefaults,
    handleLogoClick,
    closeWinnerDialog,
    closeResetDialog,
    boardMoveConfirm,
    requestBoardMove,
    confirmBoardMove,
    cancelBoardMove,
    onBoardPieceDragStart,
    onBoardPieceDragEnd,
  } = useGameState();

  return (
    <div className="min-h-screen bg-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        {storageReady && (
          <>
            <GameDialogs
              showWinnerDialog={gameState.showWinnerDialog}
              showResetDialog={gameState.showResetDialog}
              winner={gameState.winner}
              onCloseWinnerDialog={closeWinnerDialog}
              onCloseResetDialog={closeResetDialog}
              onResetGame={resetGame}
            />
            {!gameState.gameStarted ? (
              <PlayerSetup
                players={gameState.players}
                onUpdatePlayer={updatePlayer}
                onAddPlayer={addPlayer}
                onRemovePlayer={removePlayer}
                onResetPlayerSetupToDefaults={resetPlayerSetupToDefaults}
                onStartGame={startGame}
              />
            ) : (
              <GameScreen
                gameState={gameState}
                onLogoClick={handleLogoClick}
                onScoreChange={handleScoreChange}
                onSubmitScores={submitScores}
                onPlayerBoardMoveRequest={requestBoardMove}
                boardMoveConfirm={boardMoveConfirm}
                onConfirmBoardMove={confirmBoardMove}
                onCancelBoardMove={cancelBoardMove}
                onBoardPieceDragStart={onBoardPieceDragStart}
                onBoardPieceDragEnd={onBoardPieceDragEnd}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
