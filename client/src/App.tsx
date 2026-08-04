import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BookingsPage from './pages/BookingsPage';
import MarketplacePage from './pages/MarketplacePage';
import MediaPage from './pages/MediaPage';
import ChatPage from './pages/ChatPage';
import TicketsPage from './pages/TicketsPage';
import TasksPage from './pages/TasksPage';
import SecurityPage from './pages/SecurityPage';
import MonitoringPage from './pages/MonitoringPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
