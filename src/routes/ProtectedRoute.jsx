import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = (props) => {
  const auth = useSelector((state) => state.auth);

  if (auth.account) {
    if (props.path === "/login") {
      return <Navigate to="/" replace />;
    }
    return props.children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
