import { Session } from "next-auth";
import { create } from "zustand";

interface stateInterface {
  panel: boolean;
  user: Session["user"] & {
    theme?: string | null;
    status?: "authenticated" | "loading" | "unauthenticated" | null;
    id?: number | null;
  };
  toggleTheme: (email: string) => void;
}

export const store = create<stateInterface>((set) => ({
  panel: false,
  user: { status: "loading" },
  toggleTheme: (email) =>
    set((state) => {
      if (email) {
        fetch(`http://localhost:3000/api/changetheme?email=${email}`, {
          method: "POST",
        });
      }
      return {
        user: {
          ...state.user,
          theme: state.user.theme === "dark" ? "light" : "dark",
        },
      };
    }),
}));
