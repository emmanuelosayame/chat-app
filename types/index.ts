import { Timestamp } from "firebase/firestore";

export interface UISlice {
  newChatModal: { open: boolean };
  toggleNCM: () => void;
  settingsModal: [boolean, string];
  toggleSM: (state: boolean, page?: string) => void;
  // toggleNCM: (state?: boolean) => void;
}

export interface ChatData {
  id: string;
  recId: string;
  timeStamp: Timestamp;
}

export interface UserData {
  id: string;
  name?: string;
  about?: string;
  stickers?: [];
  userName?: string;
  verified?: boolean;
  admin?: string;
  photoURL?: string;
}

export interface ApiSlice {
  chats: ChatData[];
  setChats: (chat: ChatData[]) => void;
  userdata?: UserData;
  setUserData: (userdata: UserData) => void;
}
