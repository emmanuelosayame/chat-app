import { StateCreator } from "zustand";
import { ApiSlice, UISlice, UserSlice } from "../types";

const userSlice: StateCreator<
  UISlice & ApiSlice & UserSlice,
  [["zustand/immer", never]],
  [],
  UserSlice
> = (set, get) => ({
  user: null,
  persistUser: (uid) =>
    set((state) => {
      if (state.user) state.user.uid = uid;
    }),
});

export default userSlice;
