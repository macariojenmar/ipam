import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/api";

export const useUsers = (
  page: number,
  pageSize: number,
  search: string,
  status: string,
) => {
  return useQuery({
    queryKey: ["users", { page, pageSize, search, status }],
    queryFn: async () => {
      const response = await getUsers(
        page + 1,
        pageSize,
        search,
        status === "all" ? "" : status,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.data;
    },
    placeholderData: (previousData) => previousData,
  });
};
