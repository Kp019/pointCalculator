import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  name: string;
  avatarColor: string;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: (() => {
    const saved = localStorage.getItem("pointCalculator_user");
    return saved ? JSON.parse(saved) : null;
  })(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      const newUser = {
        name: action.payload,
        avatarColor: `from-primary-400 to-primary-600`, // Default
      };
      state.user = newUser;
      localStorage.setItem("pointCalculator_user", JSON.stringify(newUser));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("pointCalculator_user");
    },
    updateUser: (
      state,
      action: PayloadAction<{ name: string; color?: string }>,
    ) => {
      if (state.user) {
        state.user.name = action.payload.name;
        if (action.payload.color) {
          state.user.avatarColor = action.payload.color;
        }
        localStorage.setItem(
          "pointCalculator_user",
          JSON.stringify(state.user),
        );
      }
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
