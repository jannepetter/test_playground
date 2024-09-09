"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
const Context = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    username: null,
    id: null,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const username = localStorage.getItem("username");
      const userId = localStorage.getItem("userId");
      setUser({
        username,
        id: userId,
      });
    }
  }, []);

  return <Context.Provider value={[user, setUser]}>{children}</Context.Provider>;
}

export function useUserContext() {
  return useContext(Context);
}
