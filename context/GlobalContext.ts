import { DocumentData } from "firebase/firestore";
import { createContext, useContext } from "react";

export type globalContextType = {
  userData: DocumentData | undefined;

};

export const globalContextDefaultValues: globalContextType = {
  userData: undefined,
};
const GlobalContext = createContext<globalContextType>(
  globalContextDefaultValues
);

const useGlobal = () => {
  return useContext(GlobalContext);
};

export { GlobalContext , useGlobal };
