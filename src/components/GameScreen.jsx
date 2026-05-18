import DixitLogo from "/images/dixit.png";
import ScoreGrid from "./ScoreGrid";
import ScoreTable from "./ScoreTable";
import PlayerBoardPiece from "./PlayerBoardPiece";
import { usePlayerPositions, readDraggedPlayerId, effectiveBoardScore } from "../utils/gameUtils";
import { Button } from "@mui/material";
import { useState, useMemo } from "react";
import BoardMoveConfirmBubble from "./BoardMoveConfirmBubble";
import { Icon } from "@iconify/react";


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

  const allOnStart = useMemo(
    () =>
      gameState.players.every((p) => effectiveBoardScore(p) === 0),
    [gameState.players]
  );

  return (
    <div className="max-w-lg mx-auto"> 
      <div
        className="mx-auto flex justify-between items-center cursor-pointer group"
        onClick={onLogoClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onLogoClick()}
        aria-label="Open confirmation to return to player setup"
      >
        <img src={DixitLogo} alt="Dixit Logo" className="w-42 drop-shadow-lg transition-transform duration-300 group-hover:scale-105" />
        <Button
          type="button"
          variant="contained"
          color="warning"
          size="medium"
          onClick={onLogoClick}
          className="normal-case font-bold inline-flex items-center gap-1"
          aria-haspopup="dialog"
        >
          <Icon icon="mdi:arrow-left" width={20} height={20} />
          Back to setup
        </Button>
      </div>
      {/* Scoreboard */}
      <div className="border border-gray-200/50 px-4 py-4.5 mb-4 rounded-2xl shadow-xl bg-white/60 backdrop-blur-sm">
        {/* Start Line */}
        <div className="bg-linear-to-bl from-emerald-400 to-emerald-600 text-white bordr-b-none border border-emerald-300 font-semibold text-xl rounded-t-xl shadow-lg overflow-hidden">
          <div className="flex absolute left-0 items-center justify-center text-md text-emerald-900 w-full font-medium pt-2 pb-1">
            <Icon
              color="emerald-900"
              icon={
                allOnStart
                  ? "streamline-ultimate:business-rabbit-hat"
                  : "fluent-emoji-high-contrast:rabbit-face"
              }
              width={20}
              height={20}
            />
            &nbsp;| Start Line
          </div>
          <div
            className={`relative w-full h-10 mt-8 flex items-center justify-center gap-5 transition-colors rounded-b-lg ${
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
            <div className="absolute w-full h-full flex items-center px-4">
              <div className="flex w-full justify-center gap-4">
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