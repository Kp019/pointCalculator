import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SavedGame } from "../../types/game";

const initialState: { savedGames: SavedGame[] } = {
  savedGames: (() => {
    const saved = localStorage.getItem("pointCalculator_savedGames");
    return saved ? JSON.parse(saved) : [];
  })(),
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    saveGame: (state, action: PayloadAction<SavedGame>) => {
      state.savedGames.unshift(action.payload);
      localStorage.setItem(
        "pointCalculator_savedGames",
        JSON.stringify(state.savedGames),
      );
    },
    deleteGame: (state, action: PayloadAction<string>) => {
      state.savedGames = state.savedGames.filter(
        (g) => g.id !== action.payload,
      );
      localStorage.setItem(
        "pointCalculator_savedGames",
        JSON.stringify(state.savedGames),
      );
    },
    clearHistory: (state) => {
      state.savedGames = [];
      localStorage.removeItem("pointCalculator_savedGames");
    },
    clearAll: (state) => {
      state.savedGames = [];
      localStorage.removeItem("pointCalculator_savedGames");
    },
  },
});

export const { saveGame, deleteGame, clearHistory, clearAll } =
  historySlice.actions;
export default historySlice.reducer;
