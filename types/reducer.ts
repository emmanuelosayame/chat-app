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

export type ProfileState = {
  name: string;
  userName: string;
  about: string;
  photo: { file: File | null; url?: string };
  // photoURL?: string;
};

export type ProfileActions =
  | { type: "photo"; payload: File }
  | { type: "name" | "user-name" | "about"; payload: string };
