import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export interface Modal {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: string | (() => void); // Action type or callback
  onCancel?: string | (() => void); // Action type or callback
  type?: "danger" | "info";
  payload?: any;
}

interface UIState {
  toasts: Toast[];
  modal: Modal;
}

const initialState: UIState = {
  toasts: [],
  modal: {
    isOpen: false,
    title: "",
    message: "",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, "id">>) => {
      const id = crypto.randomUUID();
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    showModal: (state, action: PayloadAction<Omit<Modal, "isOpen">>) => {
      state.modal = { ...action.payload, isOpen: true };
    },
    hideModal: (state) => {
      state.modal.isOpen = false;
    },
  },
});

export const { addToast, removeToast, showModal, hideModal } = uiSlice.actions;
export default uiSlice.reducer;
