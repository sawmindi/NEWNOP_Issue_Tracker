import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Bug,
  LogOut,
  Menu,
  X,
  CircleDot,
  ChevronRight,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

interface AppLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { to: "/issues", label: "All Issues", icon: <Bug size={16} /> },
];

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-bg-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-accent rounded-lg flex items-center justify-center">
            <CircleDot size={14} className="text-white" />
          </div>
          <div>
            <span className="font-semibold text-slate-100 font-mono tracking-tight text-sm">
              IssueTrack
            </span>
            <span className="block text-[10px] text-slate-500 font-mono">v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest px-3 mb-2 font-mono">
          Navigation
        </p>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? "nav-link-active" : "nav-link"
            }
            onClick={() => setMobileOpen(false)}
          >
            {icon}
            <span>{label}</span>
            <ChevronRight size={12} className="ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-bg-border">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-7 h-7 rounded-full bg-bg-border ring-1 ring-bg-border"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Sign out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-bg-surface border-r border-bg-border shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 bg-bg-surface border-r border-bg-border z-50 animate-slide-up">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-bg-border bg-bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-accent rounded flex items-center justify-center">
              <CircleDot size={12} className="text-white" />
            </div>
            <span className="font-semibold font-mono text-sm text-slate-100">IssueTrack</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 text-slate-400 hover:text-slate-200"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
