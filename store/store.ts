import { NewReservation, Role } from "@/types";
import { User } from "next-auth";
import { create } from "zustand";

interface stateInterface {
  panel: boolean;
  setPanel: (panel: boolean) => void;
  roles: Role[];
  setRoles: (panel: Role[]) => void;
  modal: string;
  setModal: (value: string) => void;
  user: User | null;
  setUser: (user: User) => void;
  userLoading: boolean;
  setUserLoading: (value: boolean) => void;
  selectedUsers: number[];
  setSelectedUsers: (users: number[]) => void;
  selectedGroups: number[];
  setSelectedGroups: (groups: number[]) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  createReservation: NewReservation;
  setCreateReservation: (value: NewReservation) => void;
  selectedReservations: number[];
  setSelectedReservations: (value: number[]) => void;
}

export const store = create<stateInterface>((set) => ({
  panel: false,
  setPanel: (panel) => set({ panel }),
  roles: [],
  setRoles: (roles) => set({ roles }),
  modal: "",
  setModal: (modal) => set({ modal }),
  user: null,
  setUser: (user) => set({ user }),
  userLoading: true,
  setUserLoading: (userLoading) => set({ userLoading }),
  selectedUsers: [],
  setSelectedUsers: (selectedUsers) => set({ selectedUsers }),
  selectedGroups: [],
  setSelectedGroups: (selectedGroups) => set({ selectedGroups }),
  darkMode: true,
  setDarkMode: (darkMode) => set({ darkMode }),
  createReservation: {
    from_date: "",
    to_date: "",
    groups: [],
    members: [],
    rooms: 0,
    leader: 0,
    purpouse: "",
    instructions: "",
  },
  setCreateReservation: (createReservation) => set({ createReservation }),
  selectedReservations: [],
  setSelectedReservations: (selectedReservations) =>
    set({ selectedReservations }),
}));
