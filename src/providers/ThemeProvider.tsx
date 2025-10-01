"use client";

import { useTheme } from "@/store/theme.store";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  useEffect(() => {
    // Apply the current theme dynamically whenever it changes
    document.documentElement.setAttribute("data-mode", theme);
    document.documentElement.className = theme;
  }, [theme]); // <-- run effect whenever `theme` changes

  return <>{children}</>;
}
