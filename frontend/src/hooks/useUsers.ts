import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/userService";

export const useUsers = (
  page: number,
  pageSize: number,
  search: string,
  status: string,
  role: string,
) => {
  return useQuery({
    queryKey: ["users", { page, pageSize, search, status, role }],
    queryFn: async () => {
      const response = await getUsers(
        page + 1,
        pageSize,
        search,
        status === "all" ? "" : status,
        role === "all" ? "" : role,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      return response.data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 60 * 1000,
  });
};
