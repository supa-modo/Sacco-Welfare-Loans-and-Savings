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

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />
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
            <Route index element={<AdminDashboard />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="loans" element={<Loans />} />
            <Route path="savings" element={<Savings />} />
            <Route path="members" element={<Members />} />
            <Route path="dashboard" element={<AdminDashboard />} />
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
            <Route index element={<MemberDashboard />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
