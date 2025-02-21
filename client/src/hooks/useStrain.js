import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useHandleError } from "./useHandleError";

//取得單一品系資料
const fetchStrain = async (id) => {
  const data = await axios.get(`/api/strains/${id}`);
  return data.data;
};

export const useStrain = (id) => {
  const query = useQuery({
    queryKey: ["strain", id],
    queryFn: () => fetchStrain(id),
    staleTime: 0,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: false,
  });
  useHandleError(query.error);
  return query;
};
