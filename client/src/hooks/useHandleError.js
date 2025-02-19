import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const useHandleError = (error, noPermission = false) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (error || noPermission) {
      console.error("API 或 權限錯誤:", error);
      navigate("/error", {
        state: {
          error: error.response?.data?.message || "發生未知錯誤",
          stack:
            error.response?.data?.stack ||
            (noPermission ? "您沒有權限訪問該頁面" : "沒有堆疊資訊"),
        },
      });
    }
  }, [error, navigate]);
};
