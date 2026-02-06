import { create } from "zustand";
import { getCurrentUser, type User } from "../services/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  initialize: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
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
}));
