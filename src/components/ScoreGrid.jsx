import { useState } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";
import PlayerBoardPiece from "./PlayerBoardPiece";
import { readDraggedPlayerId } from "../utils/gameUtils";

export default function ScoreGrid({
  gridPositions,
  onPlayerBoardMoveRequest,
  onDragSessionStart,
  onDragSessionEnd,
}) {
  const [dragOverScore, setDragOverScore] = useState(null);

  const handleDrop = (e, cellScore) => {
    e.preventDefault();
    setDragOverScore(null);
    const id = readDraggedPlayerId(e.dataTransfer);
    if (id) onPlayerBoardMoveRequest?.(id, cellScore, e.currentTarget);
  };

  return (
    <div className="grid grid-cols-5 gap-4 p-4 bg-linear-to-br from-gray-400 to-gray-500 rounded-b-xl shadow-inner justify-center items-center">
      {Array.from({ length: GAME_CONFIG.VICTORY_SCORE }, (_, i) => {
        const cellScore = i + 1;
        const isOver = dragOverScore === cellScore;
        return (
          <div
            key={cellScore}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              setDragOverScore(cellScore);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setDragOverScore((v) => (v === cellScore ? null : v));
              }
            }}
            onDrop={(e) => handleDrop(e, cellScore)}
            className={`relative max-w-full h-full aspect-square flex items-center justify-center border border-gray-300 bg-gray-100 hover:bg-gray-50 transition-all duration-200 ease-in-out rounded-lg shadow-sm hover:shadow-md hover:scale-105 font-bold text-gray-400 ${
              isOver ? "ring-2 ring-emerald-500 ring-offset-1 bg-emerald-50/60" : ""
            }`}
            aria-label={`Score ${cellScore}`}
          >
            {cellScore}
            {/* Slots 0–7 from player.boardGridSlotIndex (random free slot when entering tile) */}
            {gridPositions
              .filter((pos) => pos.score === cellScore)
              .map(({ player, topPosition, leftPosition }) => (
                <PlayerBoardPiece
                  key={player.id}
                  player={player}
                  size={30}
                  className="absolute"
                  onDragSessionStart={onDragSessionStart}
                  onDragSessionEnd={onDragSessionEnd}
                  style={{
                    top: `${topPosition}%`,
                    left: leftPosition,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
          </div>
        );
      })}
    </div>
  );
}
