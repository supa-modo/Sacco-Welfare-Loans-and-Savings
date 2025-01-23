import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If there's no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // For admin routes, check if user has admin role
  if (
    children.props.isAdmin &&
    user.role !== "admin" &&
    user.role !== "superadmin"
  ) {
    return <Navigate to="/member" replace />;
  }

  // For member routes, check if user has member role
  if (!children.props.isAdmin && user.role !== "member") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
