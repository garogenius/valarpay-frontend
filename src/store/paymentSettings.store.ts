import { create } from "zustand";
import { persist } from "zustand/middleware";

type PaymentSettingsStore = {
  fingerprintPaymentEnabled: boolean;
  setFingerprintPaymentEnabled: (value: boolean) => void;
};

const usePaymentSettingsStore = create<PaymentSettingsStore>()(
  persist(
    (set) => ({
      fingerprintPaymentEnabled: false,
      setFingerprintPaymentEnabled: (value) => set({ fingerprintPaymentEnabled: value }),
    }),
    { name: "payment-settings" }
  )
);

export default usePaymentSettingsStore;




