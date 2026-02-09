import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "../services/roleService";

export const usePermissions = (
  page: number,
  pageSize: number,
  search: string,
) => {
  return useQuery({
    queryKey: ["permissions", { page, pageSize, search }],
    queryFn: () => getPermissions(page + 1, pageSize, search),
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });
};
