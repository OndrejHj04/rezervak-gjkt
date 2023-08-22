import { create } from "zustand";
const useStore = create((set) => ({
  navbar: false,
  darkMode: false,
}));
export default useStore;
