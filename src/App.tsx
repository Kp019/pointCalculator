import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import MainLayout from "./components/Layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SetupPage from "./pages/SetupPage";
import HistoryPage from "./pages/HistoryPage";
import RulesPage from "./pages/RulesPage";
import ProfilePage from "./pages/ProfilePage";
import GamePage from "./pages/GamePage";
import QuickPlayPage from "./pages/QuickPlayPage";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AppInitializer from "./components/AppInitializer";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./store";

const RootRoute = () => {
  const { user } = useAppSelector((state) => state.auth);
  return user ? <Navigate to="/app" replace /> : <LandingPage />;
};

function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Navigate to="/login" replace />} />
            <Route path="/quick-play" element={<QuickPlayPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<MainLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="new" element={<SetupPage />} />
                <Route path="history" element={<HistoryPage />} />
                <Route path="rules" element={<RulesPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="game" element={<GamePage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AppInitializer>
    </Provider>
  );
}

export default App;
