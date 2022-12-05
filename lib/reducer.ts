import { Reducer, ReducerState } from "react";
import { LocalState, ReducerActions } from "../types/reducer";

export const initialState: LocalState = {
  editChats: false,
  selectedChats: [],
  search: false,
};

export const reducer: Reducer<LocalState, ReducerActions> = (state, action) => {
  switch (action.type) {
    case "edit-chats":
      return { ...state, editChats: action.payload, selectedChats: [] };
    case "search":
      return { ...state, search: action.payload };
    case "toggle-select": {
      const prevSelected = state.selectedChats?.includes(action.payload);
      const selectedChats = prevSelected
        ? state.selectedChats.filter((x) => x !== action.payload)
        : [...state.selectedChats, action.payload];
      return { ...state, selectedChats };
    }
    default:
      return state;
  }
};
