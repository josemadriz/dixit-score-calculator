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
export const createInitialPlayer = (index) => ({
  id: `player-${index + 1}`,
  name: `Player ${index + 1}`,
  color: PLAYER_COLORS[index % PLAYER_COLORS.length],
  scores: [],
  total: 0,
});

export const createInitialPlayers = () =>
  Array.from({ length: GAME_CONFIG.DEFAULT_PLAYER_COUNT }, (_, i) =>
    createInitialPlayer(i)
  ); 