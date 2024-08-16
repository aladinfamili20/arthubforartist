// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import useAuth from '../Hook/CustomeHook';
 
const PrivateRoute = ({ component: Component, adminOnly = false, ...rest }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          adminOnly && !isAdmin ? (
            <Navigate to="/not-authorized" />
          ) : (
            <Component {...props} />
          )
        ) : (
          <Navigate to="/login" />
        )
      }
    />
  );
};

export default PrivateRoute;
