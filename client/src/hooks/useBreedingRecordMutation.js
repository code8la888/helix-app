import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const useCreateBreedingRecord = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ strainId, breedingRecord }) => {
      console.log("新增繁殖資訊：", breedingRecord);
      console.log("Strain ID:", strainId);

      const res = await axios.post(`/api/strains/${strainId}/breedingRecord`, {
        breedingRecord,
      });

      return res.data;
    },
    onSuccess: (data, { strainId }) => {
      queryClient.invalidateQueries(["strain", strainId]);
      if (data.message) toast.success(data.message);
      if (data.redirect) navigate(data.redirect);
    },
    onError: (error) => {
      console.error("新增繁殖紀錄失敗：", error);
      navigate("/error", {
        state: {
          error: error.response?.data?.message || "新增繁殖紀錄時發生錯誤",
          stack: error.response?.data?.stack || "沒有堆疊資訊",
        },
      });
    },
  });
};

export const useEditBreedingRecord = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ strainId, breedingRecordId, breedingRecord }) => {
      const res = await axios.put(
        `/api/strains/${strainId}/breedingRecord/${breedingRecordId}`,
        { breedingRecord }
      );
      return res.data;
    },
    onSuccess: (data, { strainId }) => {
      queryClient.invalidateQueries(["strain", strainId]);
      if (data.message) toast.success(data.message);
      if (data.redirect) navigate(data.redirect);
    },
    onError: (error) => {
      console.error("修改繁殖紀錄失敗：", error);
      navigate("/error", {
        state: {
          error: error.response?.data?.message || "修改繁殖紀錄時發生錯誤",
          stack: error.response?.data?.stack || "沒有堆疊資訊",
        },
      });
    },
  });
};

export const useDeleteBreedingRecord = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ strainId, breedingRecordId }) => {
      const res = await axios.delete(
        `/api/strains/${strainId}/breedingRecord/${breedingRecordId}`
      );
      return res.data;
    },
    onSuccess: (data, { strainId }) => {
      queryClient.invalidateQueries(["strain", strainId]);
      if (data.message) toast.success(data.message || "刪除繁殖紀錄成功");
      if (data.redirect) navigate(data.redirect);
    },
    onError: (error) => {
      console.error("刪除繁殖紀錄失敗", error);
      navigate("/error", {
        state: {
          error: error.response?.data?.message || "刪除繁殖紀錄發生錯誤",
          stack: error.response?.data?.stack || "無堆疊資訊",
        },
      });
    },
  });
};
