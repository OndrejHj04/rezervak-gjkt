import { create } from "zustand";

export const store = create((set: any) => ({
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
  fusion: [],
  setFusion: (fusion: any) => set({ fusion }),
  fusionData: [],
  setFusionData: (fusionData: any) => set({ fusionData }),
})) as any;
