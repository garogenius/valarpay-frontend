import { create } from "zustand";

interface InsufficientBalanceModalState {
  isOpen: boolean;
  requiredAmount: number;
  currentBalance: number;
  currency: "NGN" | "USD" | "EUR" | "GBP";
  open: (params: {
    requiredAmount: number;
    currentBalance: number;
    currency?: "NGN" | "USD" | "EUR" | "GBP";
  }) => void;
  close: () => void;
}

const useInsufficientBalanceModalStore = create<InsufficientBalanceModalState>((set) => ({
  isOpen: false,
  requiredAmount: 0,
  currentBalance: 0,
  currency: "NGN",
  open: (params) =>
    set({
      isOpen: true,
      requiredAmount: params.requiredAmount,
      currentBalance: params.currentBalance,
      currency: params.currency || "NGN",
    }),
  close: () =>
    set({
      isOpen: false,
      requiredAmount: 0,
      currentBalance: 0,
      currency: "NGN",
    }),
}));

export default useInsufficientBalanceModalStore;





