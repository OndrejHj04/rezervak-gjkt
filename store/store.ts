import { create } from "zustand";

export const store = create((set: any) => ({
  panel: false,
  setPanel: (panel: any) => set({ panel }),
  selectedUsers: [],
  setSelectedUsers: (selectedUsers: any) => set({ selectedUsers }),
  selectedGroups: [],
  setSelectedGroups: (selectedGroups: any) => set({ selectedGroups }),
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
  setCreateReservation: (createReservation: any) => set({ createReservation }),
  selectedReservations: [],
  setSelectedReservations: (selectedReservations: any) =>
    set({ selectedReservations }),
  selectedTemplates: [],
  setSelectedTemplates: (selectedTemplates: any) => set({ selectedTemplates }),
})) as any
