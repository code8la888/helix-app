import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useHandleError } from "./useHandleError";

const checkPermission = async (id) => {
  const { data } = await axios.get(`/api/strains/${id}/browse-permission`);
  return data;
};

export const useCheckPermission = (id) => {
  const query = useQuery({
    queryKey: ["permission", id],
    queryFn: () => checkPermission(id),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    retry: false,
  });
  useHandleError(query.error);
  return query;
};
