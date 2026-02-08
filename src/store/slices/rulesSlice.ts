import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { GameConfig, SavedRule } from "../../types/game";
import { api } from "../../services/api";

interface RulesState {
  savedRules: SavedRule[];
  loading: boolean;
  error: string | null;
}

const initialState: RulesState = {
  savedRules: [],
  loading: false,
  error: null,
};

export const fetchRules = createAsyncThunk("rules/fetchRules", async () => {
  const response = await api.get<SavedRule[]>("/rules");
  return response.data;
});

export const saveRuleAsync = createAsyncThunk(
  "rules/saveRule",
  async (payload: { id?: string; name: string; config: GameConfig }) => {
    if (payload.id) {
      const { id, ...updateData } = payload;
      const response = await api.put<SavedRule>(`/rules/${id}`, updateData);
      return response.data;
    } else {
      const response = await api.post<SavedRule>("/rules", payload);
      return response.data;
    }
  },
);

export const deleteRuleAsync = createAsyncThunk(
  "rules/deleteRule",
  async (id: string) => {
    await api.delete(`/rules/${id}`);
    return id;
  },
);

const rulesSlice = createSlice({
  name: "rules",
  initialState,
  reducers: {
    clearRules: (state) => {
      state.savedRules = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rules
      .addCase(fetchRules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRules.fulfilled, (state, action) => {
        state.loading = false;
        state.savedRules = action.payload;
      })
      .addCase(fetchRules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch rules";
      })
      // Save Rule
      .addCase(saveRuleAsync.fulfilled, (state, action) => {
        const index = state.savedRules.findIndex(
          (r) => r.id === action.payload.id,
        );
        if (index >= 0) {
          state.savedRules[index] = action.payload;
        } else {
          state.savedRules.unshift(action.payload);
        }
      })
      // Delete Rule
      .addCase(deleteRuleAsync.fulfilled, (state, action) => {
        state.savedRules = state.savedRules.filter(
          (r) => r.id !== action.payload,
        );
      });
  },
});

export const { clearRules } = rulesSlice.actions;
export default rulesSlice.reducer;
