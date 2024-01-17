import { NewReservation, Role } from "@/types";
import { User } from "next-auth";
import { create } from "zustand";

interface stateInterface {
  panel: boolean;
  setPanel: (panel: boolean) => void;
  selectedUsers: number[];
  setSelectedUsers: (users: number[]) => void;
  selectedGroups: number[];
  setSelectedGroups: (groups: number[]) => void;
  createReservation: NewReservation;
  setCreateReservation: (value: NewReservation) => void;
  selectedReservations: number[];
  setSelectedReservations: (value: number[]) => void;
}

export const store = create<stateInterface>((set) => ({
  panel: false,
  setPanel: (panel) => set({ panel }),
  selectedUsers: [],
  setSelectedUsers: (selectedUsers) => set({ selectedUsers }),
  selectedGroups: [],
  setSelectedGroups: (selectedGroups) => set({ selectedGroups }),
  createReservation: {
    from_date: "",
    to_date: "",
    groups: [],
    members: [],
    rooms: [],
    leader: 0,
    purpouse: "",
    instructions: "",
    name: "",
  },
  setCreateReservation: (createReservation) => set({ createReservation }),
  selectedReservations: [],
  setSelectedReservations: (selectedReservations) =>
    set({ selectedReservations }),
}));
