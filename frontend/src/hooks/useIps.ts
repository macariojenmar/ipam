import { useQuery } from "@tanstack/react-query";
import { getIps } from "../services/api";

export const useIps = (
  page: number,
  pageSize: number,
  search: string,
  type: string,
) => {
  return useQuery({
    queryKey: ["ips", { page, pageSize, search, type }],
    queryFn: async () => {
      const response = await getIps(page + 1, pageSize, search, type);
      if (!response.ok) {
        throw new Error("Failed to fetch IP addresses");
      }
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
