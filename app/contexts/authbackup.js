import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext({
  isSignedIn: false,
  setIsSignedIn: () => {},
});

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync("accessToken").then((token) => {
      if (token) {
        setIsSignedIn(true);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
