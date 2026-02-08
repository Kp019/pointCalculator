import { useState, useEffect } from "react";

interface EditGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  initialName: string;
}

const EditGameModal = ({
  isOpen,
  onClose,
  onSave,
  initialName,
}: EditGameModalProps) => {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setError("");
    }
  }, [isOpen, initialName]);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Please enter a name for this game.");
      return;
    }
    onSave(name.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-scale-up border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
          <h2 className="text-2xl font-black text-slate-900">Edit Game</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Game Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold"
              placeholder="e.g. Friday Poker Night"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 hover:scale-105 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGameModal;
