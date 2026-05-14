import { useCallback } from "react";
import { GAME_CONFIG, SCORE_GRID_PIECE_ANCHORS } from "../constants/gameConfig";

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

/**
 * Rewrite `scores` so their sum matches `targetTotal` (clamped to the board cap),
 * by changing only the most recent round (may go negative). Used when a board
 * drag-drop is confirmed so the next submit compares against the new tile.
 */
export function adjustScoresForTargetTotal(scores, targetTotal) {
  const cap = GAME_CONFIG.VICTORY_SCORE;
  const target = Math.min(
    Math.max(0, Math.floor(Number(targetTotal)) || 0),
    cap
  );
  const nextBase = Array.isArray(scores) ? scores.map((s) => Number(s) || 0) : [];
  const currentTotal = nextBase.reduce((a, b) => a + b, 0);
  const delta = target - currentTotal;

  if (delta === 0) {
    return { scores: nextBase, total: currentTotal };
  }

  if (nextBase.length === 0) {
    if (target === 0) return { scores: [], total: 0 };
    return { scores: [target], total: target };
  }

  const next = [...nextBase];
  next[next.length - 1] += delta;
  const newTotal = next.reduce((a, b) => a + b, 0);
  return { scores: next, total: newTotal };
}

function shuffleInPlace(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function pickRandomAvailableGridSlot(used) {
  const n = SCORE_GRID_PIECE_ANCHORS.length;
  const free = [];
  for (let s = 0; s < n; s++) {
    if (!used.has(s)) free.push(s);
  }
  if (free.length === 0) return 0;
  return free[Math.floor(Math.random() * free.length)];
}

/** Random slot on `targetScore` not taken by other players (excludes `playerId`). */
export function pickGridSlotForPlayerMove(players, playerId, targetScore) {
  const used = new Set();
  for (const p of players) {
    if (p.id === playerId) continue;
    if (
      effectiveBoardScore(p) === targetScore &&
      p.boardGridSlotIndex != null
    ) {
      const sl = p.boardGridSlotIndex;
      if (sl >= 0 && sl < SCORE_GRID_PIECE_ANCHORS.length) used.add(sl);
    }
  }
  return pickRandomAvailableGridSlot(used);
}

/**
 * After a scoring round, keep slots for anyone who stayed on the same tile;
 * assign random free slots for movers (and legacy null/colliding slots).
 */
export function resolveBoardGridSlotsAfterRound(prevPlayers, nextPlayers) {
  const oldScores = prevPlayers.map(effectiveBoardScore);
  const newScores = nextPlayers.map((p) => effectiveBoardScore(p));
  const result = nextPlayers.map((p) => ({ ...p }));

  const byScore = new Map();
  for (let i = 0; i < result.length; i++) {
    const s = newScores[i];
    if (s <= 0) {
      result[i].boardGridSlotIndex = null;
      continue;
    }
    if (!byScore.has(s)) byScore.set(s, []);
    byScore.get(s).push(i);
  }

  byScore.forEach((indices) => {
    const used = new Set();
    const floating = [];

    for (const i of indices) {
      if (oldScores[i] === newScores[i]) {
        const sl = prevPlayers[i].boardGridSlotIndex;
        if (
          typeof sl === "number" &&
          sl >= 0 &&
          sl < SCORE_GRID_PIECE_ANCHORS.length &&
          !used.has(sl)
        ) {
          used.add(sl);
          result[i].boardGridSlotIndex = sl;
          continue;
        }
      }
      floating.push(i);
    }

    shuffleInPlace(floating);
    for (const i of floating) {
      const sl = pickRandomAvailableGridSlot(used);
      used.add(sl);
      result[i].boardGridSlotIndex = sl;
    }
  });

  return result;
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
        const slotIndex =
          typeof player.boardGridSlotIndex === "number"
            ? player.boardGridSlotIndex % SCORE_GRID_PIECE_ANCHORS.length
            : playerIndex % SCORE_GRID_PIECE_ANCHORS.length;
        const anchor = SCORE_GRID_PIECE_ANCHORS[slotIndex];

        positions.push({
          player,
          playerIndex,
          topPosition: anchor.top,
          leftPosition: anchor.left,
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