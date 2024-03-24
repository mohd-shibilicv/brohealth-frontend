import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedAdminRoutes = (props) => {
  const account = useSelector((state) => state.auth.account);

  if (account?.role === 'admin') {
    return props.children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedAdminRoutes;
