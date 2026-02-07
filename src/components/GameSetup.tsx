import { useState } from "react";
import type { GameConfig } from "../types/game"; // Keep using Context types for now
import { useAppSelector, useAppDispatch } from "../store";
import { saveRule } from "../store/slices/rulesSlice";
import RuleConfigModal from "./RuleConfigModal";

interface GameSetupProps {
  onStartGame: (playerNames: string[], config: GameConfig) => void;
}

const GameSetup = ({ onStartGame }: GameSetupProps) => {
  const [playerNames, setPlayerNames] = useState<string[]>(["", ""]);
  const [error, setError] = useState("");

  const savedRules = useAppSelector((state) => state.rules.savedRules);
  const dispatch = useAppDispatch();

  const [selectedRuleId, setSelectedRuleId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addPlayer = () => {
    setPlayerNames([...playerNames, ""]);
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
    setError("");
  };

  const handleStartGame = () => {
    // Logic for validation
    const filteredNames = playerNames.filter((name) => name.trim() !== "");
    if (filteredNames.length < 2) {
      setError("Please add at least 2 players");
      return;
    }
    const uniqueNames = new Set(filteredNames);
    if (uniqueNames.size !== filteredNames.length) {
      setError("Player names must be unique");
      return;
    }

    if (!selectedRuleId) {
      setError("Please select a rule preset or create a new one.");
      return;
    }

    const selectedRule = savedRules.find((r) => r.id === selectedRuleId);
    if (!selectedRule) {
      setError("Invalid rule selected.");
      return;
    }

    onStartGame(filteredNames, selectedRule.config);
  };

  const handleSaveNewRule = (name: string, config: GameConfig) => {
    const newId = crypto.randomUUID();
    dispatch(saveRule({ id: newId, name, config }));
    setSelectedRuleId(newId); // Auto-select the new rule using the known ID
    setIsModalOpen(false);
  };

  return (
    <div className="w-full animate-scale-in max-w-6xl">
      <div className="card w-full flex flex-col md:flex-row md:gap-8 gap-5">
        {/* Left Side: Player Setup */}
        <div className="flex-1 md:space-y-6 space-y-4">
          <h2 className="text-3xl font-bold gradient-text">New Game</h2>

          <div className="md:space-y-4 space-y-2 max-h-[50vh] overflow-y-auto md:pr-2 scrollbar-hide">
            {playerNames.map((name, index) => (
              <div
                key={index}
                className="flex gap-3 items-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 md:pl-4 pl-2 flex items-center pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-600">
                      {index + 1}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updatePlayerName(index, e.target.value)}
                    placeholder={`Player ${index + 1} Name`}
                    className="w-full pl-16 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-bold"
                    maxLength={20}
                  />
                </div>
                {playerNames.length > 2 && (
                  <button
                    onClick={() => removePlayer(index)}
                    className="px-4 py-4 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
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
                )}
              </div>
            ))}
          </div>

          <button onClick={addPlayer} className="btn-secondary w-full group">
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Player
            </span>
          </button>
        </div>

        {/* Right Side: Rule Selection */}
        <div className="flex-1 md:p-6 md:bg-slate-50 rounded-2xl md:border md:border-slate-100 flex flex-col">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Game Rules</h2>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700">
                Select Rule Preset
              </label>
              <select
                value={selectedRuleId}
                onChange={(e) => setSelectedRuleId(e.target.value)}
                className="w-full p-4 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">-- Select a Rule --</option>
                {savedRules.map((rule) => (
                  <option key={rule.id} value={rule.id}>
                    {rule.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className="h-px bg-slate-300 flex-1"></span>
              <span className="text-slate-400 text-sm font-bold uppercase">
                OR
              </span>
              <span className="h-px bg-slate-300 flex-1"></span>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-4 border-2 border-dashed border-primary-300 bg-primary-50 text-primary-600 rounded-xl font-bold hover:bg-primary-100 hover:border-primary-400 transition-all flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Rule Config
            </button>

            {selectedRuleId && (
              <div className="p-4 bg-white border border-slate-200 rounded-xl">
                <h3 className="font-bold text-slate-900 mb-2">
                  Selected Configuration
                </h3>
                {(() => {
                  const r = savedRules.find(
                    (rule) => rule.id === selectedRuleId,
                  );
                  if (!r) return null;
                  return (
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li className="flex justify-between">
                        <span>Win Metric:</span>{" "}
                        <span className="font-bold capitalize">
                          {r.config.winMetric}
                        </span>
                      </li>
                      {r.config.winMetric !== "points" && (
                        <li className="flex justify-between">
                          <span>Target Rounds:</span>{" "}
                          <span className="font-bold">
                            {r.config.targetRounds}
                          </span>
                        </li>
                      )}
                      {r.config.winMetric !== "rounds" && (
                        <li className="flex justify-between">
                          <span>Target Points:</span>{" "}
                          <span className="font-bold">
                            {r.config.targetPoints}
                          </span>
                        </li>
                      )}
                      <li className="flex justify-between">
                        <span>Condition:</span>{" "}
                        <span className="font-bold capitalize">
                          {r.config.winCondition} Score Wins
                        </span>
                      </li>
                    </ul>
                  );
                })()}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl flex items-center gap-2">
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          <button
            onClick={handleStartGame}
            disabled={!selectedRuleId}
            className="mt-6 btn-primary w-full group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2 text-white text-lg">
              Start Game
              <svg
                className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <RuleConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNewRule}
      />
    </div>
  );
};

export default GameSetup;
