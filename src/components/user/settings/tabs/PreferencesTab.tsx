"use client";

import React from "react";
import { useTheme, useSetTheme } from "@/store/theme.store";
import { BsSun, BsMoon } from "react-icons/bs";

const Toggle: React.FC<{ checked: boolean; onToggle: () => void }> = ({ checked, onToggle }) => (
  <button onClick={onToggle} className={`relative w-12 h-6 rounded-full transition-colors ${checked ? "bg-[#f76301]" : "bg-gray-300 dark:bg-white/20"}`}>
    <span className={`absolute top-0.5 ${checked ? "right-0.5" : "left-0.5"} w-5 h-5 rounded-full bg-white transition-all shadow-sm`} />
  </button>
);

const ThemeToggle: React.FC = () => {
  const theme = useTheme();
  const setTheme = useSetTheme();
  const isDark = theme === "dark";

  return (
    <div
      onClick={setTheme}
      className="relative cursor-pointer w-[4.4rem] h-8 px-1.5 py-2 gap-3 bg-gray-200 dark:bg-[#999999] rounded-full transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {/* Toggle Pill */}
      <div
        className={`z-20 absolute top-[0.35rem] w-[1.4rem] h-[1.4rem] rounded-full transition-transform duration-200 ${
          isDark ? "translate-x-1.5 bg-[#041943]" : "translate-x-9 bg-[#f76301]"
        }`}
      />

      {/* Icons Container */}
      <div className="relative h-full flex justify-between items-center px-1.5 font-bold">
        <BsSun className="w-4 h-4 text-[#f76301] z-10" />
        <BsMoon className="w-4 h-4 text-[#041943] dark:text-white z-10" />
      </div>
    </div>
  );
};

const PreferencesTab: React.FC = () => {
  const [prefs, setPrefs] = React.useState({
    transactions: true,
    services: true,
    updates: true,
    messages: false,
    email: true,
    sms: true,
  });

  const toggle = (k: keyof typeof prefs) => {
    setPrefs((p) => {
      const next = { ...p, [k]: !p[k] } as typeof p;
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Theme Section - Commented out for now */}
      {/* <div className="w-full bg-bg-600 dark:bg-bg-1100 border border-white/10 rounded-2xl p-4 sm:p-5">
        <p className="text-white dark:text-white font-semibold mb-3">Appearance</p>
        <div className="w-full flex items-center justify-between gap-3 py-3">
          <div>
            <p className="text-white dark:text-white text-sm sm:text-base font-medium">Theme</p>
            <p className="text-white/60 dark:text-white/60 text-xs sm:text-sm">Switch between light and dark mode</p>
          </div>
          <ThemeToggle />
        </div>
      </div> */}

      {/* Notifications Section */}
      <div className="w-full bg-bg-600 dark:bg-bg-1100 border border-white/10 rounded-2xl p-4 sm:p-5">
        <p className="text-white dark:text-white font-semibold mb-3">Notifications</p>
        <div className="divide-y divide-white/10">
          {[
            { k: "transactions", t: "Transactions", d: "Payments, transfers and account activities" },
            { k: "services", t: "Services", d: "Subscriptions, purchases and service related actions" },
            { k: "updates", t: "Updates", d: "New features, announcements and important alerts" },
            { k: "messages", t: "Messages", d: "Personal notes, reminders and direct communication" },
            { k: "email", t: "Email Notifications", d: "Receive transaction alerts via email" },
            { k: "sms", t: "SMS Notifications", d: "Receive transaction alerts via SMS" },
          ].map((row: any, i: number) => (
            <div key={i} className="w-full flex items-center justify-between gap-3 py-3">
              <div>
                <p className="text-white dark:text-white text-sm sm:text-base font-medium">{row.t}</p>
                <p className="text-white/60 dark:text-white/60 text-xs sm:text-sm">{row.d}</p>
              </div>
              <Toggle checked={(prefs as any)[row.k]} onToggle={() => toggle(row.k)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;





