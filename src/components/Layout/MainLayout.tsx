import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppSelector } from "../../store";
import ToastContainer from "../UI/ToastContainer";
import ConfirmationModal from "../UI/ConfirmationModal";

const MainLayout = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
      <ToastContainer />
      <ConfirmationModal />
    </div>
  );
};

export default MainLayout;
