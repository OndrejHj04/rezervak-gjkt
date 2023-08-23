import { create } from "zustand";

export const useBearStore = create((set) => ({
  bears: 0,
  panel: false,
  setPanel: (action) => set((state) => ({ panel: action })),
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));
