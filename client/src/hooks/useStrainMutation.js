import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// 建立新品系
export const useCreateStrain = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (strain) => {
      console.log("新增品系資訊：", strain);
      const res = await axios.post("/api/strains", strain);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["strains"]); // 讓 users 重新獲取數據
      if (data.message) toast.success(data.message);
      if (data.redirect) navigate(data.redirect);
    },
    onError: (error) => {
      console.error("新增品系失敗:", error);
      navigate("/error", {
        state: {
          error: error.response?.data?.message || "新增品系時發生錯誤。",
          stack: error.response?.data?.stack || "沒有堆疊資訊",
        },
      });
    },
  });
};

// 編輯品系
export const useUpdateStrain = (id) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (strain) => {
      console.log("更新資訊：", strain);
      const res = await axios.put(`/api/strains/${id}`, { strain });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["strain", id]);
      if (data.message) toast.success(data.message);
      if (data.redirect) navigate(data.redirect);
    },
    onError: (error) => {
      console.error("更新品系失敗", error);
      navigate("/error", {
        state: {
          error: error.response?.data?.message || "更新品系發生錯誤",
          stack: error.response?.data?.stack || "無堆疊資訊",
        },
      });
    },
  });
};

// 刪除品系
export const useDeleteStrain = (id) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/api/strains/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["strains"]);
      if (data.message) toast.success(data.message);
      if (data.redirect) navigate(data.redirect);
    },
    onError: (error) => {
      console.error("刪除品系失敗", error);
      navigate("/error", {
        state: {
          error: error.response?.data?.message || "刪除品系失敗",
          stack: error.response?.data?.stack || "無堆疊資訊",
        },
      });
    },
  });
};
