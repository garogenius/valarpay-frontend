import { create } from "zustand";

interface LayoutState {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  setMenuOpen: (open: boolean) => void;
}

const useUserLayoutStore = create<LayoutState>((set) => ({
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setMenuOpen: (open) => set({ isMenuOpen: open }),
}));

export default useUserLayoutStore;
