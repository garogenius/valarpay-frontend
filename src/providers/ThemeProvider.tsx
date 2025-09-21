"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Enforce dark mode globally
    document.documentElement.setAttribute("data-mode", "dark");
    document.documentElement.className = "dark";
  }, []);

  return <>{children}</>;
}
