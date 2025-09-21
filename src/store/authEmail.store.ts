import { create } from "zustand";

interface States {
  authEmail: string;
  authPhoneNumber: string;
  authCode: string;
}

interface Actions {
  setAuthEmail: (email: string) => void;
  setAuthPhoneNumber: (phoneNumber: string) => void;
  setAuthCode: (code: string) => void;
}

const useAuthEmailStore = create<States & Actions>()((set) => ({
  authEmail: "",
  authPhoneNumber: "",
  authCode: "",
  setAuthEmail: (authEmail: string) => {
    set({ authEmail });
  },
  setAuthCode: (authCode: string) => {
    set({ authCode });
  },
  setAuthPhoneNumber: (authPhoneNumber: string) => {
    set({ authPhoneNumber });
  },
}));

export default useAuthEmailStore;
