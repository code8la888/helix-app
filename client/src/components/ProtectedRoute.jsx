import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const auth = useSelector((state) => state.auth);
  const location = useLocation();
  console.log(auth);

  if (auth === null) {
    // 如果尚未加載，用戶資訊，返回 loading 或空狀態
    return <div>Loading...</div>;
  }

  if (auth === false) {
    // 未登入時跳轉到登入頁
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
