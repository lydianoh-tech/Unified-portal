import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import AppLayout from "./layouts/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import BookingsPage from "./pages/BookingsPage";
import ProviderServicesPage from "./pages/ProviderServicesPage";
import MarketplacePage from "./pages/MarketplacePage";
import MediaPage from "./pages/MediaPage";
import ChatPage from "./pages/ChatPage";
import TicketsPage from "./pages/TicketsPage";
import TasksPage from "./pages/TasksPage";
import SecurityPage from "./pages/SecurityPage";
import MonitoringPage from "./pages/MonitoringPage";

function RoleHomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <LoginPage />;
  }

  return user.role === "CUSTOMER" ? (
    <Navigate to="/customer/dashboard" replace />
  ) : (
    <Navigate to="/provider/dashboard" replace />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleHomeRedirect />} />
          <Route path="/dashboard" element={<RoleHomeRedirect />} />
          <Route path="/bookings" element={<RoleHomeRedirect />} />
          <Route path="/marketplace" element={<RoleHomeRedirect />} />
          <Route path="/media" element={<RoleHomeRedirect />} />
          <Route path="/chat" element={<RoleHomeRedirect />} />
          <Route path="/tickets" element={<RoleHomeRedirect />} />
          <Route path="/tasks" element={<RoleHomeRedirect />} />
          <Route path="/security" element={<RoleHomeRedirect />} />
          <Route path="/monitoring" element={<RoleHomeRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route
            element={
              <AppLayout
                roleGroup="provider"
                allowedRoles={["USER", "ADMIN"]}
                basePath="/provider"
              />
            }
          >
            <Route
              path="/provider/dashboard"
              element={<DashboardPage roleGroup="provider" />}
            />
            <Route path="/provider/bookings" element={<BookingsPage />} />
            <Route
              path="/provider/services"
              element={<ProviderServicesPage />}
            />
            <Route path="/provider/marketplace" element={<MarketplacePage />} />
            <Route path="/provider/media" element={<MediaPage />} />
            <Route path="/provider/chat" element={<ChatPage />} />
            <Route path="/provider/tickets" element={<TicketsPage />} />
            <Route path="/provider/tasks" element={<TasksPage />} />
            <Route path="/provider/security" element={<SecurityPage />} />
            <Route path="/provider/monitoring" element={<MonitoringPage />} />
          </Route>

          <Route
            element={
              <AppLayout
                roleGroup="customer"
                allowedRoles={["CUSTOMER"]}
                basePath="/customer"
              />
            }
          >
            <Route
              path="/customer/dashboard"
              element={<DashboardPage roleGroup="customer" />}
            />
            <Route path="/customer/bookings" element={<BookingsPage />} />
            <Route path="/customer/marketplace" element={<MarketplacePage />} />
            <Route path="/customer/media" element={<MediaPage />} />
            <Route path="/customer/chat" element={<ChatPage />} />
            <Route path="/customer/tickets" element={<TicketsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
