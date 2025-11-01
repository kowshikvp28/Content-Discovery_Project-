import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading, isInitialized } = useAuth();

  if (!isInitialized || isLoading) {
    return <div>Checking authentication...</div>; 
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
