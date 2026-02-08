import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { SavedGame } from "../../types/game";
import { api } from "../../services/api";

interface HistoryState {
  savedGames: SavedGame[];
  loading: boolean;
  error: string | null;
}

const initialState: HistoryState = {
  savedGames: [],
  loading: false,
  error: null,
};

export const fetchHistory = createAsyncThunk(
  "history/fetchHistory",
  async () => {
    const { data } = await api.get<SavedGame[]>("/games/");
    return data;
  },
);

export const saveGameAsync = createAsyncThunk(
  "history/saveGame",
  async (game: SavedGame) => {
    const { data } = await api.post<SavedGame>("/games/", game);
    return data;
  },
);

export const updateGameAsync = createAsyncThunk(
  "history/updateGame",
  async (game: SavedGame) => {
    const { id, ...updateData } = game;
    const { data } = await api.put<SavedGame>(`/games/${id}/`, updateData);
    return data;
  },
);

export const deleteGameAsync = createAsyncThunk(
  "history/deleteGame",
  async (id: string) => {
    await api.delete(`/games/${id}/`);
    return id;
  },
);

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    clearHistory: (state) => {
      state.savedGames = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch History
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.savedGames = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch history";
      })
      // Save Game
      .addCase(saveGameAsync.fulfilled, (state, action) => {
        state.savedGames.unshift(action.payload);
      })
      // Update Game
      .addCase(updateGameAsync.fulfilled, (state, action) => {
        const index = state.savedGames.findIndex(
          (g) => g.id === action.payload.id,
        );
        if (index !== -1) {
          state.savedGames[index] = action.payload;
        }
      })
      // Delete Game
      .addCase(deleteGameAsync.fulfilled, (state, action) => {
        state.savedGames = state.savedGames.filter(
          (g) => g.id !== action.payload,
        );
      });
  },
});

export const { clearHistory } = historySlice.actions;
export default historySlice.reducer;
