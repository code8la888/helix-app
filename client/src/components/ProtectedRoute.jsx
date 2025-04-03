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
  const location = useLocation(); //取得當前路由資訊

  if (auth === null) {
    return <Loader />;
  }

  if (auth === false) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
  {
    /* <ProtectedRoute> 包裹 <AppLayout />，並根據狀態決定是否渲染裡面的內容。
    如果 <ProtectedRoute> 返回 children（<AppLayout />），
    React Router 會自動將子路由（如 <Index />）注入到 <AppLayout /> 的 <Outlet /> 中。 */
  }
};

export default ProtectedRoute;
