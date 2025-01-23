import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import MemberDashboard from "./pages/member/Dashboard";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Loans from "./pages/admin/Loans";
import Savings from "./pages/admin/Savings";
import Members from "./pages/admin/Members";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import MemberLoans from "./pages/member/Loans";
import MemberSavings from "./pages/member/Savings";
import MemberSettings from "./pages/member/Profile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardLayout isAdmin={true} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="loans" element={<Loans />} />
            <Route path="savings" element={<Savings />} />
            <Route path="members" element={<Members />} />
          </Route>

          {/* Member Routes */}
          <Route
            path="/member"
            element={
              <ProtectedRoute>
                <DashboardLayout isAdmin={false} />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<MemberDashboard />} />
            <Route path="loans" element={<MemberLoans />} />
            <Route path="savings" element={<MemberSavings />} />
            <Route path="settings" element={<MemberSettings />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
