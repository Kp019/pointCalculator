import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchRules } from "../store/slices/rulesSlice";
import { fetchProfile } from "../store/slices/authSlice";

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchRules());
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  return <>{children}</>;
};

export default AppInitializer;
