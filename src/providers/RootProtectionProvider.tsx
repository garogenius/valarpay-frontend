"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useNavigate from "@/hooks/useNavigate";
import useUserStore from "@/store/user.store";
import Loader from "@/components/Loader/Loader";

interface RootProtectionProviderProps {
  children: React.ReactNode;
}

const RootProtectionProvider = ({ children }: RootProtectionProviderProps) => {
  const pathname = usePathname();
  const navigate = useNavigate();
  const { isLoggedIn, isInitialized, user } = useUserStore();

  useEffect(() => {
    if (
      isLoggedIn &&
      isInitialized &&
      (pathname === "/" || pathname.startsWith("/login"))
    ) {
      const redirectPath =
        sessionStorage.getItem("returnTo") || "/user/dashboard";
      sessionStorage.removeItem("returnTo");
      navigate(redirectPath, "replace");
    }
  }, [isLoggedIn, isInitialized, pathname, navigate, user]);

  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-background z-50">
        <Loader />
      </div>
    );
  }

  if (typeof window !== "undefined" && isLoggedIn && pathname === "/") {
    return <Loader />;
  }

  return <>{children}</>;
};

export default RootProtectionProvider;
