import { Reducer, ReducerState } from "react";
import {
  LocalState,
  ProfileActions,
  ProfileState,
  ReducerActions,
} from "../types/reducer";

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

export const profileReducer: Reducer<ProfileState, ProfileActions> = (
  state,
  action
) => {
  switch (action.type) {
    case "name":
      return { ...state, name: action.payload };
    case "user-name":
      return { ...state, userName: action.payload };
    case "about":
      return { ...state, about: action.payload };
    case "photo":
      return { ...state, photo: action.payload };
    default:
      return state;
  }
};
