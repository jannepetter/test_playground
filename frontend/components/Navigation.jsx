"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/context/user";

const Navigation = () => {
  const [user, setUser] = useUserContext();
  const navItem = "text-white text-xl ml-20";
  const router = useRouter();

  if (!user?.username) {
    return (
      <div className="h-20 bg-blue-500 sticky top-0 flex items-center" data-testid="navbar">
        <span className={navItem}>The app</span>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="h-20 bg-blue-500 sticky top-0 flex items-center" data-testid="navbar">
      <Link disabled={true} className={navItem} href="/">
        Home
      </Link>
      <Link className={navItem} href="/blogs">
        Blogs
      </Link>
      <Link className={navItem} href="/blogs/create">
        Create blog
      </Link>
      {user && (
        <button className={navItem + " ml-auto mr-10"} onClick={() => handleLogout()}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Navigation;
