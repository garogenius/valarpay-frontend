"use client";

import { FiMenu, FiSearch, FiX, FiClock } from "react-icons/fi";
import useUserStore from "@/store/user.store";

import useUserLayoutStore from "@/store/userLayout.store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CURRENCY } from "@/constants/types";
import Toggler from "../shared/Toggler";
import { MdKeyboardArrowDown } from "react-icons/md";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import {
  useGetNotifications,
  useGetUnreadCount,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/api/notification/notification.queries";
import SearchDropdown from "@/components/shared/SearchDropdown";

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

  return (
    <div className="w-full z-40 xs:z-50 sticky top-0 flex justify-between items-center gap-2 sm:gap-4 bg-[#0A0A0A] px-3 sm:px-6 py-3 sm:py-4">
      {/* Mobile Menu Button */}
      <button
        aria-label="Open menu"
        onClick={toggleMenu}
        className="lg:hidden p-2 rounded-md hover:bg-[#1C1C1E] text-white"
      >
        <FiMenu className="text-xl" />
      </button>

      {/* Search - Left Side */}
      <div className="flex-1 max-w-[520px] relative">
        <div className="w-full relative">
          <svg className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              if (!value.trim()) {
                setSearchDropdownOpen(true);
              } else {
                setSearchDropdownOpen(false);
              }
            }}
            onFocus={() => {
              if (!searchTerm.trim()) {
                setSearchDropdownOpen(true);
              }
            }}
            placeholder="Search transactions, bills or payments..."
            className="w-full rounded-lg bg-transparent border border-gray-800 text-xs sm:text-sm pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 text-white placeholder:text-gray-600 outline-none focus:border-gray-700"
          />
        </div>
        
        {/* Search Dropdown - Only shows recent searches */}
        <SearchDropdown
          isOpen={searchDropdownOpen && !searchTerm.trim()}
          onClose={() => setSearchDropdownOpen(false)}
          onSearch={(term) => {
            setSearchTerm(term);
            setSearchDropdownOpen(false);
          }}
        />
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-lg hover:bg-[#1C1C1E] transition-colors"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="absolute right-0 top-12 w-[22rem] rounded-xl border border-gray-800 bg-[#1C1C1E] shadow-2xl">
              <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Notifications</p>
                <button
                  onClick={() => markAllRead()}
                  className="text-xs text-gray-300 hover:text-white px-2 py-1 rounded-md hover:bg-[#2C2C2E]"
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {(notifications || []).length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-gray-400">No notifications</div>
                ) : (
                  notifications.slice(0, 8).map((n: any) => (
                    <div key={n.id} className="px-4 py-3 border-b border-gray-800 hover:bg-[#2C2C2E] transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 mt-2 rounded-full ${n.readAt ? "bg-transparent border border-gray-600" : "bg-red-500"}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{n.title}</p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">{n.message}</p>
                          {!n.readAt && (
                            <button onClick={() => markRead(n.id)} className="mt-1 text-[11px] text-[#FF6B2C] hover:text-[#FF7D3D]">
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-3 border-t border-gray-800">
                <Link href="/user/notifications" className="block w-full text-center text-sm text-[#FF6B2C] hover:text-[#FF7D3D] font-medium">
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
            className="flex items-center gap-3 cursor-pointer hover:bg-[#1C1C1E] rounded-lg px-2 py-2 transition-colors"
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
              <p className="text-sm font-semibold text-white">
                {user?.fullname || "User"}
              </p>
              <p className="text-xs text-gray-400">Tier 2 Account</p>
            </div>
            <MdKeyboardArrowDown className="hidden lg:block text-gray-400 text-lg" />
          </div>

          {/* Account Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-14 w-64 rounded-xl border border-gray-800 bg-[#1C1C1E] shadow-2xl">
              <div className="px-4 py-3 border-b border-gray-800">
                <p className="text-sm font-semibold text-white">My Account</p>
              </div>
              <div className="flex flex-col py-2">
                <Link href="/user/settings" className="px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2C2C2E] transition-colors">Settings</Link>
                <Link href="/user/settings" className="px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2C2C2E] transition-colors">Account Info</Link>
                <div className="my-1 border-t border-gray-800"></div>
                <Link href="/logout" className="px-4 py-2.5 text-sm text-red-500 hover:bg-[#2C2C2E] transition-colors">Logout</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
