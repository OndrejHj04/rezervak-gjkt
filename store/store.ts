import { NewReservation, Role } from "@/types";
import { User } from "next-auth";
import { create } from "zustand";

interface stateInterface {
  panel: boolean;
  setPanel: (panel: boolean) => void;
  user: User | null;
  setUser: (user: User) => void;
  userLoading: boolean;
  setUserLoading: (value: boolean) => void;
  selectedUsers: number[];
  setSelectedUsers: (users: number[]) => void;
  selectedGroups: number[];
  setSelectedGroups: (groups: number[]) => void;
  createReservation: NewReservation;
  setCreateReservation: (value: NewReservation) => void;
  selectedReservations: number[];
  setSelectedReservations: (value: number[]) => void;
  reservationsStatus: number;
  setReservationStatus: (value: number) => void;
  reservationsSearch: string;
  setReservationsSearch: (value: string) => void;
}

export const store = create<stateInterface>((set) => ({
  panel: false,
  setPanel: (panel) => set({ panel }),
  user: null,
  setUser: (user) => set({ user }),
  userLoading: true,
  setUserLoading: (userLoading) => set({ userLoading }),
  selectedUsers: [],
  setSelectedUsers: (selectedUsers) => set({ selectedUsers }),
  selectedGroups: [],
  setSelectedGroups: (selectedGroups) => set({ selectedGroups }),
  createReservation: {
    from_date: "",
    to_date: "",
    groups: [],
    members: [],
    rooms: 0,
    leader: 0,
    purpouse: "",
    instructions: "",
    name: "",
  },
  setCreateReservation: (createReservation) => set({ createReservation }),
  selectedReservations: [],
  setSelectedReservations: (selectedReservations) =>
    set({ selectedReservations }),
  reservationsStatus: 0,
  setReservationStatus: (reservationsStatus) => set({ reservationsStatus }),
  reservationsSearch: "",
  setReservationsSearch: (reservationsSearch) => set({ reservationsSearch }),
}));
