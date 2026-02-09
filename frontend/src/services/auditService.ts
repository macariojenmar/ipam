import api, { type PaginatedResponse } from "./api";

export interface AuditLog {
  id: number;
  user_id: number;
  session_id?: string;
  event: string;
  auditable_type?: string;
  auditable_id?: number;
  old_values?: any;
  new_values?: any;
  description: string;
  user_ip?: string;
  user_agent?: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
  };
}

export interface AuditEvent {
  value: string;
  label: string;
}

export const getAuditLogs = async (
  page: number = 1,
  perPage: number = 10,
  search?: string,
  event?: string,
  startDate?: string,
  endDate?: string,
) => {
  return api.get<PaginatedResponse<AuditLog>>("/audit-logs", {
    page,
    per_page: perPage,
    search,
    event,
    start_date: startDate,
    end_date: endDate,
  });
};

export const getAuditEvents = async () => {
  return api.get<AuditEvent[]>("/audit-logs/events");
};
