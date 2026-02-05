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

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
  id?: string;
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

export const saveUser = async (data: UserSaveData) => {
  return api.post("/users/save", data);
};

export interface UserDetail extends User {
  status: string;
  created_at: string;
  updated_at: string;
  roles: { name: string }[];
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

export const updateUserStatus = async (id: string | number, status: string) => {
  return api.patch(`/users/${id}/status`, { status });
};

export interface IpAddress {
  id: string;
  ip: string;
  type: "IPv4" | "IPv6";
  label: string;
  comment?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface IpSaveData {
  id?: string;
  ip: string;
  type: string;
  label: string;
  comment?: string;
}

export const getIps = async (page: number = 1, perPage: number = 10) => {
  return api.get<PaginatedResponse<IpAddress>>("/ips", {
    page,
    per_page: perPage,
  });
};

export const createIpAddress = async (data: IpSaveData) => {
  return api.post("/ips/create", data);
};

export const updateIpAddress = async (
  id: string | number,
  data: IpSaveData,
) => {
  return api.post(`/ips/update/${id}`, data);
};

export const deleteIpAddress = async (id: string | number) => {
  return api.delete(`/ips/delete/${id}`);
};

export default api;
