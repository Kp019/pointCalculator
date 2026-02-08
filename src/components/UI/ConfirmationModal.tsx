import React from "react";
import Modal from "./Modal";
import { useAppSelector, useAppDispatch } from "../../store";
import { hideModal } from "../../store/slices/uiSlice";
import { logoutUser } from "../../store/slices/authSlice";

const ConfirmationModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    isOpen,
    title,
    message,
    confirmLabel,
    cancelLabel,
    onConfirm,
    type,
    payload,
  } = useAppSelector((state) => state.ui.modal);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      if (typeof onConfirm === "function") {
        onConfirm();
      } else {
        const actions = onConfirm.split(",");
        actions.forEach((action) => {
          const actionType = action.trim();
          if (actionType === "auth/logout") {
            dispatch(logoutUser());
          } else {
            dispatch({ type: actionType, payload: payload });
          }
        });
      }
    }
    dispatch(hideModal());
  };

  const handleCancel = () => {
    dispatch(hideModal());
  };

  const isDanger = type === "danger";

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <div className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isDanger
                ? "bg-rose-100 text-rose-600"
                : "bg-primary-100 text-primary-600"
            }`}
          >
            {isDanger ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 15c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
          </div>
          <h3 className="text-2xl font-black text-slate-900 leading-tight">
            {title}
          </h3>
        </div>

        <p className="text-slate-600 font-medium mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={handleConfirm}
            className={`flex-1 px-6 py-4 rounded-xl font-bold text-white transition-all active:scale-95 shadow-lg ${
              isDanger
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                : "bg-slate-900 hover:bg-slate-800 shadow-slate-900/20"
            }`}
          >
            {confirmLabel || (isDanger ? "Delete" : "Confirm")}
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
          >
            {cancelLabel || "Cancel"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
