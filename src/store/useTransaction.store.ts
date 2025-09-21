import { Transaction } from "@/constants/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface States {
  transaction: Transaction | null;
  isInitialized: boolean;
}

interface Actions {
  setTransaction: (transaction: Transaction | null) => void;
  setInitialized: (initialized: boolean) => void;
}

const useTransactionStore = create(
  persist<States & Actions>(
    (set) => ({
      transaction: null,
      isInitialized: false,
      setTransaction: (transaction: Transaction | null) => set({ transaction }),
      setInitialized: (initialized: boolean) =>
        set({ isInitialized: initialized }),
    }),
    {
      name: "transaction",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setInitialized(true);
        }
      },
    }
  )
);

export default useTransactionStore;
