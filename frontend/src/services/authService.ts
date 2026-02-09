import api, { type User } from "./api";

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

export interface ProfileUpdateData {
  name: string;
  email: string;
}

export interface PasswordUpdateData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  user?: User;
}

export const getCurrentUser = async () => {
  return api.get<User>("/auth/me");
};

export const login = async (credentials: LoginCredentials) => {
  return api.post<LoginResponse>("/auth/login", credentials);
};

export const register = async (data: RegisterData) => {
  return api.post("/register", data);
};

export const logout = async () => {
  return api.post("/auth/logout");
};

export const updateProfile = async (data: ProfileUpdateData) => {
  return api.put<ProfileResponse>("/auth/profile", data);
};

export const updatePassword = async (data: PasswordUpdateData) => {
  return api.put<ProfileResponse>("/auth/password", data);
};
