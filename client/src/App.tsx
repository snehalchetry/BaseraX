import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';

// Pages
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import OutingRequests from './pages/OutingRequests';
import Complaints from './pages/Complaints';
import FoodMenu from './pages/FoodMenu';
import ParentDashboard from './pages/ParentDashboard';
import WardenDashboard from './pages/WardenDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Shared Layout
import Layout from './components/Layout';

function ProtectedRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 border-3 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}

function RoleBasedRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="w-8 h-8 border-3 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div></div>;
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'student': return <Navigate to="/student/dashboard" replace />;
    case 'parent': return <Navigate to="/parent/dashboard" replace />;
    case 'warden': return <Navigate to="/warden/dashboard" replace />;
    case 'admin': return <Navigate to="/admin/dashboard" replace />;
    default: return <Navigate to="/login" replace />;
  }
}

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* All authenticated routes under Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* Shared Routes */}
          <Route path="/food-menu" element={<FoodMenu />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/outings" element={<OutingRequests />} />
          <Route path="/student/complaints" element={<Complaints />} />

          {/* Parent Routes */}
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          <Route path="/parent/outings" element={<OutingRequests />} />

          {/* Warden Routes */}
          <Route path="/warden/dashboard" element={<WardenDashboard />} />
          <Route path="/warden/outings" element={<OutingRequests />} />
          <Route path="/warden/complaints" element={<Complaints />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/outings" element={<OutingRequests />} />
          <Route path="/admin/complaints" element={<Complaints />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
