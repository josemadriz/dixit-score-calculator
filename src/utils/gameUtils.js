import { useCallback } from "react";
import { GAME_CONFIG } from "../constants/gameConfig";

export const DIXIT_PLAYER_DRAG_MIME = "application/x-dixit-player-id";

export function effectiveBoardScore(player) {
  const raw =
    player.boardPositionOverride != null
      ? player.boardPositionOverride
      : player.total;
  const n = Math.floor(Number(raw)) || 0;
  return Math.min(Math.max(0, n), GAME_CONFIG.VICTORY_SCORE);
}

export function readDraggedPlayerId(dataTransfer) {
  try {
    return (
      dataTransfer.getData(DIXIT_PLAYER_DRAG_MIME) ||
      dataTransfer.getData("text/plain")
    );
  } catch {
    return "";
  }
}

// Memoized player positioning logic
export const usePlayerPositions = () => {
  const getPlayerStartPositions = useCallback((players) => {
    const positions = [];
    const playerCount = players.length;
    const leftCount = Math.ceil(playerCount / 2);

    players.forEach((player, index) => {
      if (effectiveBoardScore(player) === 0) {
        const isLeft = index < leftCount;
        positions.push({
          player,
          index,
          isLeft,
          position: isLeft ? index : index - leftCount,
        });
      }
    });

    return positions;
  }, []);

  const getGridPositions = useCallback((players) => {
    const positions = [];

    players.forEach((player, playerIndex) => {
      const score = effectiveBoardScore(player);
      if (score > 0 && score <= GAME_CONFIG.VICTORY_SCORE) {
        const topPosition = Math.floor(playerIndex / 2) * 26 + 4;
        const leftPosition = playerIndex % 2 === 0 ? "5%" : "80%";

        positions.push({
          player,
          playerIndex,
          topPosition,
          leftPosition,
          score,
        });
      }
    });

    return positions;
  }, []);

  return {
    getPlayerStartPositions,
    getGridPositions,
  };
};