import { create } from "zustand";

interface stateInterface {
  panel: boolean;
  setPanel: (action: boolean) => void;
}

export const store = create<stateInterface>((set) => ({
  panel: false,
  setPanel: (action) => set((state) => ({ panel: action })),
}));
