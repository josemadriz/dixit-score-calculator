import {
  GAME_CONFIG,
  SCORE_GRID_PIECE_ANCHORS,
} from "../constants/gameConfig";

const DB_NAME = "dixit-score-calculator";
const DB_VERSION = 1;
const STORE_NAME = "game";
const STATE_KEY = "gameState";

function isValidGameState(data) {
  if (!data || typeof data !== "object") return false;
  const { players, roundScores, gameStarted } = data;
  if (!Array.isArray(players)) return false;
  if (
    players.length < GAME_CONFIG.MIN_PLAYERS ||
    players.length > GAME_CONFIG.MAX_PLAYERS
  ) {
    return false;
  }
  if (!Array.isArray(roundScores) || roundScores.length !== players.length) {
    return false;
  }
  if (typeof gameStarted !== "boolean") return false;
  for (const p of players) {
    if (
      !p ||
      typeof p.id !== "string" ||
      typeof p.name !== "string" ||
      typeof p.color !== "string" ||
      typeof p.total !== "number" ||
      !Array.isArray(p.scores)
    ) {
      return false;
    }
    for (const s of p.scores) {
      if (typeof s !== "number" || !Number.isFinite(s)) return false;
    }
    const o = p.boardPositionOverride;
    if (o != null) {
      if (
        typeof o !== "number" ||
        !Number.isInteger(o) ||
        o < 0 ||
        o > GAME_CONFIG.VICTORY_SCORE
      ) {
        return false;
      }
    }
    const g = p.boardGridSlotIndex;
    if (g != null) {
      if (
        typeof g !== "number" ||
        !Number.isInteger(g) ||
        g < 0 ||
        g >= SCORE_GRID_PIECE_ANCHORS.length
      ) {
        return false;
      }
    }
  }
  if (data.winner != null && typeof data.winner !== "string") return false;
  if (typeof data.showWinnerDialog !== "boolean") return false;
  if (typeof data.showResetDialog !== "boolean") return false;
  return true;
}

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
  });
}

export async function loadPersistedGameState() {
  if (typeof indexedDB === "undefined") return null;

  let db;
  try {
    db = await openDb();
    const raw = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(STATE_KEY);
      getReq.onsuccess = () => resolve(getReq.result);
      getReq.onerror = () => reject(getReq.error);
    });
    if (!isValidGameState(raw)) return null;
    const loaded = {
      ...raw,
      players: raw.players.map((p) => ({
        ...p,
        boardPositionOverride: p.boardPositionOverride ?? null,
        boardGridSlotIndex: p.boardGridSlotIndex ?? null,
      })),
    };
    delete loaded.bgPosition;
    return loaded;
  } catch {
    return null;
  } finally {
    db?.close();
  }
}

export async function persistGameState(state) {
  if (typeof indexedDB === "undefined" || !isValidGameState(state)) return;

  let db;
  try {
    db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const putReq = store.put(state, STATE_KEY);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    });
  } catch {
    // Private mode / quota / disabled storage — ignore
  } finally {
    db?.close();
  }
}
