import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("leetlab-theme") || "dark",
  setTheme: (theme) => {
    localStorage.setItem("leetlab-theme", theme);
    set({ theme });
  },
}));
