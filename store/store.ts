import { Role } from "@/types";
import { User } from "next-auth";
import { create } from "zustand";

interface stateInterface {
  panel: boolean;
  setPanel: (panel: boolean) => void;
  roles: Role[];
  setRoles: (panel: Role[]) => void;
  modal: boolean;
  setModal: (value: boolean) => void;
  user: User | null;
  setUser: (user: User) => void;
  userLoading: boolean;
  setUserLoading: (value: boolean) => void;
}

export const store = create<stateInterface>((set) => ({
  panel: false,
  setPanel: (panel) => set({ panel }),
  roles: [],
  setRoles: (roles) => set({ roles }),
  modal: false,
  setModal: (modal) => set({ modal }),
  user: null,
  setUser: (user) => set({ user }),
  userLoading: true,
  setUserLoading: (userLoading) => set({ userLoading }),
}));
