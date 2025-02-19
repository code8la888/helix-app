import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useHandleError } from "./useHandleError";

// 取得所有品系資料
const fetchStrains = async () => {
  const { data } = await axios.get("/api/strains");
  return data;
};

export const useStrains = () => {
  const query = useQuery({
    //使用useQuery請求數據
    queryKey: ["strains"],
    queryFn: fetchStrains,
    staleTime: 1000 * 60 * 1,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: false,
  });
  useHandleError(query.error);
  return query;
};
