import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    return null; // or a loading spinner component
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;