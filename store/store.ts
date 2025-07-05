import { create } from "zustand";

export const store = create((set: any) => ({
  selectedUser: null,
  setSelectedUser: (selectedUser: any) => set({ selectedUser }),
  selectedGroup: null,
  setSelectedGroup: (selectedGroup: any) => set({ selectedGroup }),
  createReservation: {
    from_date: "",
    to_date: "",
    groups: [],
    rooms: [],
    leader: 0,
    purpouse: "",
    instructions: "",
    name: "",
    family: false,
  },
  setCreateReservation: (createReservation: any) => set({ createReservation }),
  selectedReservation: [],
  setSelectedReservation: (selectedReservation: any) =>
    set({ selectedReservation }),
  selectedTemplates: [],
  setSelectedTemplates: (selectedTemplates: any) => set({ selectedTemplates }),
  fusion: [],
  setFusion: (fusion: any) => set({ fusion }),
  fusionData: [],
  setFusionData: (fusionData: any) => set({ fusionData }),
})) as any;
