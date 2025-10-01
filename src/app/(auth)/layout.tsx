"use client";

import Navbar from "@/components/home/Navbar";
import RootProtectionProvider from "@/providers/RootProtectionProvider";
import { usePathname } from "next/navigation";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/login" ||
    pathname === "/account-type" ||
    pathname === "/forgot-password" ||
    pathname === "/verify-email" ||
    pathname === "/validate-phoneNumber" ||
    pathname === "/two-factor-auth" ||
    pathname.startsWith("/signup");

  return (
    <RootProtectionProvider>
      <div className="flex flex-col min-h-screen h-full bg-dark-primary dark:bg-black">
        {!hideNavbar && <Navbar />}
        <div className="flex flex-1">{children}</div>
      </div>
    </RootProtectionProvider>
  );
}
