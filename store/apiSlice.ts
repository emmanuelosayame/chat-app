import { StateCreator } from "zustand";
import { ApiSlice, UISlice } from "../types";

const apiSlice: StateCreator<
  ApiSlice & UISlice,
  [["zustand/immer", never]],
  [],
  ApiSlice
> = (set, get) => ({
  chats: [],
  setChats: (chats) =>
    set((state) => {
      state.chats = chats;
    }),
  userdata: undefined,
  setUserData: (userdata) =>
    set((state) => {
      state.userdata = userdata;
    }),
});

export default apiSlice;
