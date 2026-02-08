import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { GameConfig, Player, Round } from "../../types/game";
import type { RootState } from "..";
import { api } from "../../services/api";

interface GameState {
  id: string | null;
  players: Player[];
  config: GameConfig | null;
  currentRound: number;
  gameStarted: boolean;
  gameEnded: boolean;
  winner: Player | null;
  rounds: Round[];
}

const initialState: GameState = {
  id: null,
  players: [],
  config: null,
  currentRound: 1,
  gameStarted: false,
  gameEnded: false,
  winner: null,
  rounds: [],
};

// Async Thunks
export const createGameAsync = createAsyncThunk(
  "game/createGame",
  async (payload: { playerNames: string[]; config: GameConfig }) => {
    const { playerNames, config } = payload;
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      scores: [],
      totalScore: 0,
    }));

    const gameData = {
      name: `Game ${new Date().toLocaleString()}`,
      config,
      players,
      rounds: [],
      currentRound: 1,
      winner: null,
    };

    const { data } = await api.post<any>("/games/", gameData);
    return data;
  },
);

export const updateGameAsync = createAsyncThunk(
  "game/updateGame",
  async (_, { getState }) => {
    const state = (getState() as RootState).game;
    if (!state.id) return;

    const gameUpdate = {
      players: state.players,
      rounds: state.rounds,
      currentRound: state.currentRound,
      winner: state.winner?.name || null,
    };

    const { data } = await api.put<any>(`/games/${state.id}`, gameUpdate);
    return data;
  },
);

export const loadGameAsync = createAsyncThunk(
  "game/loadGame",
  async (gameId: string) => {
    const { data } = await api.get<any>(`/games/${gameId}`);
    return data;
  },
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    startGame: (
      state,
      action: PayloadAction<{ playerNames: string[]; config: GameConfig }>,
    ) => {
      const { playerNames, config } = action.payload;
      state.players = playerNames.map((name, index) => ({
        id: `player-${index}`,
        name,
        scores: [],
        totalScore: 0,
      }));
      state.config = config;
      state.currentRound = 1;
      state.gameStarted = true;
      state.gameEnded = false;
      state.winner = null;
      state.rounds = [];
    },
    addRoundScores: (
      state,
      action: PayloadAction<{ [playerId: string]: number }>,
    ) => {
      if (state.gameEnded || !state.config) return;

      const scores = action.payload;
      const eliminatedIds = getEliminatedPlayerIds(state.players, state.config);

      const newRound: Round = {
        roundNumber: state.currentRound,
        scores: scores,
      };
      state.rounds.push(newRound);

      // Update player scores
      state.players.forEach((player) => {
        if (eliminatedIds.has(player.id)) {
          player.scores.push(0);
        } else {
          const roundScore = scores[player.id] || 0;
          player.scores.push(roundScore);
          player.totalScore += roundScore;
        }
      });

      state.currentRound++;

      // Check for Game End
      checkGameEnd(state);
    },
    updateScore: (
      state,
      action: PayloadAction<{
        playerId: string;
        roundIndex: number;
        newScore: number;
      }>,
    ) => {
      const { playerId, roundIndex, newScore } = action.payload;

      // Update the round record
      if (state.rounds[roundIndex]) {
        state.rounds[roundIndex].scores[playerId] = newScore;
      }

      // Update the player record
      const player = state.players.find((p) => p.id === playerId);
      if (player && player.scores[roundIndex] !== undefined) {
        player.scores[roundIndex] = newScore;
        player.totalScore = player.scores.reduce((sum, s) => sum + s, 0);
      }

      // Re-check game end in case a change un-ends or ends it
      checkGameEnd(state);
    },
    deleteScore: (
      state,
      action: PayloadAction<{ playerId: string; roundIndex: number }>,
    ) => {
      const { playerId, roundIndex } = action.payload;
      if (state.rounds[roundIndex]) {
        state.rounds[roundIndex].scores[playerId] = 0;
      }
      const player = state.players.find((p) => p.id === playerId);
      if (player && player.scores[roundIndex] !== undefined) {
        player.scores[roundIndex] = 0;
        player.totalScore = player.scores.reduce((sum, s) => sum + s, 0);
      }
      checkGameEnd(state);
    },
    resetGame: () => {
      return initialState;
    },
    loadGame: (state, action: PayloadAction<any>) => {
      state.id = action.payload.id || null;
      state.players = action.payload.players || [];
      state.rounds = action.payload.rounds || [];
      state.currentRound = action.payload.currentRound || 1;
      state.config = action.payload.config || null;
      state.gameStarted = true;
      state.gameEnded = false;
      checkGameEnd(state);
    },
    setGameId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createGameAsync.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.players = action.payload.players || [];
        state.config = action.payload.config;
        state.currentRound = action.payload.currentRound || 1;
        state.gameStarted = true;
        state.gameEnded = false;
        state.rounds = action.payload.rounds || [];
        checkGameEnd(state);
      })
      .addCase(loadGameAsync.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.players = action.payload.players || [];
        state.config = action.payload.config;
        state.currentRound = action.payload.currentRound || 1;
        state.gameStarted = true;
        state.gameEnded = false;
        state.rounds = action.payload.rounds || [];
        checkGameEnd(state);
      });
  },
});

