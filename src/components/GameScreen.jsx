import DixitLogo from "/images/dixit.png";
import ScoreGrid from "./ScoreGrid";
import ScoreTable from "./ScoreTable";
import PlayerBoardPiece from "./PlayerBoardPiece";
import { usePlayerPositions, readDraggedPlayerId } from "../utils/gameUtils";
import { Button } from "@mui/material";
import { useState } from "react";
import BoardMoveConfirmBubble from "./BoardMoveConfirmBubble";

export default function GameScreen({ 
  gameState, 
  onLogoClick, 
  onScoreChange, 
  onSubmitScores,
  onPlayerBoardMoveRequest,
  boardMoveConfirm,
  onConfirmBoardMove,
  onCancelBoardMove,
  onBoardPieceDragStart,
  onBoardPieceDragEnd,
}) {
  const [startLineDragOver, setStartLineDragOver] = useState(false);
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
        aria-label="Open confirmation to return to player setup"
      >
        <img src={DixitLogo} alt="Dixit Logo" className="w-42 drop-shadow-lg transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className="flex justify-end m-3 ">
        <Button
          type="button"
          variant="contained"
          color="warning"
          size="medium"
          onClick={onLogoClick}
          className="text-normal-case font-bold"
          aria-haspopup="dialog"
        >
          Back to setup
        </Button>
      </div>

      {/* Scoreboard */}
      <div className="border border-gray-200/50 p-4 mb-4 rounded-xl shadow-xl bg-white/95 backdrop-blur-sm">
        <h1 className="text-2xl font-bold mb-3 text-center bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Scoreboard
        </h1>
        
        {/* Start Line */}
        <div className="bg-linear-to-r from-emerald-400 to-emerald-600 text-white border border-emerald-300 font-semibold text-xl mb-4 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-center text-xl w-full font-bold pt-2 pb-1">
            🚀 Start Line
          </div>
          <div
            className={`relative w-full h-10 flex items-center justify-between transition-colors rounded-b-lg ${
              startLineDragOver ? "bg-white/15 ring-2 ring-white/80 ring-inset" : ""
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setStartLineDragOver(true);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget))
                setStartLineDragOver(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setStartLineDragOver(false);
              const id = readDraggedPlayerId(e.dataTransfer);
              if (id) onPlayerBoardMoveRequest?.(id, 0, e.currentTarget);
            }}
          >
            <div className="absolute w-full h-full flex items-center justify-between px-4">
              <div className="flex w-full justify-between">
                {startPositions.map(({ player }) => (
                  <PlayerBoardPiece
                    key={player.id}
                    player={player}
                    size={30}
                    onDragSessionStart={onBoardPieceDragStart}
                    onDragSessionEnd={onBoardPieceDragEnd}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Score Grid */}
        <ScoreGrid
          gridPositions={gridPositions}
          onPlayerBoardMoveRequest={onPlayerBoardMoveRequest}
          onDragSessionStart={onBoardPieceDragStart}
          onDragSessionEnd={onBoardPieceDragEnd}
        />
      </div>

      <BoardMoveConfirmBubble
        confirm={boardMoveConfirm}
        onConfirm={onConfirmBoardMove}
        onCancel={onCancelBoardMove}
      />

      {/* Score Table */}
      <ScoreTable 
        players={gameState.players}
        roundScores={gameState.roundScores}
        onScoreChange={onScoreChange}
        onSubmitScores={onSubmitScores}
      />
    </div>
  );
} 