import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function GlobalRedirectGuard() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (!isLoading) {
    if (isAuthenticated && isAdmin && !location.pathname.startsWith("/admin")) {
      return <Navigate to={"/admin/dashboard"} replace />;
    }
  }

  return null;
}