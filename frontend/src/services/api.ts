import { create } from "apisauce";

const api = create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  token_type: string;
  expires_in: number;
}

export const login = async (credentials: LoginCredentials) => {
  return api.post<LoginResponse>("/auth/login", credentials);
};

export const logout = async () => {
  return api.post("/auth/logout");
};

export default api;
