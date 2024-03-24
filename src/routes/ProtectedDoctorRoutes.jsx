import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedDoctorRoutes = (props) => {
  const account = useSelector((state) => state.auth.account);

  if (account?.role === 'doctor') {
    return props.children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedDoctorRoutes;
