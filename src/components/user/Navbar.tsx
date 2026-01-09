"use client";

import { FiMenu, FiSearch, FiX, FiClock } from "react-icons/fi";
import useUserStore from "@/store/user.store";

import useUserLayoutStore from "@/store/userLayout.store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CURRENCY, TIER_LEVEL } from "@/constants/types";
import Toggler from "../shared/Toggler";
import { MdKeyboardArrowDown } from "react-icons/md";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import {
  useGetNotifications,
  useGetUnreadCount,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/api/notification/notification.queries";

const Navbar = () => {
  const { user } = useUserStore();
  const [imgUrl, setImgUrl] = useState(user?.profileImageUrl || "");

  useEffect(() => {
    if (user?.profileImageUrl) {
      setImgUrl(user.profileImageUrl);
    }
  }, [user]);

  const { toggleMenu } = useUserLayoutStore();
  const pathname = usePathname();

  const HeadingData = [
    {
      title: "Dashboard",
      path: "/user/dashboard",
    },
    // {
    //   title: "Send Money",
    //   path: "/user/send-money",
    // },

    // {
    //   title: "Wallet",
    //   path: "/user/wallet",
    // },
    // {
    //   title: "Add Funds",
    //   path: "/user/add-funds",
    // },
    {
      title: "Transactions",
      path: "/user/transactions",
    },
    // {
    //   title: "Airtime",
    //   path: "/user/airtime",
    // },
    // {
    //   title: "Mobile Data",
    //   path: "/user/internet",
    // },
    // {
    //   title: "Bills Payment",
    //   path: "/user/bills",
    // },
    // {
    //   title: "Cable / TV Bills",
    //   path: "/user/bills/cable",
    // },

    {
      title: "Settings",
      path: "/user/settings",
    },
    // {
    //   title: "Receipt",
    //   path: "/user/receipt",
    // },
  ];

  const Heading = HeadingData.sort(
    (a, b) => b.path.length - a.path.length
  ).find((item) => {
    if (Array.isArray(item.path)) {
      return item.path.includes(pathname);
    }
    return pathname.startsWith(item.path); // Match paths with dynamic segments
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(menuRef, () => setMenuOpen(false));

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(notifRef, () => setNotifOpen(false));

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(searchRef, () => setSearchOpen(false));

  // Recent searches from localStorage
  const [recent, setRecent] = useState<string[]>([]);
  
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecent(JSON.parse(saved));
      } catch (e) {
        setRecent([]);
      }
    }
  }, []);

  const persistRecent = (items: string[]) => {
    setRecent(items);
    localStorage.setItem("recentSearches", JSON.stringify(items));
  };

  const onSubmitSearch = () => {
    if (searchValue.trim()) {
      const updated = [searchValue.trim(), ...recent.filter((x) => x !== searchValue.trim())].slice(0, 10);
      persistRecent(updated);
      setSearchOpen(false);
      // Navigate to transactions with search
      // You can implement the actual search logic here
    }
  };

  // Notifications
  const { notifications } = useGetNotifications();
  const { count } = useGetUnreadCount();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();

  // Helper function to format tier level display
  const getTierDisplayText = (tierLevel?: TIER_LEVEL): string => {
    if (!tierLevel || tierLevel === TIER_LEVEL.notSet) {
      return "Tier Not Set";
    }
    const tierNumber = tierLevel === TIER_LEVEL.one ? "1" : tierLevel === TIER_LEVEL.two ? "2" : tierLevel === TIER_LEVEL.three ? "3" : "1";
    return `Tier ${tierNumber} Account`;
  };

  return (
    <div className="w-full z-40 xs:z-50 sticky top-0 flex justify-between items-center gap-2 sm:gap-4 bg-white dark:bg-[#0A0A0A] px-3 sm:px-6 py-3 sm:py-4">
      {/* Left: menu + search */}
      <FiMenu
        onClick={toggleMenu}
        className="lg:hidden text-2xl text-text-200 dark:text-text-400 mr-1"
      />
      <div className="flex-1 max-w-[820px]" ref={searchRef}>
        <div className="relative">
          <div className="w-full flex items-center gap-2 bg-bg-600 dark:bg-bg-1100 border border-gray-300 dark:border-[#2C3947] rounded-xl px-4 py-2.5">
            <FiSearch className="text-text-200 dark:text-text-400" />
            <input
              aria-label="search"
              placeholder="Search transactions, bills or payments..."
              className="bg-transparent outline-none w-full text-text-200 dark:text-text-800 placeholder-gray-500 dark:placeholder-white"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => { if (e.key === 'Enter') onSubmitSearch(); }}
            />
            {searchOpen && (
              <button aria-label="close" onClick={() => setSearchOpen(false)} className="text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white">
                <FiX />
              </button>
            )}
          </div>

          {searchOpen && (
            <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-bg-1100 shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <p className="text-gray-700 dark:text-white/80 text-sm">Recent Search</p>
                {recent.length > 0 && (
                  <button className="text-[#f76301] text-sm hover:text-[#e55a00]" onClick={() => persistRecent([])}>Clear All</button>
                )}
              </div>
              <div className="h-px bg-gray-200 dark:bg-[#2C3947]" />
              <div className="max-h-80 overflow-auto scroll-area py-2">
                {recent.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
                    <FiClock className="text-gray-400 dark:text-white/30 text-2xl" />
                    <p className="text-gray-600 dark:text-white/60 text-sm">No recent searches</p>
                  </div>
                ) : recent.map((r, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5">
                    <button
                      className="flex items-center gap-3 flex-1 text-left"
                      onClick={() => { setSearchValue(r); onSubmitSearch(); }}
                    >
                      <FiClock className="text-gray-500 dark:text-white/50" />
                      <span className="text-sm text-gray-700 dark:text-white/80">{r}</span>
                    </button>
                    <button aria-label="remove" onClick={() => persistRecent(recent.filter((x) => x !== r))} className="text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70">
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1C1C1E] transition-colors"
          >
            <svg className="w-6 h-6 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {count > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center border-2 border-[#0A0A0A]">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-12 z-50 w-[calc(100vw-2rem)] sm:w-[22rem] max-w-[22rem] rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-[#1C1C1E] shadow-2xl max-h-[calc(100vh-6rem)] flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</p>
                <button
                  onClick={() => markAllRead()}
                  className="text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-[#2C2C2E] whitespace-nowrap"
                >
                  Mark all as read
                </button>
              </div>
              <div className="flex-1 overflow-y-auto min-h-0">
                {(notifications || []).length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-gray-600 dark:text-gray-400">No notifications</div>
                ) : (
                  // Group notifications by category
                  (() => {
                    const grouped = {
                      TRANSACTIONS: [] as any[],
                      UPDATES: [] as any[],
                      SERVICES: [] as any[],
                      MESSAGES: [] as any[],
                      OTHER: [] as any[],
                    };
                    
                    (notifications || []).slice(0, 8).forEach((n: any) => {
                      const category = (n.category || "").toUpperCase();
                      if (category === "TRANSACTIONS") {
                        grouped.TRANSACTIONS.push(n);
                      } else if (category === "UPDATES") {
                        grouped.UPDATES.push(n);
                      } else if (category === "SERVICES") {
                        grouped.SERVICES.push(n);
                      } else if (category === "MESSAGES") {
                        grouped.MESSAGES.push(n);
                      } else {
                        grouped.OTHER.push(n);
                      }
                    });
                    
                    const allNotifications = [
                      ...grouped.TRANSACTIONS,
                      ...grouped.UPDATES,
                      ...grouped.SERVICES,
                      ...grouped.MESSAGES,
                      ...grouped.OTHER,
                    ];
                    
                    return allNotifications.map((n: any) => (
                      <div key={n.id} className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#2C2C2E] transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${n.readAt ? "bg-transparent border border-gray-400 dark:border-gray-600" : "bg-red-500"}`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 dark:text-white font-medium truncate">{n.title}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 break-words">{n.message}</p>
                            {!n.readAt && (
                              <button onClick={() => markRead(n.id)} className="mt-1 text-[11px] text-[#f76301] hover:text-[#e55a00]">
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ));
                  })()
                )}
              </div>
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
                <Link href="/user/notifications" className="block w-full text-center text-sm text-[#f76301] hover:text-[#e55a00] font-medium">
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative flex items-center gap-3" ref={menuRef}>
          <div 
            onClick={() => setMenuOpen((s) => !s)}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1C1C1E] rounded-lg px-2 py-2 transition-colors"
          >
            <div className="relative w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center overflow-hidden">
              {imgUrl ? (
                <Image
                  src={imgUrl}
                  alt="profile"
                  fill
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <span className="text-white font-semibold text-sm uppercase">
                  {user?.fullname?.slice(0, 2) || "U"}
                </span>
              )}
            </div>
            <div className="hidden lg:flex flex-col">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {user?.fullname || "User"}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{getTierDisplayText(user?.tierLevel)}</p>
            </div>
            <MdKeyboardArrowDown className="hidden lg:block text-gray-600 dark:text-gray-400 text-lg" />
          </div>

          {/* Account Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-14 w-64 rounded-xl border border-gray-300 dark:border-gray-800 bg-white dark:bg-[#1C1C1E] shadow-2xl">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">My Account</p>
              </div>
              <div className="flex flex-col py-2">
                <Link href="/user/settings" className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2C2C2E] transition-colors">Settings</Link>
                <Link href="/user/settings" className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2C2C2E] transition-colors">Account Info</Link>
                <div className="my-1 border-t border-gray-200 dark:border-gray-800"></div>
                <Link href="/logout" className="px-4 py-2.5 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-[#2C2C2E] transition-colors">Logout</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
