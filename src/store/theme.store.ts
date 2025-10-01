import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
  theme: "light" | "dark";
  setTheme: () => void; // toggle between light & dark
};

const useStore = create<ThemeStore>()(

  persist(
    (set) => ({
      // Default to dark mode
      theme: "dark",
      // Toggle between dark and light
      setTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "theme-storage", // key in localStorage
    }
  )
);

export const useTheme = () => useStore((state) => state.theme);
export const useSetTheme = () => useStore((state) => state.setTheme);
