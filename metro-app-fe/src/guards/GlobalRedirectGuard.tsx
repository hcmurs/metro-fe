import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

export default function GlobalRedirectGuard() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const [redirect, setRedirect] = useState<null | string>(null);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && isAdmin && !location.pathname.startsWith("/admin")) {
        setRedirect("/admin");
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, location.pathname]);

  if (redirect) {
    return <Navigate to={redirect} replace />;
  }

  return null;
}