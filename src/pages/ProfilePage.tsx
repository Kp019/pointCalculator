import { useAppSelector, useAppDispatch } from "../store";
import { updateUser } from "../store/slices/authSlice";
import { addToast, showModal } from "../store/slices/uiSlice";
import { useState } from "react";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const savedRules = useAppSelector((state) => state.rules.savedRules);
  const savedGames = useAppSelector((state) => state.history.savedGames);
  const dispatch = useAppDispatch();

  const [name, setName] = useState(user?.name || "");

  const handleUpdate = () => {
    if (name.trim()) {
      dispatch(updateUser({ name: name.trim() }));
      dispatch(
        addToast({ message: "Profile updated successfully!", type: "success" }),
      );
    }
  };

  const handleUpdateColor = (color: string) => {
    dispatch(updateUser({ name: user!.name, color }));
  };

  const handleClearAll = () => {
    dispatch(
      showModal({
        title: "Clear All Data?",
        message:
          "This will permanently delete all your saved games and rules. This action cannot be undone.",
        confirmLabel: "Clear Everything",
        onConfirm: "history/clearHistory, rules/clearRules",
        type: "danger",
      }),
    );
  };

  const colors = [
    "from-primary-400 to-accent-400",
    "from-emerald-400 to-teal-400",
    "from-orange-400 to-amber-400",
    "from-pink-400 to-rose-400",
    "from-violet-400 to-purple-400",
    "from-slate-400 to-slate-600",
    "from-cyan-400 to-blue-400",
    "from-red-400 to-orange-400",
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-black text-slate-900">Profile & Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-6 mb-8">
            <div
              className={`w-24 h-24 rounded-full bg-gradient-to-br ${user?.avatarColor} flex items-center justify-center text-3xl text-white font-bold shadow-lg ring-4 ring-white ring-offset-4 ring-offset-slate-50`}
            >
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {user?.name}
              </h2>
              <p className="text-slate-500">Player Account</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Display Name
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                />
                <button
                  onClick={handleUpdate}
                  className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Avatar Color
              </label>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleUpdateColor(color)}
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} transition-transform hover:scale-110 ring-2 ring-offset-2 ${user?.avatarColor === color ? "ring-slate-900 scale-110" : "ring-transparent"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100 flex flex-col justify-center items-center text-center">
            <div className="text-4xl font-black text-primary-600 mb-2">
              {savedGames.length}
            </div>
            <div className="text-sm font-bold text-primary-800 uppercase tracking-wide">
              Games Played
            </div>
          </div>
          <div className="bg-accent-50 p-6 rounded-3xl border border-accent-100 flex flex-col justify-center items-center text-center">
            <div className="text-4xl font-black text-accent-600 mb-2">
              {savedRules.length}
            </div>
            <div className="text-sm font-bold text-accent-800 uppercase tracking-wide">
              Saved Rules
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 className="text-xl font-bold mb-4">Manage Data</h3>
        <button
          onClick={handleClearAll}
          className="px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-bold transition-colors"
        >
          Clear All Data
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
