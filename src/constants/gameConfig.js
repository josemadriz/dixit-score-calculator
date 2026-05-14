// Game configuration constants
export const GAME_CONFIG = {
  VICTORY_SCORE: 30,
  MIN_PLAYERS: 3,
  MAX_PLAYERS: 8,
  DEFAULT_PLAYER_COUNT: 3,
};

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
});

export const createInitialPlayers = () =>
  Array.from({ length: GAME_CONFIG.DEFAULT_PLAYER_COUNT }, (_, i) =>
    createInitialPlayer(i)
  );

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