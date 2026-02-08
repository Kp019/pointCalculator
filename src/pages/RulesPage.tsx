import { useState, useEffect } from "react";
import RuleConfigModal from "../components/RuleConfigModal";
import type { GameConfig, SavedRule } from "../types/game";
import { useAppSelector, useAppDispatch } from "../store";
import {
  saveRuleAsync,
  deleteRuleAsync,
  fetchRules,
} from "../store/slices/rulesSlice";
import { showModal, addToast } from "../store/slices/uiSlice";

const RulesPage = () => {
  const savedRules = useAppSelector((state) => state.rules.savedRules);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<SavedRule | null>(null);

  useEffect(() => {
    dispatch(fetchRules());
  }, [dispatch]);

  const handleCreateNew = () => {
    setEditingRule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (rule: SavedRule) => {
    setEditingRule(rule);
    setIsModalOpen(true);
  };

  const handleSaveRule = (name: string, config: GameConfig) => {
    dispatch(saveRuleAsync({ id: editingRule?.id, name, config }));
    dispatch(
      addToast({
        message: `Rule "${name}" saved successfully!`,
        type: "success",
      }),
    );
    setIsModalOpen(false);
  };

  const handleDeleteRule = (id: string) => {
    dispatch(
      showModal({
        title: "Delete Rule Preset?",
        message: "Are you sure you want to delete this rule preset?",
        confirmLabel: "Delete Rule",
        onConfirm: async () => {
          await dispatch(deleteRuleAsync(id));
          dispatch(addToast({ message: "Rule deleted", type: "success" }));
        },
        type: "danger",
      }),
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900">Rule Presets</h1>
        <button
          onClick={handleCreateNew}
          className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 flex items-center gap-2"
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
          New Rule
        </button>
      </div>

      {savedRules.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            No Saved Rules
          </h2>
          <p className="text-slate-500">
            Create rules for different games you play.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform">
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
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(rule)}
                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2 truncate">
                {rule.name}
              </h2>
              <div className="space-y-2 text-sm text-slate-500">
                <div className="flex justify-between">
                  <span>Mode:</span>
                  <span className="font-bold text-slate-700 capitalize">
                    {rule.config.gameMode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Win Metric:</span>
                  <span className="font-bold text-slate-700 capitalize">
                    {rule.config.winMetric}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Condition:</span>
                  <span className="font-bold text-slate-700 capitalize">
                    {rule.config.winCondition} Score Wins
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <RuleConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveRule}
        initialConfig={editingRule?.config}
        initialName={editingRule?.name}
      />
    </div>
  );
};

export default RulesPage;
