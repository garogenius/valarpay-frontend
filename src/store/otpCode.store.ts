import { create } from "zustand";

interface States {
  otpCode: string;
}

interface Actions {
  setOtpCode: (email: string) => void;
}

const useOtpCodeStore = create<States & Actions>()((set) => ({
  otpCode: "",
  setOtpCode: (otpCode: string) => {
    set({ otpCode });
  },
}));

export default useOtpCodeStore;
