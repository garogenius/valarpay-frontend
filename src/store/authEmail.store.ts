import { create } from "zustand";

interface States {
  authEmail: string;
  authUsername: string;
  authPhoneNumber: string;
  authCode: string;
}

interface Actions {
  setAuthEmail: (email: string) => void;
  setAuthUsername: (username: string) => void;
  setAuthPhoneNumber: (phoneNumber: string) => void;
  setAuthCode: (code: string) => void;
}

const useAuthEmailStore = create<States & Actions>()((set) => ({
  authEmail: "",
  authUsername: "",
  authPhoneNumber: "",
  authCode: "",
  setAuthEmail: (authEmail: string) => {
    set({ authEmail });
  },
  setAuthUsername: (authUsername: string) => {
    set({ authUsername });
  },
  setAuthCode: (authCode: string) => {
    set({ authCode });
  },
  setAuthPhoneNumber: (authPhoneNumber: string) => {
    set({ authPhoneNumber });
  },
}));

export default useAuthEmailStore;
