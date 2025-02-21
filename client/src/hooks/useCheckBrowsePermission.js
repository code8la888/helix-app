import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useHandleError } from "./useHandleError";

const checkBrowsePermission = async (id) => {
  const { data } = await axios.get(`/api/strains/${id}/browse-permission`);
  return data;
};

export const useCheckBrowsePermission = (id) => {
  const query = useQuery({
    queryKey: ["browse-permission", id],
    queryFn: () => checkBrowsePermission(id),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    retry: false,
  });
  useHandleError(query.error);
  return query;
};
