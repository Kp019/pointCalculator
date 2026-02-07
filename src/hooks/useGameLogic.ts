import { useMemo } from "react";
import type { Player, Round, GameConfig } from "../App";

interface UseGameLogicProps {
  players: Player[];
  rounds: Round[];
  config: GameConfig;
}

export const useGameLogic = ({
  players,
  rounds,
  config,
}: UseGameLogicProps) => {
  // Determine eliminated players in elimination mode
  // Memoize this calculation to prevent unnecessary re-renders
  const eliminatedPlayerIds = useMemo(() => {
    const eliminated = new Set<string>();
    if (config.gameMode === "elimination") {
      players.forEach((p) => {
        if (p.totalScore >= config.targetPoints) {
          eliminated.add(p.id);
        }
      });
    }
    return eliminated;
  }, [players, config.gameMode, config.targetPoints]);

  // Active players are those not eliminated
  const activePlayers = useMemo(
    () => players.filter((p) => !eliminatedPlayerIds.has(p.id)),
    [players, eliminatedPlayerIds],
  );

  // Sort players based on win condition
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => {
      // If one is eliminated and other is not, non-eliminated comes first
      const aEliminated = eliminatedPlayerIds.has(a.id);
      const bEliminated = eliminatedPlayerIds.has(b.id);

      if (aEliminated && !bEliminated) return 1;
      if (!aEliminated && bEliminated) return -1;

      // If both eliminated or both active, sort by score based on win condition
      if (config.winCondition === "highest") {
        return b.totalScore - a.totalScore;
      } else {
        return a.totalScore - b.totalScore;
      }
    });
  }, [players, eliminatedPlayerIds, config.winCondition]);

  const isGameOver = useMemo(() => {
    // Round limit reached
    if (config.winMetric === "rounds" || config.winMetric === "both") {
      if (rounds.length >= config.targetRounds) return true;
    }

    // Point limit reached
    if (config.winMetric === "points" || config.winMetric === "both") {
      if (config.gameMode === "sudden-death") {
        if (players.some((p) => p.totalScore >= config.targetPoints))
          return true;
      } else {
        // Elimination: Only 1 (or 0) players left below target
        // But only if there were more than 1 player to begin with
        if (activePlayers.length <= 1 && players.length > 1) return true;
      }
    }
    return false;
  }, [rounds.length, players, activePlayers.length, config]);

  const winner = useMemo(() => {
    if (!isGameOver) return null;
    // The first player in sortedPlayers is the winner because sortedPlayers handles elimination logic
    // and score sorting logic correctly.
    // However, if everyone is eliminated (shouldn't happen ideally but possible if last players cross threshold same round),
    // we take the one with better score among eliminated?
    // In elimination mode, last standing wins. If 0 active, check who lasted longest?
    // For now, simple logic: top of sorted list is winner.
    return sortedPlayers[0] || null;
  }, [isGameOver, sortedPlayers]);

  const leader = sortedPlayers[0] || null;

  return {
    eliminatedPlayerIds,
    activePlayers,
    sortedPlayers,
    isGameOver,
    winner,
    leader,
  };
};
