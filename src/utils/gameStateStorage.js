import { GAME_CONFIG } from "../constants/gameConfig";

const DB_NAME = "dixit-score-calculator";
const DB_VERSION = 1;
const STORE_NAME = "game";
const STATE_KEY = "gameState";

function isValidGameState(data) {
  if (!data || typeof data !== "object") return false;
  const { players, roundScores, gameStarted, bgPosition } = data;
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
  if (
    !bgPosition ||
    typeof bgPosition !== "object" ||
    typeof bgPosition.x !== "number" ||
    typeof bgPosition.y !== "number"
  ) {
    return false;
  }
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
    return isValidGameState(raw) ? raw : null;
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
