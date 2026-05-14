// Game configuration constants
export const GAME_CONFIG = {
  VICTORY_SCORE: 30,
  MIN_PLAYERS: 3,
  MAX_PLAYERS: 8,
  DEFAULT_PLAYER_COUNT: 3,
};

/** Per score cell: 4 corners + midpoint on each side (clockwise from top-left). */
export const SCORE_GRID_PIECE_ANCHORS = [
  { top: 10, left: "12%" },
  { top: 10, left: "50%" },
  { top: 10, left: "88%" },
  { top: 50, left: "88%" },
  { top: 90, left: "88%" },
  { top: 90, left: "50%" },
  { top: 90, left: "12%" },
  { top: 50, left: "12%" },
];

export const PLAYER_COLORS = [
  "#F72585", // Hot pink
  "#FCBF49", // Bright yellow
  "#2DC653", // Emerald green
  "#F77F00", // Vivid orange
  "#118AB2", // Ocean blue
  "#E63946", // Crimson red
  "#9B5DE5", // Purple
  "#444444", // Mint teal
];

// Helper functions
export const getDefaultPlayerName = (index) => `Player ${index + 1}`;

export const createInitialPlayer = (index) => ({
  id: `player-${index + 1}`,
  name: "",
  color: PLAYER_COLORS[index % PLAYER_COLORS.length],
  scores: [],
  total: 0,
  /** null = use total; number 0–VICTORY_SCORE = manual board position */
  boardPositionOverride: null,
  /** 0..7 anchor on current score tile; assigned when entering a cell */
  boardGridSlotIndex: null,
});

export const createInitialPlayers = () =>
  Array.from({ length: GAME_CONFIG.DEFAULT_PLAYER_COUNT }, (_, i) =>
    createInitialPlayer(i)
  );

/** Same roster shape as {@link createInitialPlayers}: count, empty names, default colors per index. */
export function isDefaultPlayerSetup(players) {
  if (players.length !== GAME_CONFIG.DEFAULT_PLAYER_COUNT) return false;
  return players.every((player, index) => {
    if (player.name.trim() !== "") return false;
    if (player.color !== PLAYER_COLORS[index % PLAYER_COLORS.length]) return false;
    return true;
  });
}

export function createInitialGameState() {
  return {
    players: createInitialPlayers(),
    gameStarted: false,
    roundScores: Array(GAME_CONFIG.DEFAULT_PLAYER_COUNT).fill(""),
    winner: null,
    showWinnerDialog: false,
    showResetDialog: false,
    bgPosition: { x: 50, y: 50 },
  };
}