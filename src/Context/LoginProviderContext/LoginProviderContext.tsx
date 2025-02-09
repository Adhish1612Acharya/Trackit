import { createContext, useState, useContext, ReactNode } from "react";
import { LoginContextType } from "./LoginProviderContext.types";


// Create the context with a default value
const LoginContext = createContext<LoginContextType | undefined>(undefined);

// Context provider component
export const LoginProviderContext = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize login state

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
};

// Custom hook to use the context
export const useLogin = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};
