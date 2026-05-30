import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAppSelector } from "../../store";
import { useSidebar } from "../../hooks/useSidebar";
import PointraLogo from "../Brand/PointraLogo";

const MainLayout = () => {
  const user = useAppSelector((state) => state.auth.user);
  const { isOpen, toggle, close } = useSidebar();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Global Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] sm:w-[600px] md:w-[800px] h-[500px] sm:h-[600px] md:h-[800px] bg-primary-100/20 rounded-full blur-[100px] sm:blur-[120px] md:blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[500px] sm:w-[600px] md:w-[800px] h-[500px] sm:h-[600px] md:h-[800px] bg-accent-100/20 rounded-full blur-[100px] sm:blur-[120px] md:blur-[140px] animate-pulse-slow" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar isOpen={isOpen} onClose={close} />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/80 backdrop-blur-xl border-b border-slate-100 px-4 py-3 sm:p-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="group-hover:scale-110 transition-transform duration-500">
              <PointraLogo size={36} />
            </div>
            <span className="font-black text-slate-900 tracking-tighter text-lg sm:text-xl">
              <span className="gradient-text">Pointra</span>
            </span>
          </div>

          <button
            onClick={toggle}
            className="p-2 sm:p-3 text-slate-600 hover:bg-white rounded-lg sm:rounded-xl transition-all border border-slate-100 active:scale-90"
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
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-12 overflow-y-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
