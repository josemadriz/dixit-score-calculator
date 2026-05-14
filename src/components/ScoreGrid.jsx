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
    <div className="grid grid-cols-5 gap-2 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-inner border border-gray-200/50">
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
            className={`relative max-w-[75px] h-[75px] flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 ease-in-out rounded-lg shadow-sm hover:shadow-md hover:scale-105 font-medium text-gray-700 ${
              isOver ? "ring-2 ring-emerald-500 ring-offset-1 bg-emerald-50/60" : ""
            }`}
          >
            {cellScore}
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
