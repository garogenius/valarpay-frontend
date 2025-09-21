import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TimerState {
  resendTimer: number;
  expireAt: number | null;
  setTimer: (duration: number) => void;
  decrementTimer: () => void;
  clearTimer: () => void;
}

const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      resendTimer: 0,
      expireAt: null,
      setTimer: (duration) => {
        const now = Date.now();
        const expireAt = now + duration * 1000;

        set((state) => {
          // Only reset if there's no active timer or it has expired
          if (!state.expireAt || now >= state.expireAt) {
            return { resendTimer: duration, expireAt };
          }
          return state;
        });
      },

      decrementTimer: () => {
        const state = get();
        if (state.expireAt) {
          const now = Date.now();
          if (now >= state.expireAt) {
            // Timer has expired
            set({ resendTimer: 0, expireAt: null });
          } else {
            // Calculate remaining time based on expireAt
            const remaining = Math.max(
              0,
              Math.ceil((state.expireAt - now) / 1000)
            );
            if (remaining !== state.resendTimer) {
              set({ resendTimer: remaining });
            }
          }
        }
      },
      clearTimer: () => {
        set((state) => {
          // Only clear the timer if it's currently set
          if (state.resendTimer !== 0 || state.expireAt !== null) {
            return { resendTimer: 0, expireAt: null };
          }
          return state;
        });
      },
    }),
    {
      name: "timer-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        resendTimer: state.resendTimer,
        expireAt: state.expireAt,
      }),
    }
  )
);

export default useTimerStore;
