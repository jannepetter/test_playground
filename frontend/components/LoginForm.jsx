"use client";

import { login } from "@/api/users";
import { useUserContext } from "@/context/user";
import { saveUserToLocalStorage } from "@/utils/storage";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginForm = () => {
  const [_, setUser] = useUserContext(); // eslint-disable-line no-unused-vars
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      saveUserToLocalStorage(response.data);
      setUser(response.data.user);
      setUsername("");
      setPassword("");
      router.push("/blogs");
    } catch (error) {
      console.log("err--", error);
      throw new Error(error.response?.data?.detail || "Login failed");
    }
  };
  const inputClass = "border-2 m-5";
  return (
    <div className="bg-sky-400 py-20">
      <h1 className="mx-auto max-w-md">Login mod</h1>
      <form onSubmit={handleLogin} data-testid="login-form">
        <div className="m-auto max-w-md">
          <label>username</label>
          <input
            className={inputClass}
            type="text"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <br></br>
          <label>password</label>
          <input
            className={inputClass}
            type="password"
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br></br>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
