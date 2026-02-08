import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "../../services/api";

// Types
interface User {
  id: string;
  email: string;
  username: string;
  name?: string; // For backward compatibility
  avatar_url?: string;
  avatar_color?: string;
  avatarColor?: string; // UI property (legacy/shim)
  token?: string; // JWT token
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: AuthState = {
  user: (() => {
    const saved = localStorage.getItem("pointCalculator_user");
    return saved ? JSON.parse(saved) : null;
  })(),
  loading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/login", credentials);
      // The backend returns { access_token, token_type, user: { ... } }
      const { access_token, user } = response.data;
      return { ...user, token: access_token };
    } catch (error: any) {
      let errorMessage =
        error.response?.data?.detail ||
        "Login failed. Please check your credentials.";
      if (
        errorMessage.includes("email rate exceeded") ||
        errorMessage.includes("rate limit")
      ) {
        errorMessage =
          "Too many attempts. Please wait a moment before trying again.";
      }
      return rejectWithValue(errorMessage);
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (
    userData: { email: string; password: string; username: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/auth/signup", userData);
      const { access_token, user } = response.data;
      return { ...user, token: access_token };
    } catch (error: any) {
      let errorMessage =
        error.response?.data?.detail || "Signup failed. Please try again.";
      if (
        errorMessage.includes("email rate exceeded") ||
        errorMessage.includes("rate limit")
      ) {
        errorMessage =
          "Too many attempts. Please wait a moment before trying again.";
      }
      return rejectWithValue(errorMessage);
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await api.post("/auth/logout");
    return null;
  } catch (error: any) {
    // Even if logout fails on server, we clear local state
    return null;
  }
});

export const updateProfileAsync = createAsyncThunk(
  "auth/updateProfile",
  async (
    updateData: { username?: string; avatar_color?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put("/auth/me", updateData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to update profile",
      );
    }
  },
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch profile",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Manual update (e.g. profile update)
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem(
          "pointCalculator_user",
          JSON.stringify(state.user),
        );
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem(
        "pointCalculator_user",
        JSON.stringify(action.payload),
      );
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Signup
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem(
        "pointCalculator_user",
        JSON.stringify(action.payload),
      );
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      localStorage.removeItem("pointCalculator_user");
    });

    // Update Profile
    builder.addCase(updateProfileAsync.fulfilled, (state, action) => {
      if (state.user) {
        const updatedUser = { ...state.user, ...action.payload };
        // Sync avatarColor shim if needed
        if (action.payload.avatar_color) {
          updatedUser.avatarColor = action.payload.avatar_color;
        }
        state.user = updatedUser;
        localStorage.setItem(
          "pointCalculator_user",
          JSON.stringify(updatedUser),
        );
      }
    });

    // Fetch Profile
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      if (state.user) {
        const updatedUser = { ...state.user, ...action.payload };
        // Sync avatarColor shim if needed
        if (action.payload.avatar_color) {
          updatedUser.avatarColor = action.payload.avatar_color;
        }
        state.user = updatedUser;
        localStorage.setItem(
          "pointCalculator_user",
          JSON.stringify(updatedUser),
        );
      }
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
