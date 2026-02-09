import api from "./api";

export interface DashboardStats {
  pending_users: number;
  ip_count: number;
  active_users: number;
}

export const getDashboardStats = async () => {
  return api.get<DashboardStats>("/dashboard/stats");
};
