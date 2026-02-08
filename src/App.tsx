import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import MainLayout from "./components/Layout/MainLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import SetupPage from "./pages/SetupPage";
import HistoryPage from "./pages/HistoryPage";
import RulesPage from "./pages/RulesPage";
import ProfilePage from "./pages/ProfilePage";
import GamePage from "./pages/GamePage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
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
    </Provider>
  );
}

export default App;
