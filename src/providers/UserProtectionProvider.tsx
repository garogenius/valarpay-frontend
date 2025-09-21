"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import useNavigate from "@/hooks/useNavigate";
import useUserStore from "@/store/user.store";
import { TIER_LEVEL } from "@/constants/types";
import Loader from "@/components/Loader/Loader";
import { isTokenExpired } from "@/utils/tokenChecker";
import Cookies from "js-cookie";

interface UserProtectionProviderProps {
  children: React.ReactNode;
}

const UserProtectionProvider = ({ children }: UserProtectionProviderProps) => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isInitialized } = useUserStore();
  const isBvnVerified =
    user?.tierLevel !== TIER_LEVEL.notSet && user?.isBvnVerified;
  const isPinCreated = user?.isWalletPinSet;

  const isVerified = isBvnVerified && isPinCreated;

  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const token = Cookies.get("accessToken");
  const tokenExpired = token ? isTokenExpired(token) : true;

  useEffect(() => {
    const isLoggingOut = sessionStorage.getItem("isLoggingOut");

    if (
      (tokenExpired || !user) &&
      !isLoggingOut &&
      !isLoading &&
      isInitialized
    ) {
      if (!pathname.startsWith("/login")) {
        sessionStorage.setItem("returnTo", pathname);
        navigate("/login", "replace");
      }
    }

    if (isLoggingOut) {
      sessionStorage.removeItem("isLoggingOut");
    }
  }, [
    isLoggedIn,
    navigate,
    pathname,
    isInitialized,
    isLoading,
    tokenExpired,
    user,
  ]);

  useEffect(() => {
    if (
      !isLoading &&
      isLoggedIn &&
      isInitialized &&
      !isVerified &&
      pathname !== "/user/dashboard"
    ) {
      navigate("/user/dashboard", "replace");
    }
  }, [isVerified, navigate, pathname, isInitialized, isLoading, isLoggedIn]);

  // Show loading state while checking auth
  if (isLoading && !isLoggedIn && !isInitialized) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default UserProtectionProvider;
