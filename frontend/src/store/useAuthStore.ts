import { create } from "zustand";
import { type User } from "../services/api";
import { getCurrentUser } from "../services/authService";
import { PageList } from "../enums/pageEnums";
import { DEVELOPER, SUPER_ADMIN } from "../enums/roleEnums";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  initialize: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  getDefaultRoute: () => string;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
  initialize: async () => {
    set({ isLoading: true });
    try {
      const response = await getCurrentUser();
      if (response.ok && response?.data?.id) {
        set({ user: response.data, isAuthenticated: true, isLoading: false });
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
