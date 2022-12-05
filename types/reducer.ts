export type ReducerActions =
  | {
      type: "edit-chats" | "search";
      payload: boolean;
    }
  | { type: "toggle-select"; payload: string };

export type LocalState = {
  editChats: boolean;
  selectedChats: string[];
  search: boolean;
};
