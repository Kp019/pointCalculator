import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GameConfig, SavedRule } from "../../types/game";

const initialState: { savedRules: SavedRule[] } = {
  savedRules: (() => {
    const saved = localStorage.getItem("pointCalculator_savedRules");
    return saved ? JSON.parse(saved) : [];
  })(),
};

const rulesSlice = createSlice({
  name: "rules",
  initialState,
  reducers: {
    saveRule: (
      state,
      action: PayloadAction<{ id?: string; name: string; config: GameConfig }>,
    ) => {
      const { id, name, config } = action.payload;
      const existingIndex = id
        ? state.savedRules.findIndex((r) => r.id === id)
        : -1;

      const newRule: SavedRule = {
        id: id || crypto.randomUUID(),
        name,
        config,
      };

      if (existingIndex >= 0) {
        state.savedRules[existingIndex] = newRule;
      } else {
        state.savedRules.unshift(newRule);
      }

      localStorage.setItem(
        "pointCalculator_savedRules",
        JSON.stringify(state.savedRules),
      );
    },
    deleteRule: (state, action: PayloadAction<string>) => {
      state.savedRules = state.savedRules.filter(
        (r) => r.id !== action.payload,
      );
      localStorage.setItem(
        "pointCalculator_savedRules",
        JSON.stringify(state.savedRules),
      );
    },
  },
});

export const { saveRule, deleteRule } = rulesSlice.actions;
export default rulesSlice.reducer;
