import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import gameReducer from "./slices/gameSlice";
import historyReducer from "./slices/historySlice";
import rulesReducer from "./slices/rulesSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    history: historyReducer,
    rules: rulesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["ui/showModal"],
        ignoredPaths: ["ui.modal.onConfirm", "ui.modal.onCancel"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks (Optional but recommended)
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