function getEliminatedPlayerIds(players: Player[], config: GameConfig) {
  const eliminated = new Set<string>();
  if (!players || !Array.isArray(players)) return eliminated;
  if (config.gameMode === "elimination") {
    players.forEach((p) => {
      if (p.totalScore >= config.targetPoints) {
        eliminated.add(p.id);
      }
    });
  }
  return eliminated;
}

function checkGameEnd(state: GameState) {
  if (!state.config) return;

  const { winMetric, targetRounds, targetPoints, gameMode } = state.config;
  let ended = false;

  // Round limit reached
  if (winMetric === "rounds" || winMetric === "both") {
    if (state.rounds.length >= targetRounds) ended = true;
  }

  // Point limit reached
  if (!ended && (winMetric === "points" || winMetric === "both")) {
    if (gameMode === "sudden-death") {
      if (state.players.some((p) => p.totalScore >= targetPoints)) ended = true;
    } else {
      // Elimination mode
      const eliminatedIds = getEliminatedPlayerIds(state.players, state.config);
      const activePlayers = state.players.filter(
        (p) => !eliminatedIds.has(p.id),
      );
      if (activePlayers.length <= 1 && state.players.length > 1) ended = true;
    }
  }

  state.gameEnded = ended;
  if (ended) {
    const sorted = getSortedPlayers(state.players, state.config);
    state.winner = sorted[0] || null;
  } else {
    state.winner = null;
  }
}

function getSortedPlayers(players: Player[], config: GameConfig) {
  if (!players || !Array.isArray(players)) return [];
  const eliminatedIds = getEliminatedPlayerIds(players, config);
  return [...players].sort((a, b) => {
    const aEliminated = eliminatedIds.has(a.id);
    const bEliminated = eliminatedIds.has(b.id);

    if (aEliminated && !bEliminated) return 1;
    if (!aEliminated && bEliminated) return -1;

    if (config.winCondition === "highest") {
      return b.totalScore - a.totalScore;
    } else {
      return a.totalScore - b.totalScore;
    }
  });
}

// Selectors
export const selectEliminatedPlayerIds = (state: RootState) => {
  if (!state.game.config) return new Set<string>();
  return getEliminatedPlayerIds(state.game.players, state.game.config);
};

export const selectSortedPlayers = (state: RootState) => {
  if (!state.game.config) return state.game.players;
  return getSortedPlayers(state.game.players, state.game.config);
};

export const {
  startGame,
  addRoundScores,
  updateScore,
  deleteScore,
  resetGame,
  loadGame,
  setGameId,
} = gameSlice.actions;
export default gameSlice.reducer;
