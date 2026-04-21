import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { AppLayout } from "./components/layout/AppLayout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { IssuesList } from "./pages/IssuesList";
import { IssueDetail } from "./pages/IssueDetail";

// Redirect to login if not authenticated
const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Redirect to dashboard if already authenticated
const PublicRoute: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111e33",
            color: "#e2e8f0",
            border: "1px solid #1a2540",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#111e33" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#111e33" },
          },
        }}
      />

      <Routes>
        {/* Public routes (guests only) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route
            element={
              <AppLayout>
                <Outlet />
              </AppLayout>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/issues" element={<IssuesList />} />
            <Route path="/issues/:id" element={<IssueDetail />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
