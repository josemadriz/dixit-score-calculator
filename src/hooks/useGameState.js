import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  GAME_CONFIG,
  createInitialGameState,
  getDefaultPlayerName,
  PLAYER_COLORS,
} from "../constants/gameConfig";
import {
  loadPersistedGameState,
  persistGameState,
} from "../utils/gameStateStorage";
import { effectiveBoardScore } from "../utils/gameUtils";

const PERSIST_DEBOUNCE_MS = 300;

export function useGameState() {
  const [gameState, setGameState] = useState(createInitialGameState);
  const [storageHydrated, setStorageHydrated] = useState(false);
  const [boardMoveConfirm, setBoardMoveConfirm] = useState(null);

  const dropCommittedRef = useRef(false);
  const boardDragSessionRef = useRef(null);
  const pendingBoardMoveRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const saved = await loadPersistedGameState();
      if (!cancelled && saved) setGameState(saved);
      if (!cancelled) setStorageHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!storageHydrated) return;
    const t = setTimeout(() => {
      persistGameState(gameState);
    }, PERSIST_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [gameState, storageHydrated]);

  // Memoized values for performance
  const canAddPlayer = useMemo(
    () => gameState.players.length < GAME_CONFIG.MAX_PLAYERS,
    [gameState.players.length]
  );

  const canRemovePlayer = useMemo(
    () => gameState.players.length > GAME_CONFIG.MIN_PLAYERS,
    [gameState.players.length]
  );

  // Input validation function
  const validateScore = useCallback((value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) return 0;
    if (numValue < 0) return 0; // Prevent negative scores
    return numValue;
  }, []);

  // Event handlers
  const handleScoreChange = useCallback((index, value) => {
    setGameState(prev => ({
      ...prev,
      roundScores: prev.roundScores.map((score, i) => 
        i === index ? value : score
      ),
    }));
  }, []);

  const updatePlayer = useCallback((index, key, value) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map((player, i) =>
        i === index ? { ...player, [key]: value } : player
      ),
    }));
  }, []);

  const addPlayer = useCallback(() => {
    if (!canAddPlayer) return;

    setGameState(prev => ({
      ...prev,
      players: [
        ...prev.players,
        {
          id: `player-${prev.players.length + 1}`,
          name: "",
          color: PLAYER_COLORS[prev.players.length % PLAYER_COLORS.length],
          scores: [],
          total: 0,
          boardPositionOverride: null,
        },
      ],
      roundScores: [...prev.roundScores, ""],
    }));
  }, [canAddPlayer]);

  const removePlayer = useCallback((index) => {
    if (!canRemovePlayer) return;

    setGameState(prev => ({
      ...prev,
      players: prev.players.filter((_, i) => i !== index),
      roundScores: prev.roundScores.filter((_, i) => i !== index),
    }));
  }, [canRemovePlayer]);

  const startGame = useCallback(() => {
    pendingBoardMoveRef.current = null;
    setBoardMoveConfirm(null);
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      players: prev.players.map((player, index) => ({
        ...player,
        name: player.name.trim() || getDefaultPlayerName(index),
        boardPositionOverride: null,
      })),
      roundScores: Array(prev.players.length).fill(""),
    }));
  }, []);

  const submitScores = useCallback(() => {
    pendingBoardMoveRef.current = null;
    setBoardMoveConfirm(null);
    setGameState(prev => {
      const newPlayers = prev.players.map((player, index) => {
        const newScore = validateScore(prev.roundScores[index]);
        const newTotal = player.total + newScore;

        return {
          ...player,
          scores: [...player.scores, newScore],
          total: newTotal,
          boardPositionOverride: null,
        };
      });

      const winningPlayer = newPlayers.find(
        player => player.total >= GAME_CONFIG.VICTORY_SCORE
      );

      return {
        ...prev,
        players: newPlayers,
        roundScores: Array(newPlayers.length).fill(""),
        winner: winningPlayer?.name || null,
        showWinnerDialog: !!winningPlayer,
      };
    });
  }, [validateScore]);

  /** Full reset: scores cleared and UI returns to player setup (gameStarted: false). */
  const resetGame = useCallback(() => {
    pendingBoardMoveRef.current = null;
    setBoardMoveConfirm(null);
    setGameState(createInitialGameState());
  }, []);

  const handleLogoClick = useCallback(() => {
    if (gameState.gameStarted) {
      setGameState(prev => ({ ...prev, showResetDialog: true }));
    }
  }, [gameState.gameStarted]);

  const handleMouseMove = useCallback((e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setGameState(prev => ({ ...prev, bgPosition: { x, y } }));
  }, []);

  const closeWinnerDialog = useCallback(() => {
    setGameState(prev => ({ ...prev, showWinnerDialog: false }));
  }, []);

  const closeResetDialog = useCallback(() => {
    setGameState(prev => ({ ...prev, showResetDialog: false }));
  }, []);

  const setPlayerBoardPosition = useCallback((playerId, slot) => {
    const clamped = Math.min(
      Math.max(0, Math.floor(slot)),
      GAME_CONFIG.VICTORY_SCORE
    );
    setGameState(prev => ({
      ...prev,
      players: prev.players.map((p) => {
        if (p.id !== playerId) return p;
        if (clamped === p.total || (clamped === 0 && p.total === 0)) {
          return { ...p, boardPositionOverride: null };
        }
        return { ...p, boardPositionOverride: clamped };
      }),
    }));
  }, []);

  const onBoardPieceDragStart = useCallback((player) => {
    boardDragSessionRef.current = {
      playerId: player.id,
      previousOverride: player.boardPositionOverride,
    };
    dropCommittedRef.current = false;
  }, []);

  const onBoardPieceDragEnd = useCallback(() => {
    if (!dropCommittedRef.current) {
      boardDragSessionRef.current = null;
    }
    dropCommittedRef.current = false;
  }, []);

  const requestBoardMove = useCallback(
    (playerId, slot, anchorEl) => {
      const session = boardDragSessionRef.current;
      if (!session || session.playerId !== playerId) return;

      const player = gameState.players.find((p) => p.id === playerId);
      if (!player) return;

      const clamped = Math.min(
        Math.max(0, Math.floor(slot)),
        GAME_CONFIG.VICTORY_SCORE
      );

      dropCommittedRef.current = true;

      if (clamped === effectiveBoardScore(player)) {
        boardDragSessionRef.current = null;
        return;
      }

      pendingBoardMoveRef.current = { playerId, slot: clamped };
      setBoardMoveConfirm({
        playerId,
        slot: clamped,
        playerName: player.name,
        playerColor: player.color,
        anchorEl: anchorEl ?? null,
      });
    },
    [gameState.players]
  );

  const confirmBoardMove = useCallback(() => {
    const pending = pendingBoardMoveRef.current;
    pendingBoardMoveRef.current = null;
    setBoardMoveConfirm(null);
    if (pending) {
      setPlayerBoardPosition(pending.playerId, pending.slot);
    }
  }, [setPlayerBoardPosition]);

  const cancelBoardMove = useCallback(() => {
    pendingBoardMoveRef.current = null;
    setBoardMoveConfirm(null);
  }, []);

  return {
    gameState,
    storageReady: storageHydrated,
    canAddPlayer,
    canRemovePlayer,
    handleScoreChange,
    updatePlayer,
    addPlayer,
    removePlayer,
    startGame,
    submitScores,
    resetGame,
    handleLogoClick,
    handleMouseMove,
    closeWinnerDialog,
    closeResetDialog,
    boardMoveConfirm,
    requestBoardMove,
    confirmBoardMove,
    cancelBoardMove,
    onBoardPieceDragStart,
    onBoardPieceDragEnd,
  };
} 