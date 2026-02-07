import { useNavigate } from "react-router-dom";
import GameSetup from "../components/GameSetup";
import type { GameConfig } from "../types/game";
import { useAppDispatch } from "../store";
import { startGame } from "../store/slices/gameSlice";

const SetupPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleStartGame = (playerNames: string[], config: GameConfig) => {
    dispatch(startGame({ playerNames, config }));
    navigate("/game");
  };

  return (
    <div className="flex justify-center items-center w-full">
      <GameSetup onStartGame={handleStartGame} />
    </div>
  );
};

export default SetupPage;
