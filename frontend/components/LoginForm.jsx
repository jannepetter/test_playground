"use client";
import { login } from "@/api/users";
import React, { useState } from "react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await login(username, password);
    console.log("submittia");
  };
  const inputClass = "border-2 m-5";
  return (
    <div className="bg-sky-400 ">
      <form onSubmit={handleLogin}>
        <div className="m-auto max-w-md">
          username
          <input
            className={inputClass}
            type="text"
            value={username}
            name="login-username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <br></br>
          password
          <input
            className={inputClass}
            type="text"
            value={password}
            name="login-password"
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
