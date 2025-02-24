"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
const Context = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    username: null,
    id: null,
    admin:false
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const username = localStorage.getItem("username");
      const userId = localStorage.getItem("userId");
      const admin = localStorage.getItem("admin")
      setUser({
        username,
        id: userId,
        admin:admin === "true" ? true:false
      });
    }
  }, []);

  return <Context.Provider value={[user, setUser]}>{children}</Context.Provider>;
}

export function useUserContext() {
  return useContext(Context);
}
