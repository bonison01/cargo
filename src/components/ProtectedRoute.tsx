import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  authRequired?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  authRequired = false 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still loading, show a simple loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If auth is required and user is not logged in, redirect to login
  if (authRequired && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
