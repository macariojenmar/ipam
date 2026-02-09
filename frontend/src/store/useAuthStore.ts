import { create } from "zustand";
import { type User } from "../services/api";
import { getCurrentUser } from "../services/authService";
import { PageList } from "../enums/pageEnums";
import { DEVELOPER, SUPER_ADMIN } from "../enums/roleEnums";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshTimer: ReturnType<typeof setTimeout> | null;
  login: (user: User, expiresIn?: number) => void;
  logout: () => void;
  initialize: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  getDefaultRoute: () => string;
  setUser: (user: User) => void;
  scheduleRefresh: (expiresIn: number) => void;
  clearRefreshTimer: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  refreshTimer: null,

  clearRefreshTimer: () => {
    const { refreshTimer } = get();
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      set({ refreshTimer: null });
    }
  },

  scheduleRefresh: (expiresIn: number) => {
    get().clearRefreshTimer();

    // Refresh 5 minutes before expiration (or 30 seconds if it's very short)
    const refreshBuffer = 5 * 60; // 5 minutes in seconds
    const delay = Math.max(expiresIn - refreshBuffer, 30) * 1000;

    const timer = setTimeout(async () => {
      try {
        const { refreshToken } = await import("../services/authService");
        const response = await refreshToken();
        if (response.ok && response.data) {
          get().scheduleRefresh(response.data.expires_in);
        } else {
          get().logout();
        }
      } catch (error) {
        get().logout();
      }
    }, delay);

    set({ refreshTimer: timer });
  },

  login: (user, expiresIn) => {
    set({ user, isAuthenticated: true, isLoading: false });
    if (expiresIn) {
      get().scheduleRefresh(expiresIn);
    }
  },

  logout: () => {
    get().clearRefreshTimer();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      const response = await getCurrentUser();
      if (response.ok && response?.data?.id) {
        set({ user: response.data, isAuthenticated: true, isLoading: false });
        // After initialization, we should probably trigger a refresh to get the modern expiry
        // Or if we had the expiry in the me response, we could use it.
        // For now, let's trigger one refresh to start the cycle if authenticated.
        const { refreshToken } = await import("../services/authService");
        const refreshResponse = await refreshToken();
        if (refreshResponse.ok && refreshResponse.data) {
          get().scheduleRefresh(refreshResponse.data.expires_in);
        }
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
  hasPermission: (permission: string) => {
    const user = get().user;
    if (!user || !user.all_permissions) return false;
    return user.all_permissions.includes(permission);
  },
  getDefaultRoute: () => {
    const user = get().user;
    if (!user || !user.role_names || user.role_names.length === 0) {
      return PageList.IP_MANAGEMENT;
    }

    // Check if user is Super-Admin or Developer
    const hasAdminRole = user.role_names.some(
      (role) => role === SUPER_ADMIN || role === DEVELOPER,
    );

    return hasAdminRole ? PageList.DASHBOARD : PageList.IP_MANAGEMENT;
  },
  setUser: (user) => set({ user }),
}));
