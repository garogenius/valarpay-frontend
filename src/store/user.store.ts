import { User } from "@/constants/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { isTokenExpired } from "@/utils/tokenChecker";

interface States {
  user: User | null;
  isInitialized: boolean;
  isLoggedIn: boolean;
}

interface Actions {
  setUser: (user: User | null) => void;
  setInitialized: (initialized: boolean) => void;
  setIsLoggedIn: (state: boolean) => void;
  checkToken: () => Promise<boolean>;
  initializeAuth: (user: User | null) => void;
}

const useUserStore = create(
  persist<States & Actions>(
    (set, get) => ({
      user: null,
      isInitialized: false,
      isLoggedIn: false,

      setUser: (user: User | null) => set({ user }),
      setInitialized: (initialized: boolean) =>
        set({ isInitialized: initialized }),
      setIsLoggedIn: (state: boolean) => set({ isLoggedIn: state }),

      checkToken: async () => {
        const token = Cookies.get("accessToken");

        if (!token) {
          set({ isLoggedIn: false });
          return false;
        }

        try {
          const tokenExpired = isTokenExpired(token);

          if (tokenExpired) {
            Cookies.remove("accessToken");
            set({ isLoggedIn: false, user: null });
            return false;
          } else {
            set({ isLoggedIn: true });
            return true;
          }
        } catch (error) {
          console.error("Error checking token:", error);
          set({ isLoggedIn: false, user: null });
          return false;
        }
      },

      initializeAuth: async (user: User | null) => {
        const token = Cookies.get("accessToken");
        if (token && user) {
          const isValid = await get().checkToken();
          if (isValid) {
            set({ user, isLoggedIn: true, isInitialized: true });
          } else {
            set({ user: null, isLoggedIn: false, isInitialized: true });
          }
        } else {
          set({ user: null, isLoggedIn: false, isInitialized: true });
        }
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setInitialized(true);
      },
    }
  )
);

export default useUserStore;
