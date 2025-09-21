import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeStore = {
  theme: "light" | "dark";
  setTheme: () => void;
};

const useStore = create<ThemeStore>()(
  persist(
    (set) => ({
      // Default to dark mode
      theme: "dark",
      // Keep dark mode enforced; calling setTheme will ensure it stays dark
      setTheme: () =>
        set(() => ({
          theme: "dark",
        })),
    }),
    {
      name: "theme-storage",
    }
  )
);

export const useTheme = () => useStore((state) => state.theme);
export const useSetTheme = () => useStore((state) => state.setTheme);
