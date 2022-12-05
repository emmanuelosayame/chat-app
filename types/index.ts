export interface UISlice {
  newChatModal: { open: boolean };
  toggleNCM: () => void;
  // toggleNCM: (state?: boolean) => void;
}

export interface ChatData {
  id: string;
  recId: string;
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
