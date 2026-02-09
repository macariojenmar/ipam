import { create } from "apisauce";

const api = create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: Record<string, string[]>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  all_permissions: string[];
  role_names: string[];
  roles?: { id: number; name: string }[];
}

export const getCurrentUser = async () => {
  return api.get<User>("/auth/me");
};

export interface LoginResponse {
  user: User;
  access_token: string;
  token_type: string;
  expires_in: number;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UserSaveData {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: string;
  password?: string;
  password_confirmation?: string;
}

export const login = async (credentials: LoginCredentials) => {
  return api.post<LoginResponse>("/auth/login", credentials);
};

export const register = async (data: RegisterData) => {
  return api.post("/register", data);
};

export const createUser = async (data: UserSaveData) => {
  return api.post("/users/create", data);
};

export const updateUser = async (id: number, data: UserSaveData) => {
  return api.put(`/users/update/${id}`, data);
};

export interface UserDetail extends User {
  status: string;
  created_at: string;
  updated_at: string;
  roles: { id: number; name: string }[];
}

export const getUsers = async (
  page: number = 1,
  perPage: number = 10,
  search?: string,
  status?: string,
) => {
  return api.get<PaginatedResponse<UserDetail>>("/users", {
    page,
    per_page: perPage,
    search,
    status,
  });
};

export const logout = async () => {
  return api.post("/auth/logout");
};

export const updateUserStatus = async (id: number, status: string) => {
  return api.patch(`/users/status/${id}`, { status });
};

export interface IpAddress {
  id: number;
  ip: string;
  type: "IPv4" | "IPv6";
  label: string;
  comment?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface IpSaveData {
  id?: number;
  ip: string;
  type: string;
  label: string;
  comment?: string;
}

export const getIps = async (
  page: number = 1,
  perPage: number = 10,
  search?: string,
  type?: string,
) => {
  return api.get<PaginatedResponse<IpAddress>>("/ips", {
    page,
    per_page: perPage,
    search,
    type: type === "all" ? "" : type,
  });
};

export const createIpAddress = async (data: IpSaveData) => {
  return api.post("/ips/create", data);
};

export const updateIpAddress = async (id: number, data: IpSaveData) => {
  return api.put(`/ips/update/${id}`, data);
};

export const deleteIpAddress = async (id: number) => {
  return api.delete(`/ips/delete/${id}`);
};

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

export interface DashboardStats {
  pending_users: number;
  ip_count: number;
  active_users: number;
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

export const getDashboardStats = async () => {
  return api.get<DashboardStats>("/dashboard/stats");
};

export default api;
