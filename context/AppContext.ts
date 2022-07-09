import { NextPage, NextPageContext } from "next";
import { AppContext, AppProps } from "next/app";
import { createContext} from "react";

export type authContextType = {
  user: [] | null;
  loading:boolean;
  logout: () => void;
};

export const authContextDefaultValues: authContextType = {
  user: null,
  loading:false,
  logout: () => {},
};

const AppContext = createContext<authContextType>(authContextDefaultValues);

const AppProvider = () => {
  return (
    <AppContext.Provider >
    {children}
    </AppContext.Provider>
  );
}

export default A;

