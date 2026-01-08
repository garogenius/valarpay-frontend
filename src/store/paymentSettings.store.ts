import { create } from "zustand";
import { persist } from "zustand/middleware";

type PaymentSettingsStore = {
  fingerprintPaymentEnabled: boolean;
  setFingerprintPaymentEnabled: (value: boolean) => void;
  selectedCurrency: "NGN" | "USD" | "EUR" | "GBP";
  setSelectedCurrency: (currency: "NGN" | "USD" | "EUR" | "GBP") => void;
};

const usePaymentSettingsStore = create<PaymentSettingsStore>()(
  persist(
    (set) => ({
      fingerprintPaymentEnabled: false,
      setFingerprintPaymentEnabled: (value) => set({ fingerprintPaymentEnabled: value }),
      selectedCurrency: "NGN",
      setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),
    }),
    { name: "payment-settings" }
  )
);

export default usePaymentSettingsStore;




