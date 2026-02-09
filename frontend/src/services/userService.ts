import api, { type PaginatedResponse, type User } from "./api";

export interface UserSaveData {
  id?: number;
  name: string;
  email: string;
  role: string;
  status: string;
  password?: string;
  password_confirmation?: string;
}

export interface UserDetail extends User {
  status: string;
  created_at: string;
  updated_at: string;
  roles: { id: number; name: string }[];
}

export const createUser = async (data: UserSaveData) => {
  return api.post("/users/create", data);
};

export const updateUser = async (id: number, data: UserSaveData) => {
  return api.put(`/users/update/${id}`, data);
};

export const getUsers = async (
  page: number = 1,
  perPage: number = 10,
  search?: string,
  status?: string,
  role?: string,
) => {
  return api.get<PaginatedResponse<UserDetail>>("/users", {
    page,
    per_page: perPage,
    search,
    status,
    role,
  });
};

export const updateUserStatus = async (id: number, status: string) => {
  return api.patch(`/users/status/${id}`, { status });
};
