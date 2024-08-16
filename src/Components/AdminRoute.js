import React from 'react';
import { Route, Redirect, Navigate } from 'react-router-dom';
import useUserRole from './useUserRole';

const AdminRoute = ({ component: Component, ...rest }) => {
  const { role, loading } = useUserRole();

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or message
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        role === 'admin' ? (
          <Component {...props} />
        ) : (
          <Navigate to="/not-authorized" />
        )
      }
    />
  );
};

export default AdminRoute;
