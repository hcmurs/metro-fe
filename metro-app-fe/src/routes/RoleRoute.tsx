import type { ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

type Role = 'guest' | 'user' | 'admin';

interface RoleRouteProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { isLoading, isAuthenticated, isAdmin } = useAuth();

  if (isLoading) return <></>;

  const role: Role = !isAuthenticated ? 'guest' : isAdmin ? 'admin' : 'user';

  return allowedRoles.includes(role) ? (
    <>{children}</>
  ) : (
    <Navigate to={role === 'admin' ? '/admin/dashboard' : '/'} replace />
  );
}
