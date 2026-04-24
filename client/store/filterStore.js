"use client";
import { create } from "zustand";

const useFilterStore = create((set) => ({
  category: "",
  status: "",
  important: false,
  setCategory: (category) => set({ category }),
  setStatus: (status) => set({ status }),
  setImportant: (important) => set({ important }),
  resetFilters: () => set({ category: "", status: "", important: false }),
}));

export default useFilterStore;
