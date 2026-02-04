import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LIGHT, DARK } from "../enums/themeEnums";

type ThemeMode = typeof LIGHT | typeof DARK;

interface ThemeStore {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      mode: LIGHT,
      toggleTheme: () =>
        set((state) => ({
          mode: state.mode === LIGHT ? DARK : LIGHT,
        })),
      setTheme: (mode) => set({ mode }),
    }),
    {
      name: "theme-storage",
    },
  ),
);
