import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { ApiSlice, UISlice, UserSlice } from "../types";
import uiSlice from "./uiSlice";
import apiSlice from "./apiSlice";
import userSlice from "./userSlice";

export const useStore = create<UISlice & ApiSlice & UserSlice>()(
  immer((...args) => ({
    ...uiSlice(...args),
    ...apiSlice(...args),
    ...userSlice(...args),
  }))
);
