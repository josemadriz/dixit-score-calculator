import { GAME_CONFIG } from "../constants/gameConfig";
import { Icon } from "@iconify/react";

export default function ScoreGrid({ gridPositions }) {
  return (
    <div className="grid grid-cols-5 gap-2 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-inner border border-gray-200/50">
      {Array.from({ length: GAME_CONFIG.VICTORY_SCORE }, (_, i) => (
        <div
          key={i + 1}
          className="relative max-w-[75px] h-[75px] flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 ease-in-out rounded-lg shadow-sm hover:shadow-md hover:scale-105 font-medium text-gray-700"
        >
          {i + 1}
          {gridPositions
            .filter(pos => pos.score === i + 1)
            .map(({ player, topPosition, leftPosition }) => (
              <Icon
                key={player.id}
                icon="mdi:rabbit"
                width={18}
                height={18}
                className="absolute"
                style={{
                  color: player.color,
                  top: `${topPosition}%`,
                  left: leftPosition,
                  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))",
                  transform: "translate(-50%, -50%)",
                }}
                title={player.name}
                aria-label={`${player.name} at position ${i + 1}`}
              />
            ))}
        </div>
      ))}
    </div>
  );
} 