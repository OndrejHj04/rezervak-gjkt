import { Role } from "@/types";
import { create } from "zustand";

interface stateInterface {
  panel: boolean;
  setPanel: (panel: boolean) => void;
  roles: Role[];
  setRoles: (panel: Role[]) => void;
  modal: string;
  setModal: (string: string) => void;
}

export const store = create<stateInterface>((set) => ({
  panel: false,
  setPanel: (panel) => set({ panel }),
  roles: [],
  setRoles: (roles) => set({ roles }),
  modal: "",
  setModal: (modal) => set({ modal }),
}));
