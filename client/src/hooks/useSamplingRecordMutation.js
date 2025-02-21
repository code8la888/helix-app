import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useCreateSamplingRecord = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ strainId, mouse }) => {
      const res = await axios.post(`/api/strains/${strainId}/mice`, {
        mouse,
      });
      return res.data;
    },
    onSuccess: (data, { strainId }) => {
      queryClient.invalidateQueries(["strain", strainId]);
      if (data.message) toast.success(data.message);
      if (data.redirect) navigate(data.redirect);
    },
    onError: (error) => {
      console.error("新增採樣紀錄失敗", error);
      navigate("/error", {
        state: {
          error: error.response?.data?.message || "新增採樣紀錄發生錯誤",
          stack: error.response?.data?.stack || "無堆疊資訊",
        },
      });
    },
  });
};

export const useUpdateSamplingRecord = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ strainId, mouseId, mouse }) => {
      const res = await axios.put(`/api/strains/${strainId}/mice/${mouseId}`, {
        mouse,
      });
      return res.data;
    },
    onSuccess: (data, { strainId }) => {
      queryClient.invalidateQueries(["strain", strainId]);
      if (data.message) toast.success(data.message);
      if (data.redirect) navigate(data.redirect);
    },
    onError: (error) => {
      console.error("更新採樣紀錄失敗", error);
      navigate("/error", {
        state: {
          error: error.response?.data?.message || "更新採樣紀錄發生錯誤",
          stack: error.response?.data?.stack || "無堆疊資訊",
        },
      });
    },
  });
};

export const useDeleteSamplingRecord = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({ strainId, mouseId }) => {
      const res = await axios.delete(
        `/api/strains/${strainId}/mice/${mouseId}`
      );
      return res.data;
    },
    onSuccess: (data, { strainId }) => {
      queryClient.invalidateQueries(["strain", strainId]);
      if (data.message) toast.success(data.message);
      if (data.redirect) navigate(data.redirect);
    },
    onError: (error) => {
      console.error("刪除採樣紀錄失敗", error);
      navigate("/error", {
        state: {
          error: error.response?.data?.message || "刪除採樣紀錄發生錯誤",
          stack: error.response?.data?.stack || "無堆疊資訊",
        },
      });
    },
  });
};
