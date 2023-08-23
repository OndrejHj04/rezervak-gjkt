import { create } from "zustand";

interface stateInterface {
  panel: boolean;
  darkMode: boolean;
  setPanel: (action: boolean) => void;
  toggleDarkMode: () => void;
}

export const store = create<stateInterface>((set) => ({
  panel: false,
  setPanel: (action) => set((state) => ({ panel: action })),
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));
