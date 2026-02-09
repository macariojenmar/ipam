import { useQuery } from "@tanstack/react-query";
import { getAuditLogs, getAuditEvents } from "../services/api";

export const useAuditLogs = (
  page: number = 1,
  perPage: number = 10,
  search?: string,
  event?: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: ["auditLogs", page, perPage, search, event, startDate, endDate],
    queryFn: async () => {
      const response = await getAuditLogs(
        page,
        perPage,
        search,
        event,
        startDate,
        endDate,
      );
      if (!response.ok) {
        const errorData = response.data as any;
        throw new Error(errorData?.message || "Failed to fetch audit logs");
      }
      return response.data;
    },
  });
};

export const useAuditEvents = () => {
  return useQuery({
    queryKey: ["auditEvents"],
    queryFn: async () => {
      const response = await getAuditEvents();
      if (!response.ok) {
        throw new Error("Failed to fetch audit events");
      }
      return response.data;
    },
  });
};
