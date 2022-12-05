import { StateCreator } from "zustand";
import { ApiSlice, UISlice } from "../types";

const uiSlice: StateCreator<
  UISlice & ApiSlice,
  [["zustand/immer", never]],
  [],
  UISlice
> = (set, get) => ({
  newChatModal: { open: false },
  toggleNCM: () =>
    set((state) => {
      state.newChatModal.open = !state.newChatModal.open;
    }),
});

export default uiSlice;
