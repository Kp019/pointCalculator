import { useNavigate } from "react-router-dom";
import GameSetup from "../components/GameSetup";
import type { GameConfig } from "../types/game";
import { useAppDispatch } from "../store";
import { createGameAsync } from "../store/slices/gameSlice";

const SetupPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleStartGame = async (playerNames: string[], config: GameConfig) => {
    await dispatch(createGameAsync({ playerNames, config }));
    navigate("/game");
  };

  return (
    <div className="flex justify-center items-center w-full">
      <GameSetup onStartGame={handleStartGame} />
    </div>
  );
};

export default SetupPage;
