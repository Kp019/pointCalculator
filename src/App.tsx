import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import MainLayout from "./components/Layout/MainLayout";

// Eagerly load landing page and layout/auth helpers for immediate above-the-fold display
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AppInitializer from "./components/AppInitializer";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "./store";

// Lazy load secondary routes to split bundles
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const SetupPage = lazy(() => import("./pages/SetupPage"));
const HistoryPage = lazy(() => import("./pages/HistoryPage"));
const RulesPage = lazy(() => import("./pages/RulesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const GamePage = lazy(() => import("./pages/GamePage"));
const QuickPlayPage = lazy(() => import("./pages/QuickPlayPage"));

const RootRoute = () => {
  const { user } = useAppSelector((state) => state.auth);
  return user ? <Navigate to="/app" replace /> : <LandingPage />;
};

function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 animate-spin" />
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Navigate to="/ScoreCounterOnline" replace />} />
              <Route path="/ScoreCounterOnline" element={<RootRoute />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
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
          </Suspense>
        </BrowserRouter>
      </AppInitializer>
    </Provider>
  );
}

export default App;
