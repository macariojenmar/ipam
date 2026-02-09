import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/dashboardService";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const response = await getDashboardStats();
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard statistics");
      }
      return response.data;
    },
    // Refresh stats every minute to keep them updated
    refetchInterval: 60000,
  });
};
