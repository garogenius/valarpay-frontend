import { create } from "zustand";
import { persist } from "zustand/middleware";

type PaymentPreferencesStore = {
  fingerprintForPayments: boolean;
  setFingerprintForPayments: (value: boolean) => void;
};

const useStore = create<PaymentPreferencesStore>()(
  persist(
    (set) => ({
      fingerprintForPayments: false,
      setFingerprintForPayments: (value) => set({ fingerprintForPayments: value }),
    }),
    { name: "payment-preferences" }
  )
);

export const useFingerprintForPayments = () => useStore((s) => s.fingerprintForPayments);
export const useSetFingerprintForPayments = () => useStore((s) => s.setFingerprintForPayments);

































































