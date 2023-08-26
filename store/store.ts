import { Session } from "next-auth";
import { create } from "zustand";

interface stateInterface {
  panel: boolean;
  theme: "light" | "dark";
  user: Session["user"] & { theme?: string | null };
  setPanel: (action: boolean) => void;
  toggleTheme: (email: string) => void;
  setTheme: (action: "light" | "dark") => void;
}

export const store = create<stateInterface>((set) => ({
  panel: false,
  setPanel: (action) => set((state) => ({ panel: action })),
  theme: "light",
  user: {},
  toggleTheme: (email) =>
    set((state) => {
      if (email) {
        fetch(`http://localhost:3000/api/changetheme?email=${email}`, {
          method: "POST",
        });
      }
      return { theme: state.theme === "dark" ? "light" : "dark" };
    }),
  setTheme: (action) =>
    set((state) => {
      return { theme: action };
    }),
}));
