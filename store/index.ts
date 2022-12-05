import create from "zustand";
import { immer } from "zustand/middleware/immer";
import { ApiSlice, UISlice } from "../types";
import uiSlice from "./uiSlice";
import apiSlice from "./apiSlice";

export const useStore = create<UISlice & ApiSlice>()(
  immer((...args) => ({
    ...uiSlice(...args),
    ...apiSlice(...args),
  }))
);
