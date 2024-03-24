import React from "react";
import { Navigate, Route } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthenticatedRoute = (props) => {
  const auth = useSelector((state) => state.auth);

  if (auth.account) {
    return <Navigate to="/" replace />;
  } else {
    return props.children;
  }
};

export default AuthenticatedRoute;
