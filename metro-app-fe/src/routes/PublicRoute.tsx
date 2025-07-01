import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
 const { isAuthenticated, isLoading, isAdmin } = useAuth();

 if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (isAdmin) {
       return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  } else {
    return children;
  }
}