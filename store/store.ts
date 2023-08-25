import { create } from "zustand";

interface stateInterface {
  panel: boolean;
  darkMode: boolean;
  setPanel: (action: boolean) => void;
  toggleDarkMode: (email: any) => void;
  setDarkMode: (action: boolean) => void;
}

export const store = create<stateInterface>((set) => ({
  panel: false,
  setPanel: (action) => set((state) => ({ panel: action })),
  darkMode: false,
  toggleDarkMode: (email) =>
    set((state) => {
      if (email) {
        fetch(`http://localhost:3000/api/changetheme?email=${email}`, {
          method: "POST",
        });
      }
      return { darkMode: !state.darkMode };
    }),
  setDarkMode: (action) =>
    set((state) => {
      console.log(action);
      return { darkMode: action };
    }),
}));
