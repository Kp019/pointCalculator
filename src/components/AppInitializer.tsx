import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchRules } from "../store/slices/rulesSlice";
import { fetchProfile } from "../store/slices/authSlice";

interface AppInitializerProps {
  children: React.ReactNode;
}

const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAppSelector((state) => state.auth);
  const { loading: rulesLoading, savedRules } = useAppSelector(
    (state) => state.rules,
  );

  useEffect(() => {
    if (user?.id) {
      // Fetch rules if not already loading and not already fetched
      if (!rulesLoading && savedRules.length === 0) {
        dispatch(fetchRules());
      }
      // Fetch profile if not already loading
      if (!authLoading) {
        dispatch(fetchProfile());
      }
    }
  }, [dispatch, user?.id]);

  return <>{children}</>;
};

export default AppInitializer;
