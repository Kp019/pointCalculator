import { useState, useEffect } from "react";
import type {
  GameConfig,
  WinMetric,
  WinCondition,
  GameMode,
} from "../types/game";

interface RuleConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, config: GameConfig) => void;
  initialConfig?: GameConfig;
  initialName?: string;
  isViewOnly?: boolean; // For viewing details of an existing rule without editing
}

const RuleConfigModal = ({
  isOpen,
  onClose,
  onSave,
  initialConfig,
  initialName = "",
  isViewOnly = false,
}: RuleConfigModalProps) => {
  const [name, setName] = useState(initialName);
  const [winMetric, setWinMetric] = useState<WinMetric>("rounds");
  const [targetRounds, setTargetRounds] = useState(10);
  const [targetPoints, setTargetPoints] = useState(100);
  const [winCondition, setWinCondition] = useState<WinCondition>("highest");
  const [gameMode, setGameMode] = useState<GameMode>("sudden-death");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      if (initialConfig) {
        setWinMetric(initialConfig.winMetric);
        setTargetRounds(initialConfig.targetRounds);
        setTargetPoints(initialConfig.targetPoints);
        setWinCondition(initialConfig.winCondition);
        setGameMode(initialConfig.gameMode);
      } else {
        // Defaults
        setWinMetric("rounds");
        setTargetRounds(10);
        setTargetPoints(100);
        setWinCondition("highest");
        setGameMode("sudden-death");
      }
    }
  }, [isOpen, initialConfig, initialName]);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Please enter a name for this rule.");
      return;
    }
    onSave(name.trim(), {
      winMetric,
      targetRounds,
      targetPoints,
      winCondition,
      gameMode,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-scale-up border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
          <h2 className="text-2xl font-black text-slate-900">
            {isViewOnly
              ? "Rule Details"
              : initialConfig
                ? "Edit Rule"
                : "New Rule Config"}
          </h2>
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

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Rule Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Rule Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              disabled={isViewOnly}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold"
              placeholder="e.g. Standard Poker Night"
            />
          </div>

          {/* Win Metric */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Winning Metric
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["rounds", "points", "both"] as WinMetric[]).map((metric) => (
                <button
                  key={metric}
                  onClick={() => !isViewOnly && setWinMetric(metric)}
                  disabled={isViewOnly}
                  className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border-2 ${
                    winMetric === metric
                      ? "bg-primary-500 text-white border-primary-500 shadow-md"
                      : "bg-white text-slate-600 border-slate-200"
                  } ${!isViewOnly && winMetric !== metric ? "hover:border-primary-300" : ""}`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Targets */}
          <div className="grid grid-cols-2 gap-4">
            <div className={winMetric === "points" ? "opacity-40" : ""}>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Total Rounds
              </label>
              <input
                type="number"
                disabled={isViewOnly || winMetric === "points"}
                value={targetRounds}
                onChange={(e) => setTargetRounds(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                min="1"
              />
            </div>
            <div className={winMetric === "rounds" ? "opacity-40" : ""}>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Target Points
              </label>
              <input
                type="number"
                disabled={isViewOnly || winMetric === "rounds"}
                value={targetPoints}
                onChange={(e) => setTargetPoints(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                min="1"
              />
            </div>
          </div>

          {/* Win Condition */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Win Condition
            </label>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => !isViewOnly && setWinCondition("highest")}
                disabled={isViewOnly}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                  winCondition === "highest"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Highest Wins
              </button>
              <button
                onClick={() => !isViewOnly && setWinCondition("lowest")}
                disabled={isViewOnly}
                className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                  winCondition === "lowest"
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Lowest Wins
              </button>
            </div>
          </div>

          {/* Game Mode */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Ending Logic
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => !isViewOnly && setGameMode("sudden-death")}
                disabled={isViewOnly}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  gameMode === "sudden-death"
                    ? "bg-primary-50 border-primary-500"
                    : "bg-white border-slate-200"
                }`}
              >
                <div
                  className={`text-sm font-bold mb-1 ${gameMode === "sudden-death" ? "text-primary-700" : "text-slate-700"}`}
                >
                  Sudden Death
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  End when first person reaches target
                </div>
              </button>
              <button
                onClick={() => !isViewOnly && setGameMode("elimination")}
                disabled={isViewOnly}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  gameMode === "elimination"
                    ? "bg-primary-50 border-primary-500"
                    : "bg-white border-slate-200"
                }`}
              >
                <div
                  className={`text-sm font-bold mb-1 ${gameMode === "elimination" ? "text-primary-700" : "text-slate-700"}`}
                >
                  Elimination
                </div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  Play until only one person remains
                </div>
              </button>
            </div>
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
            {isViewOnly ? "Close" : "Cancel"}
          </button>
          {!isViewOnly && (
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:scale-105 transition-all"
            >
              Save Config
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RuleConfigModal;
