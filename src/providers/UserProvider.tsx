"use client";
import { useGetUser } from "@/api/user/user.queries";
import useUserStore from "@/store/user.store";
import { useEffect } from "react";

interface ApiError {
  response?: {
    status: number;
  };
}

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { initializeAuth, isInitialized } = useUserStore();

  // Initialize query in background without blocking
  const { user, isSuccess, error } = useGetUser();

  const isApiError = (error: unknown): error is ApiError => {
    return error !== null && typeof error === "object" && "response" in error;
  };

  useEffect(() => {
    if (isSuccess) {
      initializeAuth(user);
    } else if (error && isApiError(error) && error.response?.status === 401) {
      initializeAuth(null);
    }
  }, [initializeAuth, user, isSuccess, error, isInitialized]);

  return <>{children}</>;
};

export default UserProvider;
