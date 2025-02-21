import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useHandleError } from "./useHandleError";

const checkEditPermission = async (id) => {
  const { data } = await axios.get(`/api/strains/${id}/edit-permission`);
  return data;
};

export const useCheckEditPermission = (id) => {
  const query = useQuery({
    queryKey: ["edit-permission", id],
    queryFn: () => checkEditPermission(id),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    retry: false,
  });
  useHandleError(query.error);
  return query;
};
