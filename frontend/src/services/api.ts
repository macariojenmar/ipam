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

api.axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Reject if not a 401 or if it's already a retry
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Don't retry refresh or login requests
    if (
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // Import dynamically to avoid circular dependency
      const { refreshToken } = await import("./authService");
      const refreshResponse = await refreshToken();

      if (refreshResponse.ok) {
        return api.axiosInstance(originalRequest);
      }
    } catch (refreshError) {
      // If refresh fails, let the error through
    }

    return Promise.reject(error);
  },
);

export default api;
