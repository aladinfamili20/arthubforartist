import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import useUserRole from './useUserRole';
 
const ProtectedRoute = ({ element: Element, adminOnly, ...rest }) => {
  const { role, loading } = useUserRole();

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while determining the role
  }

  if (adminOnly && role !== 'admin') {
    return <Navigate to="/not-authorized" />;
  }

  if (!adminOnly && !role) {
    return <Navigate to="/login" />;
  }

  return <Route {...rest} element={<Element />} />;
};

export default ProtectedRoute;
