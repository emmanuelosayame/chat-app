import type { AppProps } from "next/app";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import "../styles/globals.css";
import { auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { createContext, useContext } from "react";
import { User } from "firebase/auth";

// export type appContextType = {
//   user: User | null | undefined;
//   loading: boolean;
//   logout: () => void;
//   // modalState: any;
// };

// const appContextDefaultValues = {
//   user: null,
//   loading: false,
//   logout: () => {},
//   // modalState:{},
// };
// const AppContext = createContext<appContextType>(appContextDefaultValues);

function MyApp({ Component, pageProps }: AppProps) {
//   const [user, loading] = useAuthState(auth);

//   const logout = async () => {
//     auth.signOut();
//   };

//   const modalState = useDisclosure();

//   const values = {
//     user,
//     loading,
//     logout,
//     // modalState,
//   };

  return (
    // <AppContext.Provider value={values}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    // </AppContext.Provider>
  );
}

// export const useGlobals = () => {
//   return useContext(AppContext);
// };

export default MyApp;
