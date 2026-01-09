"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  useGetNotifications,
  useGetUnreadCount,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/api/notification/notification.queries";

const tabs = [
  { key: "ALL", label: "All", labelShort: "All" },
  { key: "TRANSACTIONS", label: "Transactions", labelShort: "Transactions" },
  { key: "UPDATES", label: "Updates", labelShort: "Updates" },
  { key: "SERVICES", label: "Services", labelShort: "Services" },
  { key: "MESSAGES", label: "Messages", labelShort: "Messages" },
] as const;

type TabKey = typeof tabs[number]["key"];

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="ml-2 inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full bg-[#FF6B2C] text-white text-[10px]">
    {children}
  </span>
);

const NotificationsPage = () => {
  const [active, setActive] = useState<TabKey>("ALL");
  const { notifications, isPending } = useGetNotifications();
  const { count } = useGetUnreadCount();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllNotificationsRead();

  const grouped = useMemo(() => {
    const byCat: Record<string, number> = {};
    (notifications || []).forEach((n: any) => {
      if (!n.readAt) {
        const key = (n.category || "OTHER").toUpperCase();
        byCat[key] = (byCat[key] || 0) + 1;
      }
    });
    return byCat;
  }, [notifications]);

  const filtered = useMemo(() => {
    if (active === "ALL") return notifications || [];
    // Filter by category, ensuring case-insensitive matching
    return (notifications || []).filter((n: any) => {
      const category = (n.category || "").toUpperCase();
      return category === active.toUpperCase();
    });
  }, [active, notifications]);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header */}
      <div className="flex flex-row items-center gap-2 sm:gap-3 justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-white text-base sm:text-lg lg:text-xl font-semibold truncate">Notifications</h1>
          <p className="text-gray-400 text-[10px] sm:text-xs lg:text-sm mt-0.5 sm:mt-1 line-clamp-1">Stay updated with your account activity</p>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => markAllRead()}
            disabled={markingAll}
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#1C1C1E] border border-gray-800 text-white text-[10px] sm:text-xs hover:bg-[#2C2C2E] disabled:opacity-60 whitespace-nowrap"
          >
            <span className="hidden xs:inline">✓ Mark all as read</span>
            <span className="xs:hidden">✓ Read</span>
          </button>
          <button
            onClick={() => markAllRead()}
            className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#1C1C1E] border border-gray-800 text-white text-[10px] sm:text-xs hover:bg-[#2C2C2E] whitespace-nowrap"
          >
            <span className="hidden xs:inline">🗑 Clear All</span>
            <span className="xs:hidden">🗑 Clear</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 sm:gap-4 overflow-auto no-scrollbar">
        {tabs.map((t) => {
          const isActive = active === t.key;
          const unreadTotal = (notifications || []).filter((n: any) => !n.readAt).length;
          const countFor = t.key === "ALL" ? unreadTotal : grouped[t.key] || 0;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex items-center text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-full border whitespace-nowrap ${
                isActive ? "bg-[#2C2C2E] border-gray-700 text-white" : "bg-transparent border-gray-800 text-gray-300 hover:bg-[#1C1C1E]"
              }`}
            >
              <span className="hidden sm:inline">{t.label}</span>
              <span className="sm:hidden">{t.labelShort}</span>
              <Pill>{countFor}</Pill>
            </button>
          );
        })}
      </div>

      {/* List container */}
      <div className="w-full bg-[#1C1C1E] border border-gray-800 rounded-2xl p-3 sm:p-4">
        {isPending ? (
          <div className="py-10 text-center text-gray-400 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 sm:py-14 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#2C2C2E] border border-gray-800 flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1" />
              </svg>
            </div>
            <p className="text-sm sm:text-base font-medium text-white">No notifications</p>
            <p className="text-xs sm:text-sm text-gray-400">You’re all caught up for now</p>
          </div>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-800">
            {filtered.map((n: any) => (
              <li key={n.id} className="py-3 sm:py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#2C2C2E] border border-gray-800 flex items-center justify-center">
                      <span className="w-3 h-3 rounded bg-[#FF6B2C]"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-semibold text-white truncate">{n.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                      <div className="mt-1 flex items-center gap-4">
                        {!n.readAt && (
                          <button onClick={() => markRead(n.id)} className="text-xs text-[#FF6B2C] hover:text-[#FF7D3D]">
                            Mark as read
                          </button>
                        )}
                        {/* Delete could be wired when endpoint exists */}
                        {/* <button className="text-xs text-gray-400 hover:text-white">Delete</button> */}
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] sm:text-xs text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default NotificationsPage;
