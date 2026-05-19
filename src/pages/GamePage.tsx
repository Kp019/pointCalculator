import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameBoard from "../components/GameBoard";
import Leaderboard from "../components/Leaderboard";
import { useAppSelector, useAppDispatch } from "../store";
import {
  addRoundScores,
  updateScore,
  deleteScore,
  selectEliminatedPlayerIds,
  selectSortedPlayers,
  updateGameAsync as autoUpdateGameAsync,
  setGameId,
} from "../store/slices/gameSlice";
import {
  saveGameAsync,
  updateGameAsync as updateHistoryGameAsync,
} from "../store/slices/historySlice";
import type { SavedGame } from "../types/game";
import { addToast, showModal } from "../store/slices/uiSlice";

const GamePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const game = useAppSelector((state) => state.game);
  const { gameStarted, currentRound, players, rounds, config, gameEnded } =
    game;
  const eliminatedPlayerIds = useAppSelector(selectEliminatedPlayerIds);
  const sortedPlayers = useAppSelector(selectSortedPlayers);

  useEffect(() => {
    if (!gameStarted) {
      navigate("/");
    }
  }, [gameStarted, navigate]);

  if (!gameStarted || !config) return null;

  const handleAddRoundScores = async (scores: {
    [playerId: string]: number;
  }) => {
    dispatch(addRoundScores(scores));
    await dispatch(autoUpdateGameAsync());
  };

  const handleUpdateScore = async (
    playerId: string,
    roundIndex: number,
    newScore: number,
  ) => {
    dispatch(updateScore({ playerId, roundIndex, newScore }));
    await dispatch(autoUpdateGameAsync());
  };

  const handleDeleteScore = async (playerId: string, roundIndex: number) => {
    dispatch(deleteScore({ playerId, roundIndex }));
    await dispatch(autoUpdateGameAsync());
  };

  const handleSaveGame = async () => {
    const gameData: SavedGame = {
      id: game.id || "",
      name: `Game ${new Date().toLocaleDateString()}`,
      config: config,
      players: players,
      rounds: rounds,
      currentRound: currentRound,
      winner: gameEnded ? sortedPlayers[0]?.name || null : null,
    };

    if (game.id) {
      await dispatch(updateHistoryGameAsync(gameData));
      dispatch(
        addToast({ message: "Session Synced Successfully", type: "success" }),
      );
    } else {
      const resultAction = await dispatch(saveGameAsync(gameData));
      if (saveGameAsync.fulfilled.match(resultAction)) {
        dispatch(setGameId(resultAction.payload.id));
        dispatch(
          addToast({ message: "Session Archived", type: "success" }),
        );
      }
    }
  };

  const handleResetGame = () => {
    dispatch(
      showModal({
        title: "Reset Session?",
        message:
          "This will clear all recorded rounds while keeping your current player lineup. Start fresh?",
        confirmLabel: "Restart Game",
        onConfirm: "game/resetGame",
        type: "danger",
      }),
    );
  };

  const handleExitGame = () => {
    dispatch(
      showModal({
        title: "Leave Session?",
        message:
          "Unsaved progress may be lost. Are you sure you want to return to the dashboard?",
        confirmLabel: "Exit Game",
        onConfirm: "game/exitGame",
        type: "danger",
      }),
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 w-full pb-16 sm:pb-20 relative z-10 animate-fade-in">
      {/* Game Header / Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 sm:gap-6 md:gap-8 glass-card p-4 sm:p-6 md:p-8 bg-white/60 border-white/80 animate-slide-down shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-slate-900 flex items-center justify-center shadow-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary-500/20 animate-pulse" />
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white relative z-10 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
             <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Active Session</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">
              Round <span className="gradient-text">{currentRound}</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 w-full xl:w-auto">
          <button
            onClick={handleSaveGame}
            className="btn-primary group flex-1 xl:flex-none shadow-sm"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              <span className="hidden sm:inline">Sync Game</span>
              <span className="sm:hidden">Sync</span>
            </div>
          </button>
          <button
            onClick={handleResetGame}
            className="btn-secondary group flex-1 xl:flex-none border-white shadow-sm"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">Restart</span>
            </div>
          </button>
          <button
            onClick={handleExitGame}
            className="p-3 sm:p-4 bg-white border border-slate-100 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl sm:rounded-2xl transition-all shadow-sm active:scale-90"
            title="Exit Game"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-10">
        {/* Score Input Panel */}
        <div className="lg:col-span-7 animate-slide-up">
          <GameBoard
            players={players}
            currentRound={currentRound}
            onSubmitScores={handleAddRoundScores}
            eliminatedPlayerIds={eliminatedPlayerIds}
            isGameOver={gameEnded}
          />
        </div>

        {/* Leaderboard Panel */}
        <div className="lg:col-span-5 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <Leaderboard
            players={sortedPlayers}
            rounds={rounds}
            config={config}
            onUpdateScore={handleUpdateScore}
            onDeleteScore={handleDeleteScore}
            eliminatedPlayerIds={eliminatedPlayerIds}
            isGameOver={gameEnded}
          />
        </div>
      </div>
    </div>
  );
};

export default GamePage;
