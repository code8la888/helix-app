import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { fetchUser } from "../redux/auth/authActions";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
  const auth = useSelector((state) => state.auth);
  const location = useLocation();

  if (auth === null) {
    return <Loader content="檢查權限中，請稍後..." />;
  }

  if (auth === false) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
