import { useState, createContext } from "react";

export const LoginContext = createContext()

export const LoginProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    return (
        <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          {children}
        </LoginContext.Provider>
      );
}