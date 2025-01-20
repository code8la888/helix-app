import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useCheckPermission = async (id) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPermission = async () => {
      try {
        await axios.get(`/api/strains/${id}/check-permission`);
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
        navigate("/error", {
          state: {
            error: error.response?.data?.message || "您沒有權限訪問此頁面。",
            stack: error.response?.data?.stack || "XXX",
          },
        });
      }
    };
    fetchPermission();
  }, [id, navigate]);
  return isAuthorized;
};
