"use client";

import React, { useEffect, useState } from "react";
import apiClient from "@/utils/fetcher";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  let joo = "juu";
  useEffect(() => {
    console.log("appi----------", apiClient.baseURL);
    apiClient
      .get("/api/blog")
      .then((r) => {
        setBlogs(r.data);
      })
      .catch((e) => {
        console.log("err---", e);
      });
  }, []);

  return (
    <div>
      <h1>Blogs</h1>
      {blogs.map((b) => (
        <p>{b.title}</p>
      ))}
    </div>
  );
};

export default Blogs;
