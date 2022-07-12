import { DocumentData, FirestoreError } from "firebase/firestore";
import { createContext, useContext } from "react";

export type globalContextType = {
  userData: DocumentData | undefined;
  userDataError: FirestoreError | undefined;
  chats: DocumentData | undefined;
  recData: DocumentData | undefined;
};

export const globalContextDefaultValues: globalContextType = {
  userData: undefined,
  userDataError: undefined,
  chats: undefined,
  recData: [],
};
const GlobalContext = createContext<globalContextType>(
  globalContextDefaultValues
);

const useGlobal = () => {
  return useContext(GlobalContext);
};

export { GlobalContext, useGlobal };
