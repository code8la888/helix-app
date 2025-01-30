import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  useEffect(() => {
    console.log(auth);
  }, [auth]);

  if (auth === null) {
    return <Loader content="檢查權限中,請稍後..." />;
  }

  if (auth === false) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
